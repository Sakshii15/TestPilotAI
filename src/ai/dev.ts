import { config } from 'dotenv';
config();

import '@/ai/flows/generate-test-cases.ts';
import '@/ai/flows/explain-bug.ts';
import '@/ai/flows/suggest-code-fix.ts';
import '@/ai/flows/smart-code-suggestions.ts';