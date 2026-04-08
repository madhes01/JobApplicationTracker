import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/dist/client/components/navigation";
import prisma from "@/lib/db/prisma-client";
import KanbanBoard from "@/components/kanban-board";


async function Dashboard() {

  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const board = await prisma.board.findFirst({
    where: {
      userId: session.user.id,
      name: "Madhes",
    }
  })

  console.log("Board:", board)

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black;">Job Hunt</h1>
          <p className="text-gray-600">Track your job applications</p>
        </div>
        <KanbanBoard board={board} userId={session.user.id} />
      </div>
    </div>
  )
}

export default Dashboard