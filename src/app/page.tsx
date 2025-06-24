'use client';

import { ScenarioForm } from '@/components/scenario-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function Home() {

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background">
            <div className="w-full max-w-2xl mx-auto">
                <header className="flex justify-center items-center mb-8 w-full">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                            SimuInterview
                        </h1>
                    </div>
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
