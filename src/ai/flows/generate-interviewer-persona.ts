'use server';
/**
 * @fileOverview An interviewer persona generator AI agent.
 *
 * - generateInterviewerPersona - A function that generates the interviewer persona.
 * - GenerateInterviewerPersonaInput - The input type for the generateInterviewerPersona function.
 * - GenerateInterviewerPersonaOutput - The return type for the generateInterviewerPersona function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewerPersonaInputSchema = z.object({
  company: z.string().describe('The name of the company.'),
  role: z.string().describe('The role being interviewed for.'),
  industry: z.string().describe('The industry of the company.'),
});
export type GenerateInterviewerPersonaInput = z.infer<typeof GenerateInterviewerPersonaInputSchema>;

const GenerateInterviewerPersonaOutputSchema = z.object({
  personaDescription: z.string().describe('A detailed description of the interviewer persona, including their background, personality, and interviewing style.'),
});
export type GenerateInterviewerPersonaOutput = z.infer<typeof GenerateInterviewerPersonaOutputSchema>;

export async function generateInterviewerPersona(input: GenerateInterviewerPersonaInput): Promise<GenerateInterviewerPersonaOutput> {
  return generateInterviewerPersonaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewerPersonaPrompt',
  input: {schema: GenerateInterviewerPersonaInputSchema},
  output: {schema: GenerateInterviewerPersonaOutputSchema},
  prompt: `You are an expert in creating realistic interviewer personas for interview simulations.

  Based on the company, role, and industry provided, create a detailed description of the interviewer persona. Include their background, personality, and interviewing style. The persona should be believable and relevant to the specified context.

  Company: {{{company}}}
  Role: {{{role}}}
  Industry: {{{industry}}}
  `,
});

const generateInterviewerPersonaFlow = ai.defineFlow(
  {
    name: 'generateInterviewerPersonaFlow',
    inputSchema: GenerateInterviewerPersonaInputSchema,
    outputSchema: GenerateInterviewerPersonaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
