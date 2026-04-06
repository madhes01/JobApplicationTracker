"use client";

import { signIn } from '@/lib/auth/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import React from 'react'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function SignIn() {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter()

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()

        setError("");
        setLoading(true);

        try {
            const result = await signIn.email({
                email,
                password
            });
            if (result.error) {
                setError(result.error.message ?? "Failed to sign in")
            } else {
                router.push("/dashboard")
            }
        } catch (err) {
            setError("An unexpected error occured")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4'>
            <Card className='w-full max-w-md border-gray-200 shadow-lg'>
                <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl font-bold text-black'>Sign In</CardTitle>
                    <CardDescription className='text-gray-600'>
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className='space-y-4'>
                        {error && (
                            <div className='rounded-md bg-destructive/15 p-3 text-sm text-destructive'>
                                {error}
                            </div>
                        )}
                        <div>
                            <Label htmlFor='email' className="text-gray-700">Email</Label>
                            <Input id="email"
                                type="email"
                                placeholder='enter your email'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="border-gray-300 focus:border-primary focus:ring-primary" />
                        </div>
                        <div>
                            <Label htmlFor='password' className="text-gray-700">Password</Label>
                            <Input id="password"
                                type="password"
                                placeholder='enter your password'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                minLength={8}
                                required
                                className="border-gray-300 focus:border-primary focus:ring-primary" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit"
                            className="w-full bg-primary hover:bg-primary/90"
                            disabled={loading}
                        >{loading ? "Signing in..." : "Sign In"}</Button>
                        <p className="text-center text-sm text-gray-600">
                            Dont have an account ?
                            <Link href="/sign-up" className="font-medium text-primary hover:underline">Sign Up</Link></p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default SignIn