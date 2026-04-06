import { betterAuth } from "better-auth";
import { headers } from "next/headers";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
    database: pool,
    emailAndPassword: {
        enabled: true,
    }
});

export async function getSession() {
    const result = await auth.api.getSession({
        headers: await headers()
    });

    return result;
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

