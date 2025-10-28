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
import { MoreHorizontal, PlusCircle, Trash, Copy, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { initialScratchCards, type ScratchCard } from "@/lib/data";
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
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "../ui/checkbox";

const generateFormSchema = z.object({
  count: z.coerce.number().min(1, "Must generate at least 1 card.").max(100, "Cannot generate more than 100 cards at a time."),
});

type GenerateFormData = z.infer<typeof generateFormSchema>;

export function ScratchCardGenerator() {
  const [cards, setCards] = useState<ScratchCard[]>(initialScratchCards);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateFormData>({
    resolver: zodResolver(generateFormSchema),
    defaultValues: {
      count: 10,
    },
  });

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

  const generatePins = (count: number): string[] => {
    const pins: string[] = [];
    for (let i = 0; i < count; i++) {
        const pin = `SC-${[...Array(3)].map(() => Math.floor(Math.random() * 9000 + 1000)).join('-')}`;
        pins.push(pin);
    }
    return pins;
  };

  const handleGenerateCards = (data: GenerateFormData) => {
    const newPins = generatePins(data.count);
    const newCards: ScratchCard[] = newPins.map((pin, i) => ({
      id: Math.max(0, ...cards.map(c => c.id), ...initialScratchCards.map(c => c.id)) + i + 1,
      pin,
      status: "Not Used",
      createdAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    }));

    setCards(prev => [...newCards, ...prev]);
    toast({ title: "Cards Generated", description: `${data.count} new scratch cards have been created.` });
    setIsGenerateDialogOpen(false);
    form.reset();
  };

  const handleDeleteCard = (cardId: number) => {
    setCards(prev => prev.filter(c => c.id !== cardId));
    toast({ title: "Card Deleted", description: "The scratch card has been removed.", variant: "destructive" });
  };
  
  const handleDeleteSelected = () => {
    setCards(prev => prev.filter(c => !selectedCards.includes(c.id)));
    toast({ title: "Cards Deleted", description: `${selectedCards.length} cards have been removed.`, variant: "destructive" });
    setSelectedCards([]);
  };

  const handleSelectCard = (cardId: number) => {
    setSelectedCards(prev => prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]);
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
        setSelectedCards(cards.map(c => c.id));
    } else {
        setSelectedCards([]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({title: "Copied to clipboard"});
  };

  const downloadSelected = () => {
    const selectedData = cards.filter(c => selectedCards.includes(c.id));
    const csvContent = "data:text/csv;charset=utf-8," 
        + "PIN,Status,Date Generated\n" 
        + selectedData.map(c => `${c.pin},${c.status},${c.createdAt}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "scratch_cards.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                    <Button variant="outline" size="sm" onClick={downloadSelected}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                </div>
            )}
        </div>
        <Button onClick={() => setIsGenerateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Generate New Cards
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Generated Scratch Cards</CardTitle>
          <CardDescription>A list of all generated result-checker PINs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead padding="checkbox">
                    <Checkbox
                        checked={selectedCards.length === cards.length && cards.length > 0}
                        onCheckedChange={handleSelectAll}
                    />
                </TableHead>
                <TableHead>Card PIN</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Generated</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.map((card) => (
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
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(card.status)}>
                      {card.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{card.createdAt}</TableCell>
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
                        <DropdownMenuItem onClick={() => copyToClipboard(card.pin)}>Copy PIN</DropdownMenuItem>
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
                                        This action cannot be undone. This will permanently delete the scratch card.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteCard(card.id)}>Delete</AlertDialogAction>
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
      
      {/* Generate Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate Cards</DialogTitle>
            <DialogDescription>
              Specify how many scratch cards you want to create.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateCards)} className="space-y-4">
              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Cards</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Generate</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
