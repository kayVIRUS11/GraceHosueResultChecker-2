
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { allSessions, studentsForTeacher } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Save, Send } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import TeacherDashboardLayout from "../dashboard/layout";

type Score = { test1: number | null, test2: number | null, test3: number | null, exam: number | null };

// Store scores in a nested structure: { [sessionTermKey]: { [studentId]: Score } }
type AllScores = Record<string, Record<number, Score>>;

const activeSession = allSessions.find(s => s.status === "Active");

export default function TeacherScoresPage() {
    const [allScores, setAllScores] = useState<AllScores>({});
    const [selectedClass, setSelectedClass] = useState("jss3a");
    const [selectedSubject, setSelectedSubject] = useState("math");

    const { toast } = useToast();
    
    const sessionTermKey = activeSession ? `${activeSession.name}-${activeSession.term}` : null;

    const scores = useMemo(() => {
        if (!sessionTermKey) return {};
        return allScores[sessionTermKey] || {};
    }, [sessionTermKey, allScores]);


    const handleScoreChange = (studentId: number, field: keyof Score, value: string) => {
        if (!sessionTermKey) {
            toast({
                title: "No Active Session",
                description: "There is no active session available for score entry.",
                variant: "destructive",
            });
            return;
        }

        const numericValue = value === '' ? null : parseInt(value, 10);
        
        const maxValues = {
            test1: 20,
            test2: 20,
            test3: 20,
            exam: 40,
        };

        if (numericValue !== null && (numericValue < 0 || numericValue > maxValues[field])) {
            toast({
                title: "Invalid Score",
                description: `Score for ${field} must be between 0 and ${maxValues[field]}.`,
                variant: "destructive",
            });
            return;
        }

        setAllScores(prevAllScores => {
            const newSessionScores = {
                ...(prevAllScores[sessionTermKey] || {}),
                [studentId]: {
                    ...(prevAllScores[sessionTermKey]?.[studentId] || { test1: null, test2: null, test3: null, exam: null }),
                    [field]: isNaN(numericValue as number) ? null : numericValue
                }
            };
            return {
                ...prevAllScores,
                [sessionTermKey]: newSessionScores
            };
        });
    };
    
    const studentData = useMemo(() => {
        return studentsForTeacher.map(student => {
            const studentScores = scores[student.id] || {};
            const total = (studentScores.test1 || 0) + (studentScores.test2 || 0) + (studentScores.test3 || 0) + (studentScores.exam || 0);
            
            let grade = 'N/A';
            if (total > 100) grade = 'Error';
            else if (total >= 75) grade = 'A';
            else if (total >= 65) grade = 'B';
            else if (total >= 50) grade = 'C';
            else if (total >= 40) grade = 'D';
            else if (total > 0 || Object.values(studentScores).some(s => s !== null)) grade = 'F';

            return { ...student, total, grade };
        });
    }, [scores]);
    
    const handleSaveDraft = () => {
        if (!sessionTermKey) return;
        console.log("Saving draft for", sessionTermKey, scores);
        toast({ title: "Draft Saved", description: `Scores for ${activeSession?.term}, ${activeSession?.name} have been saved as a draft.` });
    };

    const handleSubmitScores = () => {
        if (!sessionTermKey) return;
        console.log("Submitting scores for", sessionTermKey, scores);
        toast({ title: "Scores Submitted", description: `Final scores for ${activeSession?.term}, ${activeSession?.name} have been submitted.` });
    };


  return (
    <TeacherDashboardLayout>
      <PageHeader
        title="Score Entry"
        description="Enter student scores for your assigned class and subject."
      />
      <div className="space-y-8">
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div>
                        <CardTitle className="font-headline">Class Scores for Active Term</CardTitle>
                        <CardDescription>
                            {activeSession 
                                ? `You are entering scores for ${activeSession.term}, ${activeSession.name}.`
                                : "There is no active session. Please contact the administrator."
                            }
                        </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <Select value={activeSession?.name} disabled>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Active Session" />
                            </SelectTrigger>
                            <SelectContent>
                                {activeSession && <SelectItem value={activeSession.name}>{activeSession.name}</SelectItem>}
                            </SelectContent>
                        </Select>
                         <Select value={activeSession?.term} disabled>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Active Term" />
                            </SelectTrigger>
                            <SelectContent>
                                {activeSession && <SelectItem value={activeSession.term}>{activeSession.term}</SelectItem>}
                            </SelectContent>
                        </Select>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="jss3a">JSS 3A</SelectItem>
                                <SelectItem value="jss3b">JSS 3B</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Select Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="math">Mathematics</SelectItem>
                                <SelectItem value="eng">English Language</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Reg. Number</TableHead>
                            <TableHead className="text-center">Test 1 (20)</TableHead>
                            <TableHead className="text-center">Test 2 (20)</TableHead>
                            <TableHead className="text-center">Test 3 (20)</TableHead>
                            <TableHead className="text-center">Exam (40)</TableHead>
                            <TableHead className="text-center">Total (100)</TableHead>
                            <TableHead className="text-center">Grade</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studentData.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium">{student.name}</TableCell>
                                <TableCell>{student.reg}</TableCell>
                                {(['test1', 'test2', 'test3', 'exam'] as const).map(field => (
                                    <TableCell key={field}>
                                        <Input
                                            type="number"
                                            className="w-20 text-center mx-auto"
                                            placeholder="0"
                                            value={scores[student.id]?.[field] ?? ''}
                                            onChange={(e) => handleScoreChange(student.id, field, e.target.value)}
                                            max={field === 'exam' ? 40 : 20}
                                            min={0}
                                            disabled={!sessionTermKey}
                                        />
                                    </TableCell>
                                ))}
                                <TableCell className="text-center font-bold">{student.total}</TableCell>
                                <TableCell className="text-center font-bold">{student.grade}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleSaveDraft} disabled={!sessionTermKey}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
            </Button>
            <Button onClick={handleSubmitScores} disabled={!sessionTermKey}>
                <Send className="mr-2 h-4 w-4" />
                Submit Final Scores
            </Button>
        </div>
      </div>
    </TeacherDashboardLayout>
  );
}

    
