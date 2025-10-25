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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { allSessions as initialSessions, type Session } from "@/lib/data";
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

const sessionFormSchema = z.object({
  name: z.string().regex(/^\d{4}\/\d{4}$/, "Session must be in YYYY/YYYY format"),
  term: z.enum(["First Term", "Second Term", "Third Term"]),
  status: z.enum(["Active", "Inactive", "Completed"]),
});

type SessionFormData = z.infer<typeof sessionFormSchema>;

export function SessionActions() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      name: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
      term: "First Term",
      status: "Inactive",
    },
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Completed":
        return "secondary";
      case "Inactive":
        return "outline";
      default:
        return "outline";
    }
  };

  const handleAddSession = (data: SessionFormData) => {
    const newSession: Session = {
      id: Math.max(0, ...sessions.map((s) => s.id)) + 1,
      ...data,
    };
    setSessions((prev) => [newSession, ...prev]);
    toast({ title: "Session Added", description: `The ${data.term} of ${data.name} has been added.` });
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleEditSession = (data: SessionFormData) => {
    if (!selectedSession) return;
    setSessions((prev) =>
      prev.map((s) =>
        s.id === selectedSession.id ? { ...s, ...data } : s
      )
    );
    toast({ title: "Session Updated", description: `The session details have been updated.` });
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteSession = (sessionId: number) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast({ title: "Session Deleted", description: "The session has been removed." , variant: "destructive"});
  };

  const openEditDialog = (session: Session) => {
    setSelectedSession(session);
    form.reset({
        name: session.name,
        term: session.term as "First Term" | "Second Term" | "Third Term",
        status: session.status,
    });
    setIsEditDialogOpen(true);
  };
  
  const openAddDialog = () => {
    const currentYear = new Date().getFullYear();
    form.reset({
        name: `${currentYear}/${currentYear + 1}`,
        term: "First Term",
        status: "Inactive",
    });
    setIsAddDialogOpen(true);
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={openAddDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Session
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Academic Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">
                    {session.name}
                  </TableCell>
                  <TableCell>{session.term}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(session.status)}>
                      {session.status}
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
                        <DropdownMenuItem onClick={() => openEditDialog(session)}>Edit</DropdownMenuItem>
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
                                        This action cannot be undone. This will permanently delete the session record.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteSession(session.id)}>Delete</AlertDialogAction>
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
            <DialogTitle>{isAddDialogOpen ? 'Add New Session' : 'Edit Session'}</DialogTitle>
            <DialogDescription>
              {isAddDialogOpen ? "Enter the details for the new academic session." : `Editing session details.`}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(isAddDialogOpen ? handleAddSession : handleEditSession)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Name</FormLabel>
                    <FormControl>
                      <Input placeholder="2024/2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Term</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select term" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="First Term">First Term</SelectItem>
                            <SelectItem value="Second Term">Second Term</SelectItem>
                            <SelectItem value="Third Term">Third Term</SelectItem>
                        </SelectContent>
                    </Select>
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
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
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
    </>
  );
}
