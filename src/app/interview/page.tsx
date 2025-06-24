'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { provideRealTimeFeedback } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { INTERVIEW_QUESTIONS, LOCAL_STORAGE_TRANSCRIPT_KEY } from '@/lib/constants';
import { type QAPair } from '@/lib/types';
import { Bot, ChevronLeft, Lightbulb, Loader2, Send, User } from 'lucide-react';

function InterviewPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [scenario, setScenario] = useState<Record<string, string>>({});
  const [transcript, setTranscript] = useState<{ speaker: 'interviewer' | 'user'; text: string }[]>([]);
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  
  useEffect(() => {
    const newScenario: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      newScenario[key] = value;
    }
    if (Object.keys(newScenario).length === 0) {
      toast({
        title: "No scenario found",
        description: "You're being redirected to the setup page.",
        variant: "destructive",
      });
      router.push('/');
      return;
    }
    setScenario(newScenario);
    
    const firstQuestion = INTERVIEW_QUESTIONS[0];
    setTranscript([{ speaker: 'interviewer', text: firstQuestion }]);
    setQaPairs([{ question: firstQuestion, answer: '' }]);

  }, [searchParams, router, toast]);

  const handleScrollToBottom = useCallback(() => {
    setTimeout(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }
        }
    }, 100);
  }, []);

  useEffect(() => {
    handleScrollToBottom();
  }, [transcript, handleScrollToBottom]);

  const handleSubmitResponse = async () => {
    if (!userResponse.trim() || isFeedbackLoading) return;
    
    setTranscript(prev => [...prev, { speaker: 'user', text: userResponse }]);
    
    const currentQaPair = qaPairs[currentQuestionIndex];
    const updatedQaPairs = [...qaPairs];
    updatedQaPairs[currentQuestionIndex] = { ...currentQaPair, answer: userResponse };
    setQaPairs(updatedQaPairs);

    setIsFeedbackLoading(true);
    setFeedback(null);
    setUserResponse('');

    const feedbackResult = await provideRealTimeFeedback({
      intervieweeResponse: userResponse,
      interviewerQuestion: currentQaPair.question,
      jobDescription: `Role: ${scenario.role}, Company: ${scenario.company}, Industry: ${scenario.industry}`,
      interviewerPersona: scenario.persona,
    });
    
    setFeedback(feedbackResult.feedback);
    setIsFeedbackLoading(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < INTERVIEW_QUESTIONS.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = INTERVIEW_QUESTIONS[nextIndex];
      setCurrentQuestionIndex(nextIndex);
      setTranscript(prev => [...prev, { speaker: 'interviewer', text: nextQuestion }]);
      setQaPairs(prev => [...prev, { question: nextQuestion, answer: '' }]);
      setFeedback(null);
    } else {
      handleFinishInterview();
    }
  };

  const handleFinishInterview = () => {
    setIsFinishing(true);
    const finalTranscript = qaPairs.filter(qa => qa.answer.trim() !== '');
    
    if(finalTranscript.length === 0) {
      toast({
        title: "No responses given",
        description: "Please answer at least one question before finishing.",
        variant: "destructive"
      });
      setIsFinishing(false);
      return;
    }

    try {
      const dataToStore = JSON.stringify({ transcript: finalTranscript, scenario });
      localStorage.setItem(LOCAL_STORAGE_TRANSCRIPT_KEY, dataToStore);
      router.push('/assessment');
    } catch (error) {
      console.error("Failed to save to localStorage", error);
      toast({
        title: "Error",
        description: "Could not save interview data. Please try again.",
        variant: "destructive"
      });
      setIsFinishing(false);
    }
  };

  const isLastQuestion = currentQuestionIndex === INTERVIEW_QUESTIONS.length - 1;
  const isCurrentQuestionAnswered = qaPairs[currentQuestionIndex]?.answer.trim() !== '';

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.push('/')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          New Interview
        </Button>
        <div className="text-center">
            <h1 className="text-2xl font-bold font-headline">SimuInterview</h1>
            <p className="text-sm text-muted-foreground">{scenario.role} at {scenario.company}</p>
        </div>
        <Button onClick={handleFinishInterview} disabled={isFinishing}>
          {isFinishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Finish & Assess
        </Button>
      </header>
      <main className="grid md:grid-cols-3 gap-4 flex-1">
        <aside className="md:col-span-1 space-y-4 flex flex-col">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://placehold.co/128x128.png`} data-ai-hint="professional portrait" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>AI Interviewer</CardTitle>
                <CardDescription>{scenario.persona}</CardDescription>
              </div>
            </CardHeader>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-primary" /> Real-time Feedback
              </CardTitle>
              <CardDescription>Get instant tips on your answers.</CardDescription>
            </CardHeader>
            <CardContent>
              {isFeedbackLoading && <Skeleton className="h-24 w-full" />}
              {feedback && <p className="text-sm text-foreground bg-primary/10 p-3 rounded-md">{feedback}</p>}
              {!isFeedbackLoading && !feedback && isCurrentQuestionAnswered && <p className="text-sm text-muted-foreground">Feedback will appear here.</p>}
              {!isCurrentQuestionAnswered && <p className="text-sm text-muted-foreground">Answer the question to receive feedback.</p>}
            </CardContent>
          </Card>
        </aside>
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Interview Simulation</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
              <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {transcript.map((item, index) => (
                    <div key={index} className={`flex items-start gap-3 ${item.speaker === 'user' ? 'justify-end' : ''}`}>
                      {item.speaker === 'interviewer' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`rounded-lg px-4 py-2 max-w-[85%] ${item.speaker === 'interviewer' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                        <p className="text-sm whitespace-pre-wrap">{item.text}</p>
                      </div>
                       {item.speaker === 'user' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-2">
                    <Textarea
                      placeholder="Type your answer here..."
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitResponse(); } }}
                      disabled={isCurrentQuestionAnswered}
                      rows={3}
                      className="flex-1"
                    />
                    <Button onClick={handleSubmitResponse} disabled={userResponse.trim() === '' || isCurrentQuestionAnswered || isFeedbackLoading} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                </div>
                {isCurrentQuestionAnswered && (
                  <Button onClick={handleNextQuestion} disabled={isFeedbackLoading}>
                    {isFeedbackLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {isFeedbackLoading ? 'Analyzing...' : (isLastQuestion ? 'Finish' : 'Next Question')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}


export default function InterviewPage() {
    return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <InterviewPageComponent />
      </Suspense>
    );
}
