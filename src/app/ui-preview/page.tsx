"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Tooltip } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Toaster, toast } from "@/components/ui/toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function UIPreviewPage() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAsyncAction = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        variant: "success",
        title: "Action Complete",
        description: "The background process completed successfully.",
      });
    }, 2000);
  };

  return (
    <Section size="md" className="bg-ivory min-h-screen">
      <Container>
        {/* Page Header */}
        <div className="mb-12 border-b border-sand pb-6">
          <span className="text-xs uppercase tracking-widest text-gold font-medium mb-2 block">
            Koshi Fresh Design System
          </span>
          <h1 className="text-4xl md:text-5xl text-forest font-serif leading-tight">
            UI Primitives Showcase
          </h1>
          <p className="text-sm md:text-base text-charcoal/80 font-light mt-2 max-w-xl">
            A comprehensive preview of all interactive design system primitives and atomic states.
          </p>
        </div>

        <Tabs defaultValue="actions" className="w-full">
          <TabsList className="mb-8 w-full justify-start overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="actions">Buttons & Indicators</TabsTrigger>
            <TabsTrigger value="forms">Form Elements</TabsTrigger>
            <TabsTrigger value="display">Data Display</TabsTrigger>
            <TabsTrigger value="overlays">Overlays & Modals</TabsTrigger>
          </TabsList>

          {/* ================= BUTTONS & INDICATORS ================= */}
          <TabsContent value="actions">
            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Buttons</CardTitle>
                  <CardDescription>
                    Action buttons supporting standard brand variants, sizes, and states.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Variants */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-sans font-medium uppercase tracking-wider text-stone">
                      Variants
                    </h4>
                    <div className="flex flex-wrap gap-4 items-center">
                      <Button variant="primary">Primary Forest</Button>
                      <Button variant="secondary">Secondary Sand</Button>
                      <Button variant="outline">Outline Forest</Button>
                      <Button variant="gold">Gold Accent</Button>
                      <Button variant="ghost">Ghost Button</Button>
                      <Button variant="link">Link Style</Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Sizes */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-sans font-medium uppercase tracking-wider text-stone">
                      Sizes
                    </h4>
                    <div className="flex flex-wrap gap-4 items-end">
                      <Button size="sm">Small (36px)</Button>
                      <Button size="md">Medium (44px)</Button>
                      <Button size="lg">Large (56px)</Button>
                    </div>
                  </div>

                  <Separator />

                  {/* States */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-sans font-medium uppercase tracking-wider text-stone">
                      States
                    </h4>
                    <div className="flex flex-wrap gap-4 items-center">
                      <Button disabled>Disabled Button</Button>
                      <Button isLoading>Loading State</Button>
                      <Button onClick={handleAsyncAction} isLoading={isLoading}>
                        Interactive Async Action
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badges, Spinners & Skeletons */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Badges</CardTitle>
                    <CardDescription>Status and product highlight tags.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
                    <Badge variant="primary">Best Seller</Badge>
                    <Badge variant="secondary">Organic</Badge>
                    <Badge variant="gold">10% Off</Badge>
                    <Badge variant="outline">Foxnuts</Badge>
                    <Badge variant="success">In Stock</Badge>
                    <Badge variant="error">Out of Stock</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Spinners & Loaders</CardTitle>
                    <CardDescription>Activity indicators and skeleton shapes.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Spinner size="sm" />
                      <Spinner size="md" className="text-forest" />
                      <Spinner size="lg" className="text-gold" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                      <div className="flex items-center space-x-4 pt-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[120px]" />
                          <Skeleton className="h-4 w-[80px]" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ================= FORM ELEMENTS ================= */}
          <TabsContent value="forms">
            <Card>
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
                <CardDescription>
                  Inputs, switches, checkboxes, select menus, and choice items.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Inputs */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="text-sm font-sans font-medium text-obsidian">Text Inputs</h4>
                    <Input placeholder="Enter your full name..." />
                    <Input placeholder="Disabled state..." disabled />
                    <Input
                      placeholder="Error state..."
                      error
                      helperText="Please enter a valid email address."
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-sans font-medium text-obsidian">Textarea Input</h4>
                    <Textarea placeholder="Enter your delivery directions..." />
                    <Textarea
                      placeholder="Error text area..."
                      error
                      helperText="Character count exceeds limit."
                    />
                  </div>
                </div>

                <Separator />

                {/* Selection & Triggers */}
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Select */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-sans font-medium text-obsidian">Dropdown Select</h4>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select pack size..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="250">250g Pack</SelectItem>
                        <SelectItem value="500">500g Pack</SelectItem>
                        <SelectItem value="1000">1kg Mega Pack</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select disabled>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Disabled Select Menu..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None Available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Checkbox & Radio */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-sans font-medium text-obsidian">Checkboxes & Radios</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="terms" />
                        <label
                          htmlFor="terms"
                          className="text-sm font-sans font-light text-obsidian cursor-pointer select-none"
                        >
                          Agree to brand policies
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="marketing" disabled checked />
                        <label
                          htmlFor="marketing"
                          className="text-sm font-sans font-light text-stone cursor-not-allowed select-none"
                        >
                          Subscribed to newsletter (Disabled)
                        </label>
                      </div>
                    </div>

                    <RadioGroup defaultValue="card" className="pt-2">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="card" id="r-card" />
                        <label htmlFor="r-card" className="text-sm font-sans font-light text-obsidian cursor-pointer">
                          Credit / Debit Card
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="cod" id="r-cod" />
                        <label htmlFor="r-cod" className="text-sm font-sans font-light text-obsidian cursor-pointer">
                          Cash on Delivery
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Switch */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-sans font-medium text-obsidian">Toggle Switch</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border border-sand bg-sand/20 p-3">
                        <span className="text-sm font-sans font-light text-obsidian">
                          Enable Express Shipping
                        </span>
                        <Switch id="express-ship" />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-sand bg-sand/20 p-3 opacity-50">
                        <span className="text-sm font-sans font-light text-stone">
                          Notify via WhatsApp (Disabled)
                        </span>
                        <Switch id="whatsapp-notify" disabled />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= DATA DISPLAY ================= */}
          <TabsContent value="display">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Accordions */}
              <Card>
                <CardHeader>
                  <CardTitle>Accordions</CardTitle>
                  <CardDescription>Collapsible product specifications and FAQ.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Nutritional Value</AccordionTrigger>
                      <AccordionContent>
                        Our makhanas are highly packed with protein (9.7g per 100g), high fiber content,
                        zero cholesterol, and organic calcium matrices.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Sourcing & Origin</AccordionTrigger>
                      <AccordionContent>
                        Harvested naturally and processed using traditional methods in Madhubani and
                        Darbhanga districts, Bihar.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Storage Instructions</AccordionTrigger>
                      <AccordionContent>
                        Store in a cool, dry place. Once opened, transfer to an airtight container to
                        maintain raw crunchiness.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Avatars & Tooltips */}
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Avatars</CardTitle>
                    <CardDescription>Profile pictures and fallback layouts.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback>KF</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-forest text-ivory text-lg">KF</AvatarFallback>
                    </Avatar>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tooltips</CardTitle>
                    <CardDescription>Actionable descriptive helper triggers.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-4">
                    <Tooltip content="Mithila Foxnuts are 100% organic and rich in calcium.">
                      <span className="inline-flex items-center justify-center rounded-lg border border-sand bg-white px-4 py-2 text-sm text-obsidian shadow-premium-sm cursor-help select-none">
                        Hover for Info
                      </span>
                    </Tooltip>
                    <Tooltip content="Free shipping applies to order totals above ₹499.">
                      <span className="inline-flex items-center justify-center rounded-lg border border-forest text-forest bg-transparent px-4 py-2 text-sm shadow-premium-sm cursor-help select-none">
                        Shipping Terms
                      </span>
                    </Tooltip>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ================= OVERLAYS & MODALS ================= */}
          <TabsContent value="overlays">
            <Card>
              <CardHeader>
                <CardTitle>Overlays & Notifications</CardTitle>
                <CardDescription>Modals, drawers, and global toast alerts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  {/* Dialog Trigger */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="primary">Open Modal Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Mithila Farmers Partnership</DialogTitle>
                        <DialogDescription>
                          Every makhana purchased supports local agricultural cooperatives in Bihar.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 text-sm font-sans font-light text-charcoal">
                        By working directly with farming families in Mithilanchal, we eliminate middle-tier margins, returning 100% of organic value directly to the soil farmers.
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="secondary" size="sm">Dismiss</Button>
                        </DialogClose>
                        <Button variant="primary" size="sm">Explore Our Farmers</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Drawer Trigger */}
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="outline">Open Side Drawer (Cart)</Button>
                    </DrawerTrigger>
                    <DrawerContent side="right">
                      <DrawerHeader>
                        <DrawerTitle>Shopping Bag</DrawerTitle>
                        <DrawerDescription>Your selected organic food products.</DrawerDescription>
                      </DrawerHeader>
                      <div className="flex-1 py-8 flex flex-col items-center justify-center text-center">
                        <span className="text-stone/60 mb-2">No Items in Drawer</span>
                        <p className="text-xs text-stone font-light max-w-[200px]">
                          Your organic shopping basket is empty.
                        </p>
                      </div>
                      <DrawerFooter>
                        <Button className="w-full">Continue to Shop</Button>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>

                  {/* Bottom Drawer Trigger */}
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="secondary">Open Bottom Drawer</Button>
                    </DrawerTrigger>
                    <DrawerContent side="bottom">
                      <DrawerHeader>
                        <DrawerTitle>Select Pack Variant</DrawerTitle>
                        <DrawerDescription>Pick a size to proceed to purchase.</DrawerDescription>
                      </DrawerHeader>
                      <div className="py-6 flex justify-around">
                        <Button variant="outline" size="sm">250g - ₹299</Button>
                        <Button variant="outline" size="sm">500g - ₹549</Button>

                        <Button variant="outline" size="sm">1kg - ₹999</Button>
                      </div>
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button variant="primary" className="w-full">Confirm Selection</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </div>

                <Separator />

                {/* Toasts Triggers */}
                <div className="space-y-4">
                  <h4 className="text-sm font-sans font-medium text-obsidian">Toast Notifications</h4>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: "Product Added",
                          description: "Added 250g Raw Makhana to your basket.",
                        })
                      }
                    >
                      Default Toast
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-feedback-success hover:bg-feedback-success/90"
                      onClick={() =>
                        toast({
                          variant: "success",
                          title: "Successful Checkout",
                          description: "Your mock order has been placed.",
                        })
                      }
                    >
                      Success Toast
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-feedback-error hover:bg-feedback-error/90"
                      onClick={() =>
                        toast({
                          variant: "error",
                          title: "Payment Denied",
                          description: "Transaction failed. Please try COD.",
                        })
                      }
                    >
                      Error Toast
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-feedback-warning hover:bg-feedback-warning/90 text-obsidian"
                      onClick={() =>
                        toast({
                          variant: "warning",
                          title: "Inventory Alert",
                          description: "Only 2 packs remaining in stock.",
                        })
                      }
                    >
                      Warning Toast
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-feedback-info hover:bg-feedback-info/90"
                      onClick={() =>
                        toast({
                          variant: "info",
                          title: "Delivery Status",
                          description: "Free shipping active for orders above ₹499.",
                        })
                      }
                    >
                      Info Toast
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Global Toast Elements */}
        <Toaster />
      </Container>
    </Section>
  );
}
