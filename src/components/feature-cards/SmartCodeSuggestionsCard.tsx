
"use client";

import { useState, useEffect } from "react";
import { smartCodeSuggestions, type SmartCodeSuggestionsInput, type SmartCodeSuggestionsOutput } from "@/ai/flows/smart-code-suggestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SmartCodeSuggestionsCard() {
  const [codeSnippet, setCodeSnippet] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [testingFramework, setTestingFramework] = useState("Jest");
  const [objective, setObjective] = useState("");
  
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

    const inputData: SmartCodeSuggestionsInput = {
      codeSnippet,
      language,
      testingFramework,
      objective,
    };

    try {
      const result = await smartCodeSuggestions(inputData);
      setResponse(result);
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message || "Failed to get suggestions. Please try again.",
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
          <Sparkles className="h-6 w-6 text-primary" />
          Smart Code Suggestions
        </CardTitle>
        <CardDescription className="font-body">
          Enter your code snippet, language, testing framework, and objective to get AI-powered code suggestions.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="codeSnippet" className="font-body">Code Snippet (Optional)</Label>
            <Textarea
              id="codeSnippet"
              placeholder="Enter your current code snippet..."
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="min-h-[150px] font-code text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language" className="font-body">Programming Language</Label>
              <Input
                id="language"
                placeholder="e.g., JavaScript, Python"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testingFramework" className="font-body">Testing Framework</Label>
              <Input
                id="testingFramework"
                placeholder="e.g., Selenium, Cypress, Jest"
                value={testingFramework}
                onChange={(e) => setTestingFramework(e.target.value)}
                className="font-body"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="objective" className="font-body">Objective</Label>
            <Input
              id="objective"
              placeholder="e.g., Click the login button, Assert API response"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              required
              className="font-body"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 font-body">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Get Suggestions
          </Button>
        </CardFooter>
      </form>

      {response && (
        <div className="p-6 border-t">
          <h3 className="text-lg font-semibold mb-2 font-headline">AI Suggestion:</h3>
          {response.suggestedCode && (
            <div className="mb-4">
              <Label className="font-body text-sm text-muted-foreground">Suggested Code:</Label>
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
        </div>
      )}
    </Card>
  );
}
