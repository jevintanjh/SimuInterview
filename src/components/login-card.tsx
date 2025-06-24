'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Tv, Users, Bot, Loader2 } from 'lucide-react';


function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="24px"
        height="24px"
        {...props}
      >
        <path
          fill="#4285F4"
          d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.11-5.52c-2.17 1.45-4.92 2.3-8.78 2.3-6.8 0-12.55-4.58-14.6-10.69H1.29v5.7C5.24 42.13 13.82 48 24 48z"
        />
        <path
          fill="#FBBC05"
          d="M9.4 28.19c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59V13.31H1.29C.48 15.7.01 18.29 0 21c0 2.71.48 5.3 1.29 7.7l8.11-6.51z"
        />
        <path
          fill="#EA4335"
          d="M24 9.4c3.48 0 6.31 1.22 8.61 3.39l6.31-6.31C35.91 2.13 30.48 0 24 0 13.82 0 5.24 5.87 1.29 13.31l8.11 6.51c2.05-6.11 7.8-10.42 14.6-10.42z"
        />
      </svg>
    )
  }

export function LoginCard() {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<'google' | 'email' | null>(null);

    const handleGoogleSignIn = async () => {
        setLoading('google');
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            if (!user) setLoading(null);
        }
    };

    const handleEmailSubmit = async (type: 'signIn' | 'signUp') => {
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        if (type === 'signUp' && password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading('email');
        setError(null);
        try {
            if (type === 'signIn') {
                await signInWithEmail(email, password);
            } else {
                await signUpWithEmail(email, password);
            }
        } catch (err: any) {
            const friendlyMessage = err.code?.includes('auth/invalid-credential') 
                ? 'Invalid credentials. Please check your email and password.'
                : err.code?.includes('auth/email-already-in-use')
                ? 'This email is already registered.'
                : 'An error occurred. Please try again.';
            setError(friendlyMessage);
        } finally {
            setLoading(null);
        }
    };

    const { user } = useAuth();


    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 p-4">
             <div className="max-w-md space-y-6">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                        SimuInterview
                    </h1>
                </div>
                <p className="text-lg text-muted-foreground">
                    Practice interviews with an AI-powered simulator. Get instant feedback and improve your skills.
                </p>
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-full">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Realistic AI Interviewer</h3>
                            <p className="text-sm text-muted-foreground">Face different interviewer personas and answer common questions for your target role.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-full">
                            <Tv className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Competency-Based Feedback</h3>
                            <p className="text-sm text-muted-foreground">Receive a detailed assessment of your performance based on key job competencies.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-full">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Practice Makes Perfect</h3>
                            <p className="text-sm text-muted-foreground">Use your free trials to hone your answers and build confidence for your next real interview.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Card className="w-full max-w-sm shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle>Get Started</CardTitle>
                    <CardDescription>Sign in to begin your 3 free interview simulations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                         <Button onClick={handleGoogleSignIn} disabled={!!loading} className="w-full">
                            {loading === 'google' ? <Loader2 className="mr-2 animate-spin" /> : <GoogleIcon className="mr-2" />}
                            Sign in with Google
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Or with email
                                </span>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!loading} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={!!loading} />
                        </div>

                         {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}

                        <div className="flex gap-2">
                            <Button onClick={() => handleEmailSubmit('signIn')} disabled={loading === 'email' || loading === 'google'} className="flex-1">
                                {loading === 'email' ? <Loader2 className="animate-spin" /> : 'Sign In'}
                            </Button>
                            <Button onClick={() => handleEmailSubmit('signUp')} disabled={loading === 'email' || loading === 'google'} variant="secondary" className="flex-1">
                               Sign Up
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
