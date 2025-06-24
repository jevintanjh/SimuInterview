'use server';

/**
 * @fileOverview A flow to analyze interview responses using the STAR method and provide feedback.
 *
 * - analyzeInterviewResponse - A function that takes an interview response and returns an assessment based on the STAR method.
 * - AnalyzeInterviewResponseInput - The input type for the analyzeInterviewResponse function.
 * - AnalyzeInterviewResponseOutput - The return type for the analyzeInterviewResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeInterviewResponseInputSchema = z.object({
  interviewQuestion: z
    .string()
    .describe('The question asked during the interview.'),
  userResponse: z
    .string()
    .describe('The user response to the interview question.'),
  role: z.string().describe('The role the user is interviewing for.'),
  industry: z.string().describe('The industry of the company.'),
});
export type AnalyzeInterviewResponseInput = z.infer<
  typeof AnalyzeInterviewResponseInputSchema
>;

const AnalyzeInterviewResponseOutputSchema = z.object({
  overallFeedback: z.string().describe('Overall feedback on the response.'),
  starAssessment: z.object({
    situation: z.string().describe('Assessment of the situation component.'),
    task: z.string().describe('Assessment of the task component.'),
    action: z.string().describe('Assessment of the action component.'),
    result: z.string().describe('Assessment of the result component.'),
  }),
  suggestions: z.array(z.string()).describe('Suggestions for improvement.'),
});
export type AnalyzeInterviewResponseOutput = z.infer<
  typeof AnalyzeInterviewResponseOutputSchema
>;

export async function analyzeInterviewResponse(
  input: AnalyzeInterviewResponseInput
): Promise<AnalyzeInterviewResponseOutput> {
  return analyzeInterviewResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeInterviewResponsePrompt',
  input: {schema: AnalyzeInterviewResponseInputSchema},
  output: {schema: AnalyzeInterviewResponseOutputSchema},
  prompt: `You are an expert interview coach. Analyze the following interview response using the STAR method and provide feedback.

Interview Question: {{{interviewQuestion}}}
User Response: {{{userResponse}}}
Role: {{{role}}}
Industry: {{{industry}}}

Provide overall feedback, a STAR assessment (Situation, Task, Action, Result), and suggestions for improvement.

Output in JSON format:
`,
});

const analyzeInterviewResponseFlow = ai.defineFlow(
  {
    name: 'analyzeInterviewResponseFlow',
    inputSchema: AnalyzeInterviewResponseInputSchema,
    outputSchema: AnalyzeInterviewResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
