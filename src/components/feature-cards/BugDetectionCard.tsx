
"use client";

import { useState, useEffect } from "react";
import { explainBug, type ExplainBugInput, type ExplainBugOutput } from "@/ai/flows/explain-bug";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Bug } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function BugDetectionCard() {
  const [code, setCode] = useState("");
  const [bugReport, setBugReport] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ExplainBugOutput | null>(null);
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    const inputData: ExplainBugInput = {
      code,
      bugReport,
    };

    try {
      const result = await explainBug(inputData);
      setResponse(result);
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message || "Failed to detect bug. Please try again.",
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
          <Bug className="h-6 w-6 text-primary" />
          Bug Detection &amp; Explanation
        </CardTitle>
        <CardDescription className="font-body">
          Provide your code and a bug report to get an AI-powered explanation and suggested fix.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="font-body">Code</Label>
            <Textarea
              id="code"
              placeholder="Enter the code containing the bug..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="min-h-[200px] font-code text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bugReport" className="font-body">Bug Report</Label>
            <Textarea
              id="bugReport"
              placeholder="Describe the bug or paste the bug report..."
              value={bugReport}
              onChange={(e) => setBugReport(e.target.value)}
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
              <Bug className="mr-2 h-4 w-4" />
            )}
            Detect Bug
          </Button>
        </CardFooter>
      </form>

      {response && (
        <div className="p-6 border-t">
          <h3 className="text-lg font-semibold mb-2 font-headline">AI Analysis:</h3>
          {response.explanation && (
            <div className="mb-4">
              <Label className="font-body text-sm text-muted-foreground">Bug Explanation:</Label>
              <p className="text-sm bg-muted p-3 rounded-md font-body">{response.explanation}</p>
            </div>
          )}
          {response.suggestedFix && (
            <div>
              <Label className="font-body text-sm text-muted-foreground">Suggested Fix:</Label>
              <pre className="bg-muted p-3 rounded-md overflow-x-auto font-code text-sm">
                <code>{response.suggestedFix}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
