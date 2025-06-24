import { config } from 'dotenv';
config();

import '@/ai/flows/provide-real-time-feedback.ts';
import '@/ai/flows/analyze-interview-response.ts';
import '@/ai/flows/generate-interviewer-persona.ts';
import '@/ai/flows/speech-to-text.ts';
import '@/ai/flows/text-to-speech.ts';
