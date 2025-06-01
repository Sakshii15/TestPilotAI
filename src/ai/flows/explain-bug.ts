'use server';

/**
 * @fileOverview Explains the cause of a bug and suggests a fix.
 *
 * - explainBug - A function that handles the bug explanation process.
 * - ExplainBugInput - The input type for the explainBug function.
 * - ExplainBugOutput - The return type for the explainBug function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainBugInputSchema = z.object({
  code: z.string().describe('The code containing the bug.'),
  bugReport: z.string().describe('The bug report for the code.'),
});
export type ExplainBugInput = z.infer<typeof ExplainBugInputSchema>;

const ExplainBugOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the bug.'),
  suggestedFix: z.string().describe('The suggested fix for the bug.'),
});
export type ExplainBugOutput = z.infer<typeof ExplainBugOutputSchema>;

export async function explainBug(input: ExplainBugInput): Promise<ExplainBugOutput> {
  return explainBugFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainBugPrompt',
  input: {schema: ExplainBugInputSchema},
  output: {schema: ExplainBugOutputSchema},
  prompt: `You are an expert software developer. You are reviewing code and a bug report and explaining the cause of the bug and suggesting a fix.

  Code:
  {{code}}

  Bug Report:
  {{bugReport}}
  `,
});

const explainBugFlow = ai.defineFlow(
  {
    name: 'explainBugFlow',
    inputSchema: ExplainBugInputSchema,
    outputSchema: ExplainBugOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
