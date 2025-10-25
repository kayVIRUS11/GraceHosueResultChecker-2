'use server';

/**
 * @fileOverview A flow for generating comparisons of result reports across different sessions or classes using AI.
 *
 * - aiGeneratedComparison - A function that handles the comparison of result reports using AI.
 * - AiGeneratedComparisonInput - The input type for the aiGeneratedComparison function.
 * - AiGeneratedComparisonOutput - The return type for the aiGeneratedComparison function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiGeneratedComparisonInputSchema = z.object({
  report1: z.string().describe('The first result report to compare.'),
  report2: z.string().describe('The second result report to compare.'),
  comparisonType: z
    .enum(['session', 'class', 'student', 'subject'])
    .describe('The type of comparison to perform.'),
});
export type AiGeneratedComparisonInput = z.infer<typeof AiGeneratedComparisonInputSchema>;

const AiGeneratedComparisonOutputSchema = z.object({
  summary: z.string().describe('A summary of the comparison between the two reports.'),
  insights: z.string().describe('Insights on performance changes and significant differences.'),
});
export type AiGeneratedComparisonOutput = z.infer<typeof AiGeneratedComparisonOutputSchema>;

export async function aiGeneratedComparison(
  input: AiGeneratedComparisonInput
): Promise<AiGeneratedComparisonOutput> {
  return aiGeneratedComparisonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiGeneratedComparisonPrompt',
  input: {schema: AiGeneratedComparisonInputSchema},
  output: {schema: AiGeneratedComparisonOutputSchema},
  prompt: `You are an AI assistant tasked with comparing two result reports and providing insights.

  You will compare the two reports based on the comparison type provided and provide a summary of the comparison, and insights on performance changes and significant differences.

  Report 1: {{{report1}}}
  Report 2: {{{report2}}}
  Comparison Type: {{{comparisonType}}}

  Summary:
  Insights: `,
});

const aiGeneratedComparisonFlow = ai.defineFlow(
  {
    name: 'aiGeneratedComparisonFlow',
    inputSchema: AiGeneratedComparisonInputSchema,
    outputSchema: AiGeneratedComparisonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
