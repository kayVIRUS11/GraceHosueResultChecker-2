
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { allStudents, currentResults, allSessions } from "@/lib/data";
import { Download, Printer } from "lucide-react";
import { useMemo, useState } from "react";
import TeacherDashboardLayout from "../dashboard/layout";

const subjects = [...new Set(currentResults.map(r => r.subject))];

const getGrade = (total: number) => {
  if (total >= 75) return 'A';
  if (total >= 65) return 'B';
  if (total >= 50) return 'C';
  if (total >= 40) return 'D';
  return 'F';
};

export default function TeacherBroadsheetPage() {
    const [selectedClass, setSelectedClass] = useState("jss3");
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

    const broadsheetData = useMemo(() => {
        const classMap: Record<string, string> = {
            "jss1": "JSS 1",
            "jss2": "JSS 2",
            "jss3": "JSS 3",
        };
        const currentClass = classMap[selectedClass] || "JSS 3";

        return allStudents.filter(s => s.class.startsWith(currentClass)).map(student => {
            const studentScores: Record<string, number> = {};
            let totalScore = 0;
            
            subjects.forEach(subject => {
                // This logic should be replaced with actual data fetching based on session/term
                const score = Math.floor(Math.random() * 61) + 40; // Random score between 40 and 100
                studentScores[subject] = score;
                totalScore += score;
            });

            const average = totalScore / subjects.length;

            return {
                id: student.id,
                name: student.name,
                regNumber: student.regNumber,
                scores: studentScores,
                total: totalScore,
                average: parseFloat(average.toFixed(2)),
            };
        }).sort((a, b) => b.average - a.average);
    }, [selectedClass, selectedSession, selectedTerm]);

    const handlePrint = () => {
        window.print();
    };

    const uniqueSessions = [...new Set(allSessions.map(s => s.name))];
    const availableTerms = useMemo(() => {
        if (!selectedSession) return [];
        return [...new Set(allSessions.filter(s => s.name === selectedSession).map(s => s.term))];
    }, [selectedSession]);

  return (
    <TeacherDashboardLayout>
      <PageHeader
        title="Class Broadsheet"
        description="View the full academic broadsheet for a selected class."
      >
        <Button variant="outline" onClick={() => alert("Downloading broadsheet...")}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div>
              <CardTitle className="font-headline">
                {selectedClass.toUpperCase()} Broadsheet
              </CardTitle>
              <CardDescription>
                {selectedTerm || 'Select Term'}, {selectedSession || 'Select Session'}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Select onValueChange={setSelectedSession}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Select Session" />
                </SelectTrigger>
                <SelectContent>
                    {uniqueSessions.map(sessionName => (
                        <SelectItem key={sessionName} value={sessionName}>{sessionName}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Select onValueChange={setSelectedTerm} disabled={!selectedSession}>
                  <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Select Term" />
                  </SelectTrigger>
                  <SelectContent>
                      {availableTerms.map(term => (
                          <SelectItem key={term} value={term}>{term}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jss1">JSS 1</SelectItem>
                  <SelectItem value="jss2">JSS 2</SelectItem>
                  <SelectItem value="jss3">JSS 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10">Student Name</TableHead>
                {subjects.map(subject => (
                    <TableHead key={subject} className="text-center whitespace-nowrap px-4">{subject}</TableHead>
                ))}
                <TableHead className="text-center font-bold">Total</TableHead>
                <TableHead className="text-center font-bold">Average</TableHead>
                <TableHead className="text-center font-bold">Grade</TableHead>
                <TableHead className="text-center font-bold">Position</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {broadsheetData.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium sticky left-0 bg-background z-10">{student.name}</TableCell>
                   {subjects.map(subject => (
                    <TableCell key={`${student.id}-${subject}`} className="text-center">
                        {student.scores[subject] ?? 'N/A'}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-bold">{student.total}</TableCell>
                  <TableCell className="text-center font-bold">{student.average}</TableCell>
                  <TableCell className="text-center font-bold">{getGrade(student.average)}</TableCell>
                  <TableCell className="text-center font-bold">{index + 1}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TeacherDashboardLayout>
  );
}

    
