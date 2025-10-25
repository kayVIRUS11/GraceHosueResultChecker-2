"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, FileText, Bot } from "lucide-react";
import { classReportData } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { generateResultSummary, GenerateResultSummaryOutput } from "@/ai/flows/generate-result-summary";
import { aiGeneratedComparison, AiGeneratedComparisonOutput } from "@/ai/flows/ai-generated-comparison";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Separator } from "../ui/separator";

export function ReportGenerator() {
  const [reportType, setReportType] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCompareLoading, setIsCompareLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<GenerateResultSummaryOutput | null>(null);
  const [aiComparison, setAiComparison] = useState<AiGeneratedComparisonOutput | null>(null);
  const { toast } = useToast();

  const handleGenerateReport = () => {
    if (!reportType || !selectedClass) {
      toast({
        title: "Incomplete Selection",
        description: "Please select a report type and a class.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setShowReport(true);
      setIsGenerating(false);
      setAiSummary(null);
      setAiComparison(null);
    }, 1500);
  };

  const handleGenerateSummary = async () => {
    setIsAiLoading(true);
    try {
      const summary = await generateResultSummary({
        reportData: JSON.stringify(classReportData),
      });
      setAiSummary(summary);
    } catch (error) {
      console.error("AI Summary Error:", error);
      toast({
        title: "AI Error",
        description: "Could not generate summary.",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handleCompare = async () => {
    setIsCompareLoading(true);
    const mockPreviousReport = {
        ...classReportData,
        session: "2022/2023",
        term: "Second Term",
        students: classReportData.students.map(s => ({...s, average: s.average - 5})),
    };
    try {
        const comparison = await aiGeneratedComparison({
            report1: JSON.stringify(mockPreviousReport),
            report2: JSON.stringify(classReportData),
            comparisonType: "session",
        });
        setAiComparison(comparison);
    } catch (error) {
        console.error("AI Comparison Error:", error);
        toast({
            title: "AI Error",
            description: "Could not generate comparison.",
            variant: "destructive",
        });
    } finally {
        setIsCompareLoading(false);
    }
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Report Filters</CardTitle>
          <CardDescription>Select criteria to generate your report.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <Select onValueChange={setReportType}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="class">By Class</SelectItem>
              <SelectItem value="student" disabled>By Student (coming soon)</SelectItem>
              <SelectItem value="subject" disabled>By Subject (coming soon)</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jss3a">JSS 3A</SelectItem>
              <SelectItem value="jss3b">JSS 3B</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Generate Report
          </Button>
        </CardContent>
      </Card>

      {showReport && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <CardTitle className="font-headline">Report for {classReportData.className}</CardTitle>
                <CardDescription>
                  {classReportData.term}, {classReportData.session} Session
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleGenerateSummary} disabled={isAiLoading}>
                  {isAiLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  AI Summary
                </Button>
                <Button variant="outline" onClick={handleCompare} disabled={isCompareLoading}>
                  {isCompareLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Compare with AI
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {aiSummary && (
                <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertTitle className="font-headline">AI Generated Summary</AlertTitle>
                    <AlertDescription>
                        {aiSummary.summary}
                    </AlertDescription>
                </Alert>
            )}
            {aiComparison && (
                <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertTitle className="font-headline">AI Generated Comparison</AlertTitle>
                    <AlertDescription className="space-y-2">
                        <div><span className="font-semibold">Summary:</span> {aiComparison.summary}</div>
                        <div><span className="font-semibold">Insights:</span> {aiComparison.insights}</div>
                    </AlertDescription>
                </Alert>
            )}
            {(aiSummary || aiComparison) && <Separator />}

            <h3 className="font-semibold font-headline text-lg">Student Performance</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-right">Total Score</TableHead>
                  <TableHead className="text-right">Average</TableHead>
                  <TableHead className="text-right">Position</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classReportData.students.map((student) => (
                  <TableRow key={student.name}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-right">{student.totalScore}</TableCell>
                    <TableCell className="text-right">{student.average}%</TableCell>
                    <TableCell className="text-right font-bold">{student.position}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
