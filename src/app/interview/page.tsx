'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { provideRealTimeFeedback, speechToText, textToSpeech } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { INTERVIEW_QUESTIONS, LOCAL_STORAGE_TRANSCRIPT_KEY } from '@/lib/constants';
import { type QAPair } from '@/lib/types';
import { Bot, ChevronLeft, Lightbulb, Loader2, Mic, MicOff, User } from 'lucide-react';

function InterviewPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [scenario, setScenario] = useState<Record<string, string>>({});
  const [transcript, setTranscript] = useState<{ speaker: 'interviewer' | 'user'; text: string }[]>([]);
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  const [interviewerAudioUrl, setInterviewerAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioPermissionGranted, setAudioPermissionGranted] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const getInterviewerAudio = useCallback(async (text: string) => {
    setIsGeneratingAudio(true);
    setInterviewerAudioUrl(null);
    try {
      const { audioDataUri } = await textToSpeech(text);
      setInterviewerAudioUrl(audioDataUri);
    } catch (error) {
      console.error("Error generating audio:", error);
      toast({ title: "Audio Generation Failed", variant: "destructive" });
    } finally {
      setIsGeneratingAudio(false);
    }
  }, [toast]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setAudioPermissionGranted(true))
      .catch(() => {
        setAudioPermissionGranted(false);
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access in your browser settings to proceed.",
          variant: "destructive",
        });
      });
  }, [toast]);
  
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
    getInterviewerAudio(firstQuestion);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router, toast]);

  useEffect(() => {
    if (interviewerAudioUrl && audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio autoplay failed:", e));
    }
  }, [interviewerAudioUrl]);

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

  const handleTranscription = async (audioDataUri: string) => {
    setIsTranscribing(true);
    setFeedback(null);
    try {
        const { transcription } = await speechToText({ audioDataUri });
        if (!transcription.trim()) {
            toast({ title: "Couldn't hear you", description: "Could you please try again?", variant: "destructive" });
            setIsTranscribing(false);
            return;
        }

        setTranscript(prev => [...prev, { speaker: 'user', text: transcription }]);
        
        const currentQaPair = qaPairs[currentQuestionIndex];
        const updatedQaPairs = [...qaPairs];
        updatedQaPairs[currentQuestionIndex] = { ...currentQaPair, answer: transcription };
        setQaPairs(updatedQaPairs);

        const feedbackResult = await provideRealTimeFeedback({
            intervieweeResponse: transcription,
            interviewerQuestion: currentQaPair.question,
            jobDescription: `Role: ${scenario.role}, Company: ${scenario.company}, Industry: ${scenario.industry}`,
            interviewerPersona: scenario.persona,
        });
        setFeedback(feedbackResult.feedback);

    } catch (error) {
        console.error("Error transcribing audio:", error);
        toast({ title: "Transcription Failed", description: "Please try recording your answer again.", variant: "destructive" });
    } finally {
        setIsTranscribing(false);
    }
  };

  const startRecording = async () => {
    if (!audioPermissionGranted) {
        toast({ title: "Microphone access is required.", variant: 'destructive' });
        return;
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
                const base64data = reader.result as string;
                handleTranscription(base64data);
            };
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
    } catch (err) {
        console.error("Error starting recording:", err);
        toast({ title: "Could not start recording.", variant: "destructive" });
    }
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
      }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < INTERVIEW_QUESTIONS.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = INTERVIEW_QUESTIONS[nextIndex];
      setCurrentQuestionIndex(nextIndex);
      setTranscript(prev => [...prev, { speaker: 'interviewer', text: nextQuestion }]);
      setQaPairs(prev => [...prev, { question: nextQuestion, answer: '' }]);
      setFeedback(null);
      getInterviewerAudio(nextQuestion);
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
  const isProcessing = isTranscribing || isGeneratingAudio;

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
        <Button onClick={handleFinishInterview} disabled={isFinishing || isProcessing}>
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
              {isTranscribing && <Skeleton className="h-24 w-full" />}
              {feedback && <p className="text-sm text-foreground bg-primary/10 p-3 rounded-md">{feedback}</p>}
              {!isTranscribing && !feedback && isCurrentQuestionAnswered && <p className="text-sm text-muted-foreground">Feedback will appear here.</p>}
              {!isCurrentQuestionAnswered && <p className="text-sm text-muted-foreground">Record your answer to get feedback.</p>}
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
                 {interviewerAudioUrl && <audio ref={audioRef} src={interviewerAudioUrl} className="hidden" />}

                 <div className="flex justify-center items-center gap-4 py-4 border-t">
                    {isRecording ? (
                        <Button onClick={stopRecording} variant="destructive" size="lg" className="rounded-full w-20 h-20">
                            <MicOff className="h-8 w-8" />
                            <span className="sr-only">Stop Recording</span>
                        </Button>
                    ) : (
                        <Button onClick={startRecording} size="lg" className="rounded-full w-20 h-20" disabled={audioPermissionGranted === false || isCurrentQuestionAnswered || isProcessing}>
                            {isProcessing ? (
                                <Loader2 className="h-8 w-8 animate-spin" />
                            ) : (
                                <Mic className="h-8 w-8" />
                            )}
                            <span className="sr-only">Start Recording</span>
                        </Button>
                    )}
                </div>
                
                {isCurrentQuestionAnswered && (
                  <Button onClick={handleNextQuestion} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {isProcessing ? 'Processing...' : (isLastQuestion ? 'Finish' : 'Next Question')}
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
