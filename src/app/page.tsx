'use client';

import { useAuth } from '@/contexts/auth-context';
import { ScenarioForm } from '@/components/scenario-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { UserNav } from '@/components/auth/user-nav';

function LoginPage() {
    const { signInWithGoogle, loading } = useAuth();
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background">
            <div className="w-full max-w-md mx-auto text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                        SimuInterview
                    </h1>
                </div>
                <p className="text-lg text-muted-foreground mb-8">
                    Practice interviews with an AI-powered simulator.
                </p>
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome</CardTitle>
                        <CardDescription>Sign in to start your interview practice.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={signInWithGoogle} className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign in with Google
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

function AuthenticatedHomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background">
            <div className="absolute top-4 right-4">
                <UserNav />
            </div>
            <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                            SimuInterview
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        Practice interviews with an AI-powered simulator.
                    </p>
                </div>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Create Your Interview Scenario</CardTitle>
                        <CardDescription>Fill in the details below to start your personalized interview simulation.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScenarioForm />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

export default function Home() {
    const { user } = useAuth();
    
    if (!user) {
        return <LoginPage />;
    }

    return <AuthenticatedHomePage />;
}
