"use client";

import { useState, useMemo } from "react";
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
import { RefreshCw, Trash, Copy, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { allStudents as initialStudentsData, allStaff as initialStaffData, type Student, type Staff, type ScratchCardDisplay, generatePin } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function ScratchCardGenerator() {
  const [students, setStudents] = useState<Student[]>(initialStudentsData);
  const [staff, setStaff] = useState<Staff[]>(initialStaffData);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const { toast } = useToast();

  const allCards: ScratchCardDisplay[] = useMemo(() => {
    const studentCards = students.map(s => ({
        id: `student-${s.id}`,
        pin: s.scratchCardPin,
        status: "Not Used" as const, // Assuming status logic would be more complex in a real app
        assignedTo: s.name,
        role: "Student" as const,
    }));
    const staffCards = staff.map(s => ({
        id: `staff-${s.id}`,
        pin: s.scratchCardPin,
        status: "Not Used" as const,
        assignedTo: s.name,
        role: "Staff" as const,
    }));
    return [...studentCards, ...staffCards];
  }, [students, staff]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Used":
        return "secondary";
      case "Not Used":
        return "default";
      default:
        return "outline";
    }
  };

  const handleRegenerateAll = () => {
    setStudents(prev => prev.map(s => ({ ...s, scratchCardPin: generatePin() })));
    setStaff(prev => prev.map(s => ({ ...s, scratchCardPin: generatePin() })));
    toast({ title: "All PINs Regenerated", description: "All scratch card PINs for students and staff have been reset." });
  };
  
  const handleRegenerateSelected = () => {
    const studentIdsToRegen = new Set(selectedCards.filter(id => id.startsWith("student-")).map(id => parseInt(id.split('-')[1])));
    const staffIdsToRegen = new Set(selectedCards.filter(id => id.startsWith("staff-")).map(id => parseInt(id.split('-')[1])));

    setStudents(prev => prev.map(s => studentIdsToRegen.has(s.id) ? { ...s, scratchCardPin: generatePin() } : s));
    setStaff(prev => prev.map(s => staffIdsToRegen.has(s.id) ? { ...s, scratchCardPin: generatePin() } : s));
    
    toast({ title: "Selected PINs Regenerated", description: `${selectedCards.length} PINs have been reset.` });
    setSelectedCards([]);
  };

  const handleRegenerateSingle = (cardId: string) => {
    if(cardId.startsWith("student-")) {
        const studentId = parseInt(cardId.split('-')[1]);
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, scratchCardPin: generatePin() } : s));
    } else if (cardId.startsWith("staff-")) {
        const staffId = parseInt(cardId.split('-')[1]);
        setStaff(prev => prev.map(s => s.id === staffId ? { ...s, scratchCardPin: generatePin() } : s));
    }
    toast({ title: "PIN Regenerated", description: `The PIN has been reset.` });
  };

  const handleDeleteSelected = () => {
    // In a real app, this would be more complex.
    // For this mock, we'll just show a toast as we can't "delete" a PIN from a user.
    toast({ title: "Action Not Supported", description: "To remove a card, regenerate the user's PIN or delete the user.", variant: "destructive" });
    setSelectedCards([]);
  };

  const handleSelectCard = (cardId: string) => {
    setSelectedCards(prev => prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]);
  };
  
  const handleSelectAll = (checked: boolean | string) => {
    if (checked) {
        setSelectedCards(allCards.map(c => c.id));
    } else {
        setSelectedCards([]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({title: "Copied to clipboard"});
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div>
            {selectedCards.length > 0 && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{selectedCards.length} selected</span>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                             <Button variant="outline" size="sm">
                                <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will regenerate {selectedCards.length} selected PINs, invalidating the old ones. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleRegenerateSelected}>Regenerate</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-destructive">
                                <Trash className="mr-2 h-4 w-4" /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete {selectedCards.length} selected cards. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteSelected}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}
        </div>
         <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate All PINs
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will regenerate scratch card PINs for ALL students and staff. This action cannot be undone and will invalidate all existing PINs.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRegenerateAll}>Yes, Regenerate All</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Scratch Card Hub</CardTitle>
          <CardDescription>A consolidated list of all scratch cards assigned to users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                    <Checkbox
                        checked={selectedCards.length === allCards.length && allCards.length > 0}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all rows"
                    />
                </TableHead>
                <TableHead>Card PIN</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCards.map((card) => (
                <TableRow key={card.id} data-state={selectedCards.includes(card.id) && "selected"}>
                  <TableCell>
                    <Checkbox
                        checked={selectedCards.includes(card.id)}
                        onCheckedChange={() => handleSelectCard(card.id)}
                        aria-label={`Select row for ${card.assignedTo}`}
                    />
                  </TableCell>
                  <TableCell className="font-mono flex items-center gap-2">
                    {card.pin}
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(card.pin)}>
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy PIN</span>
                    </Button>
                  </TableCell>
                   <TableCell>{card.assignedTo}</TableCell>
                   <TableCell>{card.role}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(card.status)}>
                      {card.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleRegenerateSingle(card.id)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Regenerate PIN
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
