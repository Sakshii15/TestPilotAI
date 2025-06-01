
"use client";

import { useState, useEffect } from "react";
import { smartCodeSuggestions, type SmartCodeSuggestionsInput, type SmartCodeSuggestionsOutput } from "@/ai/flows/smart-code-suggestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function NaturalLanguageQueryCard() {
  const [query, setQuery] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<SmartCodeSuggestionsOutput | null>(null);
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    // Using smartCodeSuggestions flow for NLI.
    // We map the NLI query to the 'objective' field.
    // Other fields can be generic or derived if possible.
    const inputData: SmartCodeSuggestionsInput = {
      codeSnippet: "", // Can be enhanced to allow context
      language: "general", // Or try to infer, or let user specify
      testingFramework: "any", // Or try to infer
      objective: query,
    };

    try {
      const result = await smartCodeSuggestions(inputData);
      setResponse(result);
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message || "Failed to process query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <BrainCircuit className="h-6 w-6 text-primary" />
          Natural Language Query
        </CardTitle>
        <CardDescription className="font-body">
          Ask coding or testing related questions in plain English. For example: "How do I test this API?" or "Fix this brittle selector for element X".
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="naturalQuery" className="font-body">Your Question</Label>
            <Textarea
              id="naturalQuery"
              placeholder="Type your question here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              className="min-h-[100px] font-body text-sm"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 font-body">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            Ask AI
          </Button>
        </CardFooter>
      </form>

      {response && (
        <div className="p-6 border-t">
          <h3 className="text-lg font-semibold mb-2 font-headline">AI Response:</h3>
           {response.suggestedCode && (
            <div className="mb-4">
              <Label className="font-body text-sm text-muted-foreground">Suggestion / Code:</Label>
              <pre className="bg-muted p-3 rounded-md overflow-x-auto font-code text-sm">
                <code>{response.suggestedCode}</code>
              </pre>
            </div>
          )}
          {response.explanation && (
            <div>
              <Label className="font-body text-sm text-muted-foreground">Explanation:</Label>
              <p className="text-sm bg-muted p-3 rounded-md font-body">{response.explanation}</p>
            </div>
          )}
          {!response.suggestedCode && !response.explanation && (
            <p className="text-sm text-muted-foreground font-body">The AI did not provide a specific code suggestion or explanation for this query.</p>
          )}
        </div>
      )}
    </Card>
  );
}
