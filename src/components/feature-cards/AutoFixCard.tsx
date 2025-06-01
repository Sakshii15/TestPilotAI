
"use client";

import { useState, useEffect } from "react";
import { suggestCodeFix, type SuggestCodeFixInput, type SuggestCodeFixOutput } from "@/ai/flows/suggest-code-fix";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AutoFixCard() {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<SuggestCodeFixOutput | null>(null);
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    const inputData: SuggestCodeFixInput = {
      code,
      description,
    };

    try {
      const result = await suggestCodeFix(inputData);
      setResponse(result);
    } catch (err) {
       toast({
        title: "Error",
        description: (err as Error).message || "Failed to suggest fix. Please try again.",
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
          <Wrench className="h-6 w-6 text-primary" />
          Auto-Fix Capability
        </CardTitle>
        <CardDescription className="font-body">
          Provide code and a description of the issue to get AI-driven suggestions for fixes.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="codeToFix" className="font-body">Code to Fix</Label>
            <Textarea
              id="codeToFix"
              placeholder="Paste the problematic code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="min-h-[200px] font-code text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issueDescription" className="font-body">Issue Description</Label>
            <Textarea
              id="issueDescription"
              placeholder="Describe the bug, inefficiency, or desired change..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              <Wrench className="mr-2 h-4 w-4" />
            )}
            Suggest Fix
          </Button>
        </CardFooter>
      </form>

      {response && (
        <div className="p-6 border-t">
          <h3 className="text-lg font-semibold mb-2 font-headline">AI Suggested Fix:</h3>
          {response.fixedCode && (
            <div className="mb-4">
              <Label className="font-body text-sm text-muted-foreground">Fixed Code:</Label>
              <pre className="bg-muted p-3 rounded-md overflow-x-auto font-code text-sm">
                <code>{response.fixedCode}</code>
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
