import { betterAuth } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Pool } from "pg";
import { initializeUserBoard } from "../init-user-board";
import type { User } from "better-auth";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
    database: pool,
    emailAndPassword: {
        enabled: true,
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user: User) => {
                    console.log("User created hook fired:", user.id)
                    if (user.id) {
                        await initializeUserBoard(user.id);
                    }
                }
            }
        }
    },
});

export async function getSession() {
    const result = await auth.api.getSession({
        headers: await headers()
    });

    return result;
}

export async function signOut() {
    const result = await auth.api.signOut({
        headers: await headers()
    });

    if (result.success) {
        redirect("/sign-in");
    }
}

{/* import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
await client.connect();

const db = client.db(); 

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    }
})

*/}

