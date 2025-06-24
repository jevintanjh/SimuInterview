'use server';

import { provideRealTimeFeedback as provideRealTimeFeedbackFlow, ProvideRealTimeFeedbackInput } from '@/ai/flows/provide-real-time-feedback';
import { analyzeInterviewResponse as analyzeInterviewResponseFlow, AnalyzeInterviewResponseInput } from '@/ai/flows/analyze-interview-response';
import { generateInterviewerPersona as generateInterviewerPersonaFlow, GenerateInterviewerPersonaInput } from '@/ai/flows/generate-interviewer-persona';
import { speechToText as speechToTextFlow, SpeechToTextInput } from '@/ai/flows/speech-to-text';
import { textToSpeech as textToSpeechFlow, TextToSpeechInput } from '@/ai/flows/text-to-speech';

export async function provideRealTimeFeedback(input: ProvideRealTimeFeedbackInput) {
    try {
        return await provideRealTimeFeedbackFlow(input);
    } catch (error) {
        console.error("Error in provideRealTimeFeedback:", error);
        return { feedback: "Sorry, I couldn't process that. Let's try again." };
    }
}

export async function analyzeInterviewResponse(input: AnalyzeInterviewResponseInput) {
    return await analyzeInterviewResponseFlow(input);
}

export async function generateInterviewerPersona(input: GenerateInterviewerPersonaInput) {
    return await generateInterviewerPersonaFlow(input);
}

export async function speechToText(input: SpeechToTextInput) {
    return await speechToTextFlow(input);
}

export async function textToSpeech(input: TextToSpeechInput) {
    return await textToSpeechFlow(input);
}
