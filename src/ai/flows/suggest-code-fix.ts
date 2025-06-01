'use server';

/**
 * @fileOverview Provides suggestions for fixing bugs and inefficient code.
 *
 * - suggestCodeFix - A function that takes code and a description of the issue and suggests a fix.
 * - SuggestCodeFixInput - The input type for the suggestCodeFix function.
 * - SuggestCodeFixOutput - The return type for the suggestCodeFix function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCodeFixInputSchema = z.object({
  code: z.string().describe('The code to be fixed.'),
  description: z.string().describe('The description of the issue to be fixed.'),
});
export type SuggestCodeFixInput = z.infer<typeof SuggestCodeFixInputSchema>;

const SuggestCodeFixOutputSchema = z.object({
  fixedCode: z.string().describe('The suggested fix for the code.'),
  explanation: z.string().describe('An explanation of the suggested fix.'),
});
export type SuggestCodeFixOutput = z.infer<typeof SuggestCodeFixOutputSchema>;

export async function suggestCodeFix(input: SuggestCodeFixInput): Promise<SuggestCodeFixOutput> {
  return suggestCodeFixFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCodeFixPrompt',
  input: {schema: SuggestCodeFixInputSchema},
  output: {schema: SuggestCodeFixOutputSchema},
  prompt: `You are an AI coding assistant that helps developers fix bugs and improve code quality.

You will be given a piece of code and a description of the issue to be fixed. You will then suggest a fix for the code and explain the fix.

Code:
{{{code}}}

Issue Description:
{{{description}}}

Suggest a fix for the code and explain the fix. Return the fixed code and the explanation in the following JSON format:
{
  "fixedCode": "The fixed code.",
  "explanation": "An explanation of the suggested fix."
}
`,
});

const suggestCodeFixFlow = ai.defineFlow(
  {
    name: 'suggestCodeFixFlow',
    inputSchema: SuggestCodeFixInputSchema,
    outputSchema: SuggestCodeFixOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
