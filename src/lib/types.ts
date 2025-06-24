import type { analyzeInterviewResponse } from "@/app/actions";
import type { Awaited } from "drizzle-orm";

export type QAPair = {
    question: string;
    answer: string;
};
  
export type InterviewData = {
    transcript: QAPair[];
    scenario: Record<string, string>;
}

export type CompetencyAssessment = Awaited<ReturnType<typeof analyzeInterviewResponse>>
