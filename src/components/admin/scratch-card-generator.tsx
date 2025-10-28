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
import { RefreshCw, Trash, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { allStudents as initialStudents, allStaff as initialStaff, type Student, type Staff, type ScratchCardDisplay } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "../ui/checkbox";

const generatePin = () => `SC-${[...Array(3)].map(() => Math.floor(Math.random() * 9000 + 1000)).join('-')}`;

export function ScratchCardGenerator() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
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
  
  const handleDeleteSelected = () => {
    // In a real app, this would be more complex.
    // For this mock, we'll just show a toast as we can't "delete" a PIN from a user.
    toast({ title: "Action Not Supported", description: "To remove a card, regenerate the user's PIN or delete the user.", variant: "destructive" });
    setSelectedCards([]);
  };

  const handleSelectCard = (cardId: string) => {
    setSelectedCards(prev => prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]);
  };
  
  const handleSelectAll = (checked: boolean) => {
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
                <TableHead padding="checkbox">
                    <Checkbox
                        checked={selectedCards.length === allCards.length && allCards.length > 0}
                        onCheckedChange={handleSelectAll}
                    />
                </TableHead>
                <TableHead>Card PIN</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                        checked={selectedCards.includes(card.id)}
                        onCheckedChange={() => handleSelectCard(card.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono flex items-center gap-2">
                    {card.pin}
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(card.pin)}>
                        <Copy className="h-3 w-3" />
                    </Button>
                  </TableCell>
                   <TableCell>{card.assignedTo}</TableCell>
                   <TableCell>{card.role}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(card.status)}>
                      {card.status}
                    </Badge>
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
