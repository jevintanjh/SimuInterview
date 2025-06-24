
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeInterviewResponse } from '@/app/actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { LOCAL_STORAGE_TRANSCRIPT_KEY } from '@/lib/constants';
import type { InterviewData, StarAssessment } from '@/lib/types';
import { ChevronLeft, ClipboardList, Loader2, Star, XCircle } from 'lucide-react';

function AssessmentReport({ assessments }: { assessments: ({ interviewQuestion: string } & StarAssessment)[] }) {
    if (!assessments.length) return null;

    return (
        <Accordion type="single" collapsible className="w-full space-y-2">
            {assessments.map((assessment, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="bg-card border rounded-md px-4">
                    <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-semibold">Q{index + 1}: {assessment.interviewQuestion}</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <h4 className="font-semibold text-primary">Overall Feedback</h4>
                            <p>{assessment.overallFeedback}</p>
                            
                            <h4 className="font-semibold text-primary mt-4">STAR Analysis</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h5 className="font-semibold flex items-center gap-1"><Star className="w-4 h-4 text-amber-400"/>Situation</h5>
                                    <p className="text-sm text-muted-foreground">{assessment.starAssessment.situation}</p>
                                </div>
                                <div className="space-y-1">
                                    <h5 className="font-semibold flex items-center gap-1"><Star className="w-4 h-4 text-amber-400"/>Task</h5>
                                    <p className="text-sm text-muted-foreground">{assessment.starAssessment.task}</p>
                                </div>
                                <div className="space-y-1">
                                    <h5 className="font-semibold flex items-center gap-1"><Star className="w-4 h-4 text-amber-400"/>Action</h5>
                                    <p className="text-sm text-muted-foreground">{assessment.starAssessment.action}</p>
                                </div>
                                <div className="space-y-1">
                                    <h5 className="font-semibold flex items-center gap-1"><Star className="w-4 h-4 text-amber-400"/>Result</h5>
                                    <p className="text-sm text-muted-foreground">{assessment.starAssessment.result}</p>
                                </div>
                            </div>

                            {assessment.suggestions.length > 0 && (
                                <>
                                    <h4 className="font-semibold text-primary mt-4">Suggestions for Improvement</h4>
                                    <ul className="list-disc pl-5 space-y-1">
                                        {assessment.suggestions.map((s, i) => (
                                            <li key={i} className="text-sm text-muted-foreground">{s}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

function AssessmentPageComponent() {
  const router = useRouter();
  const { toast } = useToast();
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [assessments, setAssessments] = useState<({ interviewQuestion: string } & StarAssessment)[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_TRANSCRIPT_KEY);
      if (!storedData) {
        toast({ title: 'No interview data found.', description: 'Redirecting to start a new interview.', variant: 'destructive' });
        router.replace('/');
        return;
      }
      const parsedData: InterviewData = JSON.parse(storedData);
      setInterviewData(parsedData);
    } catch (error) {
      toast({ title: 'Failed to load interview data.', variant: 'destructive' });
      router.replace('/');
    }
  }, [router, toast]);
  
  useEffect(() => {
    if (interviewData) {
      const generateAssessments = async () => {
        setIsLoading(true);
        const assessmentPromises = interviewData.transcript.map(qa =>
          analyzeInterviewResponse({
            interviewQuestion: qa.question,
            userResponse: qa.answer,
            role: interviewData.scenario.role,
            industry: interviewData.scenario.industry,
            language: interviewData.scenario.language || 'en',
          }).then(res => ({ ...res, interviewQuestion: qa.question }))
          .catch(err => {
            console.error("Failed to analyze a response:", err);
            toast({
              title: "Analysis Error",
              description: `Could not analyze the answer for: "${qa.question.substring(0, 30)}..."`,
              variant: "destructive"
            });
            return null;
          })
        );

        const results = await Promise.all(assessmentPromises);
        const validResults = results.filter((r): r is { interviewQuestion: string } & StarAssessment => r !== null);
        setAssessments(validResults);
        setIsLoading(false);
      };
      generateAssessments();
    }
  }, [interviewData, toast]);


  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
      <header className="flex items-center justify-between mb-8">
         <Button variant="outline" size="sm" onClick={() => router.push('/')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Start New Interview
        </Button>
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Interview Assessment</h1>
            {interviewData && <p className="text-muted-foreground">{interviewData.scenario.role} at {interviewData.scenario.company}</p>}
        </div>
        <div />
      </header>

      <main className="max-w-4xl mx-auto">
        <Card className="mb-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ClipboardList /> Assessment Report</CardTitle>
                <CardDescription>Here's a detailed breakdown of your performance based on the STAR method.</CardDescription>
            </CardHeader>
        </Card>
        
        {isLoading && (
            <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        )}

        {!isLoading && assessments.length > 0 && <AssessmentReport assessments={assessments} />}
        
        {!isLoading && assessments.length === 0 && interviewData && (
             <Card>
                <CardContent className="pt-6 text-center">
                    <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                    <h3 className="text-xl font-semibold">Analysis Failed</h3>
                    <p className="text-muted-foreground mt-2">We couldn't generate your assessment report. Please try another interview.</p>
                </CardContent>
             </Card>
        )}
      </main>
    </div>
  );
}

export default function AssessmentPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <AssessmentPageComponent />
        </Suspense>
    )
}
