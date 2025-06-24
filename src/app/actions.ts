'use server';

import { provideRealTimeFeedback as provideRealTimeFeedbackFlow, ProvideRealTimeFeedbackInput } from '@/ai/flows/provide-real-time-feedback';
import { analyzeInterviewResponse as analyzeInterviewResponseFlow, AnalyzeInterviewResponseInput } from '@/ai/flows/analyze-interview-response';
import { generateInterviewerPersona as generateInterviewerPersonaFlow, GenerateInterviewerPersonaInput } from '@/ai/flows/generate-interviewer-persona';

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
