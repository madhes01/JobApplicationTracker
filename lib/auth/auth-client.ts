import { betterAuth } from "better-auth";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL!
});

 {/* "!" this is for accerting the value */}


export const {signIn, signUp, signOut, useSession} = authClient