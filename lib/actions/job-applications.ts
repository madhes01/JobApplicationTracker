"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import prisma from "../db/prisma-client";

interface JobApplicationData {
    company: string;
    position: string;
    location?: string;
    notes?: string;
    salary?: string;
    jobUrl?: string;
    columnId: string;
    boardId: string;
    tags?: string[];
    description?: string;
}

export async function createJobApplication(data: JobApplicationData) {
    const session = await getSession();

    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    const {
        company,
        position,
        location,
        notes,
        salary,
        jobUrl,
        columnId,
        boardId,
        tags,
        description,
    } = data;

    if (!company || !position || !columnId || !boardId) {
        return { error: "Missing required fields" };
    }

    // Verify board ownership
    const board = await prisma.board.findFirst({
        where: { id: boardId, userId: session.user.id },
    });

    if (!board) {
        return { error: "Board not found" };
    }

    // Verify column belongs to board
    const column = await prisma.column.findFirst({
        where: { id: columnId, boardId },
    });

    if (!column) {
        return { error: "Column not found" };
    }

    // Get max order in column
    const maxOrderJob = await prisma.jobApplication.findFirst({
        where: { columnId },
        orderBy: { order: "desc" },
        select: { order: true },
    });

    const jobApplication = await prisma.jobApplication.create({
        data: {
            company,
            position,
            location,
            notes,
            salary,
            jobUrl,
            columnId,
            boardId,
            userId: session.user.id,
            tags: tags || [],
            description,
            status: "applied",
            order: maxOrderJob ? maxOrderJob.order + 1 : 0,
        },
    });

    revalidatePath("/dashboard");

    return { data: JSON.parse(JSON.stringify(jobApplication)) };
}

export async function updateJobApplication(
    id: string,
    updates: {
        company?: string;
        position?: string;
        location?: string;
        notes?: string;
        salary?: string;
        jobUrl?: string;
        columnId?: string;
        order?: number;
        tags?: string[];
        description?: string;
    }
) {
    const session = await getSession();

    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    const jobApplication = await prisma.jobApplication.findUnique({
        where: { id },
    });

    if (!jobApplication) {
        return { error: "Job application not found" };
    }

    if (jobApplication.userId !== session.user.id) {
        return { error: "Unauthorized" };
    }

    const { columnId, order, ...otherUpdates } = updates;

    const currentColumnId = jobApplication.columnId;
    const newColumnId = columnId;
    const isMovingToDifferentColumn =
        newColumnId && newColumnId !== currentColumnId;

    let newOrderValue = jobApplication.order;

    if (isMovingToDifferentColumn) {
        const jobsInTargetColumn = await prisma.jobApplication.findMany({
            where: { columnId: newColumnId, id: { not: id } },
            orderBy: { order: "asc" },
        });

        if (order !== undefined && order !== null) {
            newOrderValue = order * 100;

            const jobsThatNeedToShift = jobsInTargetColumn.slice(order);
            for (const job of jobsThatNeedToShift) {
                await prisma.jobApplication.update({
                    where: { id: job.id },
                    data: { order: job.order + 100 },
                });
            }
        } else {
            if (jobsInTargetColumn.length > 0) {
                const lastJob = jobsInTargetColumn[jobsInTargetColumn.length - 1];
                newOrderValue = (lastJob.order || 0) + 100;
            } else {
                newOrderValue = 0;
            }
        }
    } else if (order !== undefined && order !== null) {
        const otherJobsInColumn = await prisma.jobApplication.findMany({
            where: { columnId: currentColumnId, id: { not: id } },
            orderBy: { order: "asc" },
        });

        const currentJobOrder = jobApplication.order || 0;
        const currentPositionIndex = otherJobsInColumn.findIndex(
            (job) => job.order > currentJobOrder
        );
        const oldPositionIndex =
            currentPositionIndex === -1
                ? otherJobsInColumn.length
                : currentPositionIndex;

        newOrderValue = order * 100;

        if (order < oldPositionIndex) {
            const jobsToShiftDown = otherJobsInColumn.slice(order, oldPositionIndex);
            for (const job of jobsToShiftDown) {
                await prisma.jobApplication.update({
                    where: { id: job.id },
                    data: { order: job.order + 100 },
                });
            }
        } else if (order > oldPositionIndex) {
            const jobsToShiftUp = otherJobsInColumn.slice(oldPositionIndex, order);
            for (const job of jobsToShiftUp) {
                await prisma.jobApplication.update({
                    where: { id: job.id },
                    data: { order: Math.max(0, job.order - 100) },
                });
            }
        }
    }

    const updated = await prisma.jobApplication.update({
        where: { id },
        data: {
            ...otherUpdates,
            ...(isMovingToDifferentColumn && { columnId: newColumnId }),
            order: newOrderValue,
        },
    });

    revalidatePath("/dashboard");

    return { data: JSON.parse(JSON.stringify(updated)) };
}

export async function deleteJobApplication(id: string) {
    const session = await getSession();

    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    const jobApplication = await prisma.jobApplication.findUnique({
        where: { id },
    });

    if (!jobApplication) {
        return { error: "Job application not found" };
    }

    if (jobApplication.userId !== session.user.id) {
        return { error: "Unauthorized" };
    }

    await prisma.jobApplication.delete({
        where: { id },
    });

    revalidatePath("/dashboard");

    return { success: true };
}