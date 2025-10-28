"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { MoreHorizontal, PlusCircle, User, RefreshCw, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { allStudents as initialStudentsData, type Student, generatePin } from "@/lib/data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "@/hooks/use-toast";

const studentFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  regNumber: z.string().min(1, "Registration number is required"),
  class: z.string().min(1, "Class is required"),
  status: z.enum(["Active", "Suspended", "Graduated"]),
  scratchCardPin: z.string(),
});

type StudentFormData = z.infer<typeof studentFormSchema>;

export function StudentActions() {
  const [students, setStudents] = useState<Student[]>(initialStudentsData);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      regNumber: "",
      class: "",
      status: "Active",
      scratchCardPin: "",
    },
  });
  
  const generateRegNumber = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const newStudentId = Math.max(0, ...students.map((s) => s.id)) + 1;
    const paddedId = newStudentId.toString().padStart(3, '0');
    return `GHS${paddedId}${year}`;
  };


  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Suspended":
        return "destructive";
      case "Graduated":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleAddStudent = (data: StudentFormData) => {
    const newStudent: Student = {
      id: Math.max(0, ...students.map((s) => s.id)) + 1,
      ...data,
      scratchCardPin: generatePin(), // Also generate PIN on add
    };
    setStudents((prev) => [newStudent, ...prev]);
    toast({ title: "Student Added", description: `${data.name} has been successfully added.` });
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleEditStudent = (data: StudentFormData) => {
    if (!selectedStudent) return;
    setStudents((prev) =>
      prev.map((s) =>
        s.id === selectedStudent.id ? { ...s, ...data } : s
      )
    );
    toast({ title: "Student Updated", description: `${data.name}'s details have been updated.` });
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteStudent = (studentId: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    toast({ title: "Student Deleted", description: "The student has been removed." , variant: "destructive"});
  };
  
  const handleRegeneratePin = (studentId: number) => {
    setStudents(prev => 
        prev.map(student => 
            student.id === studentId ? {...student, scratchCardPin: generatePin()} : student
        )
    );
    toast({ title: "PIN Regenerated", description: "The student's scratch card PIN has been updated." });
  };

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student);
    form.reset({
        name: student.name,
        regNumber: student.regNumber,
        class: student.class,
        status: student.status as "Active" | "Suspended" | "Graduated",
        scratchCardPin: student.scratchCardPin,
    });
    setIsEditDialogOpen(true);
  };
  
  const openAddDialog = () => {
    form.reset({
        name: "",
        regNumber: generateRegNumber(),
        class: "",
        status: "Active",
        scratchCardPin: generatePin(),
    });
    setIsAddDialogOpen(true);
  };

  const openViewDialog = (student: Student) => {
    setSelectedStudent(student);
    setIsViewDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({title: "Copied to clipboard"});
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={openAddDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Student
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Registration No.</TableHead>
                <TableHead>Scratch Card PIN</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.name}
                  </TableCell>
                  <TableCell>{student.regNumber}</TableCell>
                  <TableCell className="font-mono flex items-center gap-2">
                    {student.scratchCardPin}
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(student.scratchCardPin)}>
                        <Copy className="h-3 w-3" />
                    </Button>
                  </TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(student.status)}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEditDialog(student)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openViewDialog(student)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRegeneratePin(student.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Regenerate PIN
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                    Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the student's record.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteStudent(student.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={isAddDialogOpen ? setIsAddDialogOpen : setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isAddDialogOpen ? 'Add New Student' : 'Edit Student'}</DialogTitle>
            <DialogDescription>
              {isAddDialogOpen ? "Enter the details for the new student." : `Editing details for ${selectedStudent?.name}.`}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(isAddDialogOpen ? handleAddStudent : handleEditStudent)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="regNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="GHS00124" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="scratchCardPin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scratch Card PIN</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., JSS 3A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Suspended">Suspended</SelectItem>
                            <SelectItem value="Graduated">Graduated</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <User /> {selectedStudent?.name}'s Details
                </DialogTitle>
                <DialogDescription>
                    Viewing full record for the student.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
                <p><strong>Registration No:</strong> {selectedStudent?.regNumber}</p>
                <p><strong>Class:</strong> {selectedStudent?.class}</p>
                <p><strong>Scratch Card PIN:</strong> <span className="font-mono">{selectedStudent?.scratchCardPin}</span></p>
                <div className="flex items-center gap-2"><strong>Status:</strong> <Badge variant={getStatusBadgeVariant(selectedStudent?.status ?? '')}>{selectedStudent?.status}</Badge></div>
            </div>
            <DialogFooter>
                <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}