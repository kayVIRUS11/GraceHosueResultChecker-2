'use server';

/**
 * @fileOverview AI-powered tool for generating concise summaries of student performance trends from result reports.
 *
 * - generateResultSummary - A function that generates a summary of student performance trends and key insights.
 * - GenerateResultSummaryInput - The input type for the generateResultSummary function.
 * - GenerateResultSummaryOutput - The return type for the generateResultSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResultSummaryInputSchema = z.object({
  reportData: z.string().describe('Comprehensive result report data in JSON format, including student, class, subject, and session information.'),
});
export type GenerateResultSummaryInput = z.infer<typeof GenerateResultSummaryInputSchema>;

const GenerateResultSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of student performance trends and key insights derived from the result report data.'),
});
export type GenerateResultSummaryOutput = z.infer<typeof GenerateResultSummaryOutputSchema>;

export async function generateResultSummary(input: GenerateResultSummaryInput): Promise<GenerateResultSummaryOutput> {
  return generateResultSummaryFlow(input);
}

const generateResultSummaryPrompt = ai.definePrompt({
  name: 'generateResultSummaryPrompt',
  input: {schema: GenerateResultSummaryInputSchema},
  output: {schema: GenerateResultSummaryOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing student performance from result reports.

  Analyze the provided result report data and generate a concise summary of the key performance trends and insights.

  Result Report Data:
  {{reportData}}

  Focus on identifying overall academic performance, areas of improvement, and significant trends across students, classes, subjects, or sessions.
  Provide a summary that is easily understandable for administrators to quickly grasp the overall academic standing.
  Ensure that the output is a single paragraph and easy to read.
  Follow schema output descriptions.`, // Added instructions to follow schema output descriptions
});

const generateResultSummaryFlow = ai.defineFlow(
  {
    name: 'generateResultSummaryFlow',
    inputSchema: GenerateResultSummaryInputSchema,
    outputSchema: GenerateResultSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateResultSummaryPrompt(input);
    return output!;
  }
);
