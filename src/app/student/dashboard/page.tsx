
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Printer } from "lucide-react";
import { studentProfile, currentResults, performanceData, allSessions } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";

const getGradeAndRemark = (total: number) => {
  if (total >= 75) return { grade: 'A', remark: 'Excellent', color: 'bg-green-500' };
  if (total >= 65) return { grade: 'B', remark: 'Very Good', color: 'bg-blue-500' };
  if (total >= 50) return { grade: 'C', remark: 'Good', color: 'bg-yellow-500' };
  if (total >= 40) return { grade: 'D', remark: 'Pass', color: 'bg-orange-500' };
  return { grade: 'F', remark: 'Fail', color: 'bg-red-500' };
};

export default function StudentDashboardPage() {
  const [selectedSession, setSelectedSession] = useState(studentProfile.session);
  const [selectedTerm, setSelectedTerm] = useState(studentProfile.term);
  
  // In a real app, you would fetch results based on selectedSession and selectedTerm
  const processedResults = currentResults.map(r => {
    const total = (r.test1 || 0) + (r.test2 || 0) + (r.test3 || 0) + (r.exam || 0);
    const { grade, remark } = getGradeAndRemark(total);
    return { ...r, total, grade, remark };
  });

  const overallTotal = processedResults.reduce((sum, r) => sum + r.total, 0);
  const overallAverage = overallTotal / processedResults.length;
  
  const uniqueSessions = [...new Set(allSessions.map(s => s.name))];
  const availableTerms = useMemo(() => {
      if (!selectedSession) return [];
      return [...new Set(allSessions.filter(s => s.name === selectedSession).map(s => s.term))];
  }, [selectedSession]);


  return (
    <>
      <PageHeader
        title="Student Dashboard"
        description="View your academic performance and results."
      >
        <div className="flex flex-wrap gap-2">
            <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Select Session" />
                </SelectTrigger>
                <SelectContent>
                    {uniqueSessions.map(sessionName => (
                        <SelectItem key={sessionName} value={sessionName}>{sessionName}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Select Term" />
                </SelectTrigger>
                <SelectContent>
                    {availableTerms.map(term => (
                        <SelectItem key={term} value={term}>{term}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button>
              <Printer className="mr-2 h-4 w-4" />
              Print Result
            </Button>
        </div>
      </PageHeader>
      
      <div className="grid gap-8">
        <Card className="shadow-md">
          <CardHeader className="bg-muted/30 p-4 md:p-6">
             <div className="flex flex-col md:flex-row items-start justify-between space-y-4 md:space-y-0">
                <div className="flex items-center gap-4">
                  <div>
                      <h2 className="text-2xl font-bold font-headline">{studentProfile.name}</h2>
                      <p className="text-muted-foreground">{studentProfile.regNumber}</p>
                      <p className="text-muted-foreground">{studentProfile.class}</p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                    <p className="font-semibold">{selectedSession}</p>
                    <p className="text-primary font-bold text-lg">{selectedTerm}</p>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Subject</TableHead>
                  <TableHead className="text-center">Test 1 (20)</TableHead>
                  <TableHead className="text-center">Test 2 (20)</TableHead>
                  <TableHead className="text-center">Test 3 (20)</TableHead>
                  <TableHead className="text-center">Exam (60)</TableHead>
                  <TableHead className="text-center">Total (100)</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead className="text-right">Remark</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedResults.map((result) => (
                  <TableRow key={result.subject}>
                    <TableCell className="font-medium">{result.subject}</TableCell>
                    <TableCell className="text-center">{result.test1 || 0}</TableCell>
                    <TableCell className="text-center">{result.test2 || 0}</TableCell>
                    <TableCell className="text-center">{result.test3 || 0}</TableCell>
                    <TableCell className="text-center">{result.exam || 0}</TableCell>
                    <TableCell className="text-center font-bold">{result.total}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant="default" className={getGradeAndRemark(result.total).color + ' text-white'}>{result.grade}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{result.remark}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 bg-muted/30 p-4 md:p-6 mt-4">
              <div className="flex justify-between w-full">
                <div className="font-bold">Overall Total: <span className="text-primary">{overallTotal.toFixed(2)}</span></div>
                <div className="font-bold">Overall Average: <span className="text-primary">{overallAverage.toFixed(2)}%</span></div>
              </div>
              <div className="font-bold">Overall Grade: <Badge variant="default" className={getGradeAndRemark(overallAverage).color + ' text-white'}>{getGradeAndRemark(overallAverage).grade}</Badge></div>
              <div className="mt-2 text-sm">
                <p><span className="font-semibold">Principal's Comment:</span> An impressive performance. Keep up the great work!</p>
                <p><span className="font-semibold">Teacher's Comment:</span> John has shown significant improvement this term. Well done.</p>
              </div>
          </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Performance Trend</CardTitle>
                <CardDescription>Your average score over the last few terms.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[300px] w-full">
                    <LineChart data={performanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="term" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="average" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
    </>
  );
}

    