'use server';

/**
 * @fileOverview Provides real-time feedback during the interview simulation.
 *
 * - provideRealTimeFeedback - A function that provides real-time feedback.
 * - ProvideRealTimeFeedbackInput - The input type for the provideRealTimeFeedback function.
 * - ProvideRealTimeFeedbackOutput - The return type for the provideRealTimeFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideRealTimeFeedbackInputSchema = z.object({
  intervieweeResponse: z
    .string()
    .describe('The interviewee\'s response to the current question.'),
  interviewerQuestion: z.string().describe('The current question asked by the interviewer.'),
  interviewerPersona: z.string().describe('The persona of the interviewer.'),
  jobDescription: z.string().describe('The job description for the role being interviewed for.'),
  language: z.string().describe('The language for the feedback (e.g., "English", "Japanese").'),
});
export type ProvideRealTimeFeedbackInput = z.infer<typeof ProvideRealTimeFeedbackInputSchema>;

const ProvideRealTimeFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Real-time feedback on the interviewee\'s response.'),
});
export type ProvideRealTimeFeedbackOutput = z.infer<typeof ProvideRealTimeFeedbackOutputSchema>;

export async function provideRealTimeFeedback(input: ProvideRealTimeFeedbackInput): Promise<ProvideRealTimeFeedbackOutput> {
  return provideRealTimeFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideRealTimeFeedbackPrompt',
  input: {schema: ProvideRealTimeFeedbackInputSchema},
  output: {schema: ProvideRealTimeFeedbackOutputSchema},
  prompt: `You are an AI-powered interview coach providing real-time feedback to the interviewee. Provide your feedback in {{language}}.

  Based on the interviewer's question, the interviewee's response, the interviewer's persona, and the job description, provide concise and constructive feedback to help the interviewee improve their answer.

  Interviewer Persona: {{{interviewerPersona}}}
  Job Description: {{{jobDescription}}}
  Interviewer Question: {{{interviewerQuestion}}}
  Interviewee Response: {{{intervieweeResponse}}}

  Feedback:`, // Keep it simple and direct.
});

const provideRealTimeFeedbackFlow = ai.defineFlow(
  {
    name: 'provideRealTimeFeedbackFlow',
    inputSchema: ProvideRealTimeFeedbackInputSchema,
    outputSchema: ProvideRealTimeFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
