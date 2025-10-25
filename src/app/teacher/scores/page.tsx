"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { studentsForTeacher } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Save, Send } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

type Score = { test1: number | null, test2: number | null, test3: number | null, exam: number | null };

export default function TeacherScoresPage() {
    const [scores, setScores] = useState<Record<number, Score>>(
        studentsForTeacher.reduce((acc, student) => ({
            ...acc,
            [student.id]: { test1: null, test2: null, test3: null, exam: null }
        }), {})
    );
    const { toast } = useToast();

    const handleScoreChange = (studentId: number, field: keyof Score, value: string) => {
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

        setScores(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: isNaN(numericValue as number) ? null : numericValue
            }
        }));
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


            return {
                ...student,
                total: isNaN(total) ? 0 : total,
                grade
            };
        });
    }, [scores]);
    
    const handleSaveDraft = () => {
        toast({ title: "Draft Saved", description: "Your scores have been saved as a draft." });
    };

    const handleSubmitScores = () => {
        toast({ title: "Scores Submitted", description: "Final scores have been successfully submitted." });
    };

  return (
    <>
      <PageHeader
        title="Score Entry"
        description="Enter student scores for your assigned class and subject."
      />
      <div className="space-y-8">
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div>
                        <CardTitle className="font-headline">Class Scores</CardTitle>
                        <CardDescription>Select a class and subject to begin.</CardDescription>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <Select defaultValue="jss3a">
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="jss3a">JSS 3A</SelectItem>
                                <SelectItem value="jss3b">JSS 3B</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="math">
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
            <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
            </Button>
            <Button onClick={handleSubmitScores}>
                <Send className="mr-2 h-4 w-4" />
                Submit Final Scores
            </Button>
        </div>
      </div>
    </>
  );
}
