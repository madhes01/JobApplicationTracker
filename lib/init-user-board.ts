import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_COLUMNS = [
    { name: "Wish List", order: 0 },
    { name: "Applied", order: 1 },
    { name: "Interviewing", order: 2 },
    { name: "Offer", order: 3 },
    { name: "Rejected", order: 4 },
];

export async function initializeUserBoard(userId: string) {
    try {
        // Check if board already exists
        console.log("initializeUserBoard called for:", userId)
        const existingBoard = await prisma.board.findFirst({
            where: { userId, name: "Job Hunt" },
        });

        if (existingBoard) {
            console.log("Board already exists:", existingBoard.id)
            return existingBoard;
        }

        // Create board AND columns together in one query
        const board = await prisma.board.create({
            data: {
                name: "Job Hunt",
                userId,
                columns: {
                    create: DEFAULT_COLUMNS.map((col) => ({
                        name: col.name,
                        order: col.order,
                    })),
                },
            },
            include: {
                columns: true, // return columns in response
            },
        });
        console.log("Board created:", board.id)
        return board;
    } catch (err) {
        console.error("initializeUserBoard error:", err)
        throw err;
    }
}