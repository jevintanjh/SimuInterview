import type { AnalyzeInterviewResponseOutput } from "@/ai/flows/analyze-interview-response";

export type QAPair = {
    question: string;
    answer: string;
};
  
export type InterviewData = {
    transcript: QAPair[];
    scenario: Record<string, string>;
}

export type CompetencyAssessment = AnalyzeInterviewResponseOutput;
