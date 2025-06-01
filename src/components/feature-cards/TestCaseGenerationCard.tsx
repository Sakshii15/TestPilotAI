
"use client";

import { useState, useEffect } from "react";
import { generateTestCases, type GenerateTestCasesInput, type GenerateTestCasesOutput } from "@/ai/flows/generate-test-cases";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function TestCaseGenerationCard() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [testingFramework, setTestingFramework] = useState("Jest");
  
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GenerateTestCasesOutput | null>(null);
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    const inputData: GenerateTestCasesInput = {
      code,
      language,
      testingFramework,
    };

    try {
      const result = await generateTestCases(inputData);
      setResponse(result);
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message || "Failed to generate test cases. Please try again.",
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
          <FileText className="h-6 w-6 text-primary" />
          Test Case Generation
        </CardTitle>
        <CardDescription className="font-body">
          Provide code, language, and testing framework to automatically generate test cases.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="codeForTests" className="font-body">Code</Label>
            <Textarea
              id="codeForTests"
              placeholder="Paste the code to generate tests for..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="min-h-[200px] font-code text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testLanguage" className="font-body">Programming Language</Label>
              <Input
                id="testLanguage"
                placeholder="e.g., JavaScript, Python"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testFramework" className="font-body">Testing Framework</Label>
              <Input
                id="testFramework"
                placeholder="e.g., Jest, PyTest, JUnit"
                value={testingFramework}
                onChange={(e) => setTestingFramework(e.target.value)}
                required
                className="font-body"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 font-body">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Generate Test Cases
          </Button>
        </CardFooter>
      </form>

      {response && response.testCases && (
        <div className="p-6 border-t">
          <h3 className="text-lg font-semibold mb-2 font-headline">Generated Test Cases:</h3>
          <pre className="bg-muted p-3 rounded-md overflow-x-auto font-code text-sm">
            <code>{response.testCases}</code>
          </pre>
        </div>
      )}
    </Card>
  );
}
