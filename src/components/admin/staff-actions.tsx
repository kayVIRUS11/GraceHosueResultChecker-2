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
import { MoreHorizontal, PlusCircle, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { allStaff as initialStaff, type Staff } from "@/lib/data";
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

const staffFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  staffId: z.string().min(1, "Staff ID is required"),
  role: z.string().min(1, "Role is required"),
  status: z.enum(["Active", "On Leave", "Terminated"]),
});

type StaffFormData = z.infer<typeof staffFormSchema>;

export function StaffActions() {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      staffId: "",
      role: "",
      status: "Active",
    },
  });
  
  const generateStaffId = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const newStaffId = Math.max(0, ...staff.map((s) => s.id)) + 1;
    const paddedId = newStaffId.toString().padStart(3, '0');
    return `STF${paddedId}${year}`;
  };


  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "On Leave":
        return "secondary";
      case "Terminated":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleAddStaff = (data: StaffFormData) => {
    const newStaff: Staff = {
      id: Math.max(0, ...staff.map((s) => s.id)) + 1,
      ...data,
    };
    setStaff((prev) => [newStaff, ...prev]);
    toast({ title: "Staff Added", description: `${data.name} has been successfully added.` });
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleEditStaff = (data: StaffFormData) => {
    if (!selectedStaff) return;
    setStaff((prev) =>
      prev.map((s) =>
        s.id === selectedStaff.id ? { ...s, ...data } : s
      )
    );
    toast({ title: "Staff Updated", description: `${data.name}'s details have been updated.` });
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteStaff = (staffId: number) => {
    setStaff((prev) => prev.filter((s) => s.id !== staffId));
    toast({ title: "Staff Deleted", description: "The staff member has been removed." , variant: "destructive"});
  };

  const openEditDialog = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    form.reset({
        name: staffMember.name,
        staffId: staffMember.staffId,
        role: staffMember.role,
        status: staffMember.status as "Active" | "On Leave" | "Terminated",
    });
    setIsEditDialogOpen(true);
  };
  
  const openAddDialog = () => {
    form.reset({
        name: "",
        staffId: generateStaffId(),
        role: "Teacher",
        status: "Active",
    });
    setIsAddDialogOpen(true);
  };

  const openViewDialog = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsViewDialogOpen(true);
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={openAddDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Staff
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Staff ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((staffMember) => (
                <TableRow key={staffMember.id}>
                  <TableCell className="font-medium">
                    {staffMember.name}
                  </TableCell>
                  <TableCell>{staffMember.staffId}</TableCell>
                  <TableCell>{staffMember.role}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(staffMember.status)}>
                      {staffMember.status}
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
                        <DropdownMenuItem onClick={() => openEditDialog(staffMember)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openViewDialog(staffMember)}>View Details</DropdownMenuItem>
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
                                        This action cannot be undone. This will permanently delete the staff member's record.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteStaff(staffMember.id)}>Delete</AlertDialogAction>
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
            <DialogTitle>{isAddDialogOpen ? 'Add New Staff' : 'Edit Staff'}</DialogTitle>
            <DialogDescription>
              {isAddDialogOpen ? "Enter the details for the new staff member." : `Editing details for ${selectedStaff?.name}.`}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(isAddDialogOpen ? handleAddStaff : handleEditStaff)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff ID</FormLabel>
                    <FormControl>
                      <Input placeholder="STF00124" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Teacher" {...field} />
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
                            <SelectItem value="On Leave">On Leave</SelectItem>
                            <SelectItem value="Terminated">Terminated</SelectItem>
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
                    <User /> {selectedStaff?.name}'s Details
                </DialogTitle>
                <DialogDescription>
                    Viewing full record for the staff member.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
                <p><strong>Staff ID:</strong> {selectedStaff?.staffId}</p>
                <p><strong>Role:</strong> {selectedStaff?.role}</p>
                <p><strong>Status:</strong> <Badge variant={getStatusBadgeVariant(selectedStaff?.status ?? '')}>{selectedStaff?.status}</Badge></p>
            </div>
            <DialogFooter>
                <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
