'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing smart code suggestions tailored for test automation.
 *
 * It includes:
 * - smartCodeSuggestions: The main function to generate code suggestions.
 * - SmartCodeSuggestionsInput: The input type for the smartCodeSuggestions function.
 * - SmartCodeSuggestionsOutput: The output type for the smartCodeSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartCodeSuggestionsInputSchema = z.object({
  codeSnippet: z.string().describe('The current code snippet the developer is working on.'),
  language: z.string().describe('The programming language of the code snippet (e.g., JavaScript, Python, Java).'),
  testingFramework: z.string().describe('The test automation framework being used (e.g., Selenium, Cypress, Jest).'),
  objective: z.string().describe('The objective of the code to be generated, e.g. "click the button"'),
});
export type SmartCodeSuggestionsInput = z.infer<typeof SmartCodeSuggestionsInputSchema>;

const SmartCodeSuggestionsOutputSchema = z.object({
  suggestedCode: z.string().describe('The suggested code completion or snippet.'),
  explanation: z.string().describe('An explanation of the suggested code and how it addresses the objective.'),
});
export type SmartCodeSuggestionsOutput = z.infer<typeof SmartCodeSuggestionsOutputSchema>;

export async function smartCodeSuggestions(input: SmartCodeSuggestionsInput): Promise<SmartCodeSuggestionsOutput> {
  return smartCodeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartCodeSuggestionsPrompt',
  input: {schema: SmartCodeSuggestionsInputSchema},
  output: {schema: SmartCodeSuggestionsOutputSchema},
  prompt: `You are an AI expert in test automation. Given the code snippet, programming language, testing framework, and objective, provide a smart code suggestion to help the developer write tests more accurately and quickly.

  Code Snippet:
  {{codeSnippet}}

  Language: {{language}}
  Testing Framework: {{testingFramework}}
  Objective: {{objective}}

  Respond with the code, followed by an explanation of how the code meets the objective.
`,
});

const smartCodeSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartCodeSuggestionsFlow',
    inputSchema: SmartCodeSuggestionsInputSchema,
    outputSchema: SmartCodeSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
