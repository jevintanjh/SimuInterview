'use client';

import { ScenarioForm } from '@/components/scenario-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { LoginCard } from '@/components/login-card';
import { UserNav } from '@/components/auth/user-nav';

export default function Home() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
             <div className="flex min-h-screen flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!user) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background">
                <LoginCard />
            </main>
        )
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background">
            <div className="w-full max-w-2xl mx-auto">
                <header className="flex justify-between items-center mb-8 w-full">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                            SimuInterview
                        </h1>
                    </div>
                    <UserNav />
                </header>
                <p className="text-lg text-muted-foreground text-center mb-8">
                    Practice interviews with an AI-powered simulator.
                </p>
                <Card className="shadow-lg w-full">
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
