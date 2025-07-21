'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { provideRealTimeFeedback, speechToText, textToSpeech } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ROLE_BASED_INTERVIEW_QUESTIONS, LOCAL_STORAGE_TRANSCRIPT_KEY } from '@/lib/constants';
import type { QAPair } from '@/lib/types';
import { Bot, ChevronLeft, ChevronRight, Lightbulb, Loader2, Mic, Send, Square, Text, User } from 'lucide-react';
import { Logo } from '@/components/logo';

function InterviewPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const [scenario, setScenario] = useState<Record<string, string>>({});
  const [transcript, setTranscript] = useState<{ speaker: 'interviewer' | 'user'; text: string }[]>([]);
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  const [interviewerAudioUrl, setInterviewerAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingResponse, setIsProcessingResponse] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioPermissionGranted, setAudioPermissionGranted] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [textResponse, setTextResponse] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isProcessing = isProcessingResponse || isGeneratingAudio || isFinishing;

  // Permission check
  useEffect(() => {
    setIsMounted(true);
    if (inputMode === 'voice') {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => setAudioPermissionGranted(true))
        .catch(() => {
          setAudioPermissionGranted(false);
          setInputMode('text'); // Fallback to text mode
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use voice input. Switched to text mode.",
            variant: "destructive",
          });
        });
    }
  }, [inputMode, toast]);

  const getInterviewerAudio = useCallback(async (text: string) => {
    if (!text) return;
    setIsGeneratingAudio(true);
    setInterviewerAudioUrl(null);
    try {
      const { audioDataUri } = await textToSpeech(text);
      if (audioDataUri) {
        setInterviewerAudioUrl(audioDataUri);
      } else {
        toast({
          title: 'Audio Generation Unavailable',
          description: 'You can continue the interview using the microphone or text input.',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      toast({ title: "Audio Generation Failed", variant: "destructive" });
    } finally {
      setIsGeneratingAudio(false);
    }
  }, [toast]);

  const handleFinishInterview = useCallback(() => {
    if (isFinishing) return;
    setIsFinishing(true);
    const finalTranscript = qaPairs.filter(qa => qa.answer.trim() !== '');
    if(finalTranscript.length === 0) {
      toast({ title: "No responses recorded", description: "Finishing interview without assessment.", variant: "destructive" });
      router.push('/');
      return;
    }
    try {
      localStorage.setItem(LOCAL_STORAGE_TRANSCRIPT_KEY, JSON.stringify({ transcript: finalTranscript, scenario }));
      router.push('/assessment');
    } catch (error) {
      console.error("Failed to save to localStorage", error);
      toast({ title: "Could not save interview data.", variant: "destructive" });
      setIsFinishing(false);
    }
  }, [isFinishing, qaPairs, router, scenario, toast]);

  const handleNextQuestion = useCallback(() => {
    const language = scenario.language || 'en';
    const role = scenario.role || 'General';

    const languageQuestions = ROLE_BASED_INTERVIEW_QUESTIONS[language] || ROLE_BASED_INTERVIEW_QUESTIONS.en;
    const questions = languageQuestions[role] || languageQuestions.General;

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = questions[nextIndex];
      setCurrentQuestionIndex(nextIndex);
      setTranscript(prev => [...prev, { speaker: 'interviewer', text: nextQuestion }]);
      setQaPairs(prev => [...prev, { question: nextQuestion, answer: '' }]);
      setFeedback(null);
      setShowNextButton(false);
      getInterviewerAudio(nextQuestion);
    } else {
      handleFinishInterview();
    }
  }, [currentQuestionIndex, getInterviewerAudio, scenario, handleFinishInterview]);

  // Initial setup
  useEffect(() => {
    if (!isMounted) return;

    const newScenario: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      newScenario[key] = value;
    }

    if (Object.keys(newScenario).length === 0) {
      router.replace('/');
      return;
    }

    setScenario(newScenario);
    setInputMode((newScenario.mode as 'voice' | 'text') || 'voice');

    const language = newScenario.language || 'en';
    const role = newScenario.role || 'General';

    const languageQuestions = ROLE_BASED_INTERVIEW_QUESTIONS[language] || ROLE_BASED_INTERVIEW_QUESTIONS.en;
    const questions = languageQuestions[role] || languageQuestions.General;
    const firstQuestion = questions[0];

    setTranscript([{ speaker: 'interviewer', text: firstQuestion }]);
    setQaPairs([{ question: firstQuestion, answer: '' }]);
    getInterviewerAudio(firstQuestion);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);


  const handleScrollToBottom = useCallback(() => {
    if (scrollViewportRef.current) {
        const viewport = scrollViewportRef.current;
        setTimeout(() => {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }, 100);
    }
  }, []);

  useEffect(() => {
    handleScrollToBottom();
  }, [transcript, feedback, handleScrollToBottom]);


  const processUserResponse = useCallback(async (response: string) => {
    setIsProcessingResponse(true);
    setFeedback(null);
    setShowNextButton(false);
    try {
        if (!response.trim()) {
            toast({ title: "No response detected", description: "Please try again.", variant: "destructive" });
            return;
        }

        setTranscript(prev => [...prev, { speaker: 'user', text: response }]);

        const currentQaPair = qaPairs[currentQuestionIndex];
        const updatedQaPairs = [...qaPairs];
        updatedQaPairs[currentQuestionIndex] = { ...currentQaPair, answer: response };
        setQaPairs(updatedQaPairs);

        const feedbackResult = await provideRealTimeFeedback({
            intervieweeResponse: response,
            interviewerQuestion: currentQaPair?.question || '',
            jobDescription: `Role: ${scenario.role}, Company: ${scenario.company}, Industry: ${scenario.industry}`,
            interviewerPersona: scenario.persona,
            language: scenario.language || 'en',
        });
        setFeedback(feedbackResult.feedback);
        setShowNextButton(true);

    } catch (error) {
        console.error("Error processing response:", error);
        toast({ title: "Response Processing Failed", variant: "destructive" });
    } finally {
        setIsProcessingResponse(false);
    }
  }, [qaPairs, currentQuestionIndex, scenario, toast]);

  const startRecording = useCallback(async () => {
    if (!audioPermissionGranted || isRecording || inputMode !== 'voice') return;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = (event) => audioChunksRef.current.push(event.data);
        mediaRecorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
              setIsProcessingResponse(true);
              try {
                const { transcription } = await speechToText({ audioDataUri: reader.result as string });
                await processUserResponse(transcription);
              } catch(e) {
                console.error("Transcription error", e);
                toast({title: "Transcription Failed", variant: "destructive"})
                setIsProcessingResponse(false);
              }
            }
            stream.getTracks().forEach(track => track.stop());
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
    } catch (err) {
        console.error("Error starting recording:", err);
        toast({ title: "Could not start recording.", variant: "destructive" });
    }
  }, [audioPermissionGranted, isRecording, inputMode, toast, processUserResponse]);

  const stopRecording = useCallback(() => {
      if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
      }
  }, []);

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textResponse.trim() || isProcessing) return;
    await processUserResponse(textResponse);
    setTextResponse('');
  };

  useEffect(() => {
    if (interviewerAudioUrl && audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio autoplay failed:", e));
    }
  }, [interviewerAudioUrl]);

  const currentQaPair = qaPairs[currentQuestionIndex];

  if (!isMounted || !currentQaPair) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold font-headline">Ace8</h1>
            <p className="text-sm text-muted-foreground hidden md:block">{scenario.role} at {scenario.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/')} disabled={isProcessing}>
              <ChevronLeft className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">New Interview</span>
            </Button>
            <Button onClick={handleFinishInterview} disabled={isProcessing}>
              {isFinishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Finish & Assess
            </Button>
        </div>
      </header>
      <main className="grid md:grid-cols-3 gap-4 flex-1">
        <aside className="md:col-span-1 space-y-4 flex flex-col">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <Avatar className="h-12 w-12">
                <AvatarImage src={'https://placehold.co/128x128.png'} data-ai-hint="professional portrait" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>AI Interviewer</CardTitle>
                <CardDescription>{scenario.persona}</CardDescription>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="input-mode-toggle" className="flex items-center gap-2">
                  <Text className="h-4 w-4" /> Input Mode
                </Label>
                <div className="flex items-center gap-2">
                  <Label htmlFor="input-mode-toggle" className="text-sm text-muted-foreground">Text</Label>
                  <Switch 
                    id="input-mode-toggle"
                    checked={inputMode === 'voice'}
                    onCheckedChange={(checked) => setInputMode(checked ? 'voice' : 'text')}
                    disabled={audioPermissionGranted === false}
                  />
                  <Label htmlFor="input-mode-toggle" className="text-sm text-muted-foreground">Voice</Label>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-primary" /> Real-time Feedback
              </CardTitle>
              <CardDescription>Get instant tips on your answers.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {isProcessingResponse && !feedback && <Skeleton className="h-24 w-full" />}
              {feedback && <p className="text-sm text-foreground bg-primary/10 p-3 rounded-md">{feedback}</p>}
            </CardContent>
            {feedback && showNextButton && (
                <CardFooter className="pt-0">
                    <Button onClick={handleNextQuestion} disabled={isProcessing} className="w-full">
                        Next Question <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            )}
          </Card>
        </aside>
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Interview Simulation</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
              <ScrollArea className="flex-1 pr-4 -mr-4" viewportRef={scrollViewportRef}>
                <div className="space-y-4">
                  {transcript.map((item, index) => (
                    <div key={index} className={`flex items-start gap-3 ${item.speaker === 'user' ? 'justify-end' : ''}`}>
                      {item.speaker === 'interviewer' && (
                        <Avatar className="h-8 w-8"><AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback></Avatar>
                      )}
                      <div className={`rounded-lg px-4 py-2 max-w-[85%] ${item.speaker === 'interviewer' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                        <p className="text-sm whitespace-pre-wrap">{item.text}</p>
                      </div>
                       {item.speaker === 'user' && (
                        <Avatar className="h-8 w-8"><AvatarFallback><User className="h-5 w-5"/></AvatarFallback></Avatar>
                      )}
                    </div>
                  ))}
                   {isProcessing && !isFinishing && !feedback && (
                    <div className="flex justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                   )}
                </div>
              </ScrollArea>
              <div className="flex flex-col gap-2 pt-4 border-t">
                 <audio ref={audioRef} src={interviewerAudioUrl ?? undefined} onEnded={inputMode === 'voice' ? startRecording : undefined} className="hidden" />
                 {inputMode === 'voice' ? (
                    <div className="flex justify-center items-center gap-4">
                      {isRecording ? (
                          <Button onClick={stopRecording} variant="destructive" size="lg" className="rounded-full w-20 h-20">
                              <Square className="h-8 w-8" />
                              <span className="sr-only">Stop Recording</span>
                          </Button>
                      ) : (
                          <Button onClick={startRecording} size="lg" className="rounded-full w-20 h-20" disabled={isProcessing || isRecording}>
                              {isProcessing ? <Loader2 className="h-8 w-8 animate-spin" /> : <Mic className="h-8 w-8" />}
                              <span className="sr-only">Waiting to Record</span>
                          </Button>
                      )}
                    </div>
                 ) : (
                    <form onSubmit={handleTextSubmit} className="flex w-full items-start gap-2">
                      <Textarea 
                        placeholder="Type your response..."
                        value={textResponse}
                        onChange={(e) => setTextResponse(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleTextSubmit(e);
                          }
                        }}
                        rows={3}
                        className="flex-1"
                        disabled={isProcessing}
                      />
                      <Button type="submit" size="icon" disabled={isProcessing}>
                        {isProcessingResponse ? <Loader2 className="animate-spin" /> : <Send />}
                        <span className="sr-only">Send</span>
                      </Button>
                    </form>
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