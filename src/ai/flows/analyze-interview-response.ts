'use server';

/**
 * @fileOverview A flow to analyze interview responses using a competency-based framework.
 *
 * - analyzeInterviewResponse - A function that takes an interview response and returns a competency-based assessment.
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
  language: z.string().describe('The language for the assessment (e.g., "English", "Japanese").'),
});
export type AnalyzeInterviewResponseInput = z.infer<
  typeof AnalyzeInterviewResponseInputSchema
>;

const AnalyzeInterviewResponseOutputSchema = z.object({
  competency: z.string().describe('The primary competency assessed in the response (e.g., Strategic Thinking, Coaching & Facilitation, Data-Driven Thinking).'),
  assessment: z.string().describe('A detailed assessment of how well the user demonstrated the competency.'),
  score: z.number().min(1).max(5).describe('A score from 1 to 5 representing the proficiency in this competency, where 1 is poor and 5 is excellent.'),
  suggestions: z.array(z.string()).describe('Specific suggestions for how the user could better demonstrate this competency in their response.'),
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
  prompt: `You are an expert interview coach specializing in competency-based assessments. Your task is to analyze an interview response based on the role the user is interviewing for.

First, identify the primary competency being evaluated by the interview question. Examples of competencies include Strategic Thinking, Leadership, Coaching & Facilitation, Data-Driven Thinking, Communication, Teamwork, etc.

Then, evaluate the user's response to assess how effectively they demonstrated this competency. Provide a detailed assessment, a score from 1 (poor) to 5 (excellent), and specific suggestions for improvement.

The assessment should be in {{language}}.

**Role Context:**
Role: {{{role}}}
Industry: {{{industry}}}

**Interview Exchange:**
Question: {{{interviewQuestion}}}
User's Response: {{{userResponse}}}

Provide your analysis in a structured JSON format.
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
