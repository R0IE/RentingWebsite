"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Star, MapPin, CalendarDays, ChevronLeft, User, InfoIcon, CheckCircle2Icon } from "lucide-react";
import { format, differenceInDays, addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ItemProps {
  item: any;
}

export default function ItemDetailClient({ item }: ItemProps) {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [bookings, setBookings] = useState<any[]>(item?.bookings || []);

  useEffect(() => {
    if (item?.bookings && item.bookings.length > 0) return;
    if (!item?.id) return;

    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/bookings?listingId=${item.id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setBookings(data || []);
      } catch (err) {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, [item?.id, item?.bookings]);

  const bookedIntervals: { from: Date; to: Date }[] = (bookings || []).map((b: any) => ({
    from: new Date(b.startDate),
    to: new Date(b.endDate),
  }));

  const calculatePrice = () => {
    if (!date?.from || !date?.to) return 0;
    const days = Math.max(differenceInDays(date.to, date.from), 1);
    return days * item.pricePerDay;
  };

    const SuccessAlert = () => {
        <Alert className="max-w-md">
        <CheckCircle2Icon />
        <AlertTitle>Account updated successfully</AlertTitle>
        <AlertDescription>
            Your profile information has been saved. Changes will be reflected
            immediately.
        </AlertDescription>
        </Alert>
    };

    const handleConfirmBooking = async () => {
        if (!date?.from || !date?.to) return;

        const response = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            listingId: item.id,
            renterId: 1, 
            startDate: date.from.toISOString(),
            endDate: date.to.toISOString(),
            }),
        });

        if (response.ok) {
            setShowBookingModal(false);
            SuccessAlert();
        } else {
            const errorData = await response.json();
            alert(errorData.error);
        }
    };


  const serviceFee = Math.round(calculatePrice() * 0.1);
  const totalPrice = calculatePrice() + serviceFee;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to listings
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-8 gap-y-12 lg:gap-x-16">
          
          <div className="lg:col-span-3 space-y-6">
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-muted">
            <Image 
                src={item.images[0]?.url || "/placeholder.png"} 
                alt={item.title} 
                fill 
                priority
                sizes="(max-width: 1024px) 100vw, 75vw"
                className="object-cover" 
            />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight">{item.title}</h1>
              <div className="flex items-center gap-6 text-base">
                 <div className="flex items-center gap-1.5 text-muted-foreground">
                   <MapPin className="w-5 h-5"/> 
                   {item.location}
                 </div>
              </div>
              <hr className="border-border" />
              <p className="text-muted-foreground text-xl leading-relaxed">{item.description}</p>
            </div>

            <div className="mt-8 p-6 rounded-2xl border bg-card flex items-center gap-5 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="text-primary w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Hosted by</p>
                    <p className="font-bold text-lg">{item.owner.name}</p>
                </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 border rounded-3xl p-6 shadow-xl bg-card">
              <div className="text-2xl font-bold mb-6">
                ${item.pricePerDay} <span className="text-sm font-normal text-muted-foreground">/ day</span>
              </div>
              
              <div className="grid gap-2 mb-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal h-auto py-3 px-4 rounded-xl",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-5 w-5 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Dates</span>
                        <span className="text-sm">
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, "LLL dd")} - {format(date.to, "LLL dd")}
                              </>
                            ) : (
                              format(date.from, "LLL dd")
                            )
                          ) : (
                            "Pick a date"
                          )}
                        </span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={date?.from}
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={2}
                          disabled={(d: Date) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            if (d < today) return true
                            return bookedIntervals.some((intv) => d >= intv.from && d <= intv.to)
                          }}
                          modifiers={{ booked: bookedIntervals }}
                          modifiersStyles={{
                            booked: { background: "rgba(239,68,68,0.95)", color: "white" },
                          }}
                        />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3 py-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground underline">
                    ${item.pricePerDay} x {date?.from && date?.to ? differenceInDays(date.to, date.from) : 0} days
                  </span> 
                  <span>${calculatePrice()}</span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-4 border-t border-border">
                  <span>Total</span> 
                  <span>${totalPrice}</span>
                </div>
              </div>

              <Button 
                className="w-full py-6 text-lg font-bold rounded-xl mt-4" 
                onClick={() => setShowBookingModal(true)}
                disabled={!date?.from || !date?.to}
              >
                Reserve Now
              </Button>
              
              <p className="text-center text-xs text-muted-foreground mt-4">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-lg">
          <div className="p-1 space-y-4">
            <h2 className="text-2xl font-bold">Confirm Your Booking</h2>
            <p className="text-muted-foreground">
                You're about to book <span className="font-semibold">{item.title}</span>{' '}
                {date?.from && date?.to ? (
                  <>from <span className="font-semibold">{format(date.from, "LLL dd, yyyy")}</span> to <span className="font-semibold">{format(date.to, "LLL dd, yyyy")}</span>.</>
                ) : (
                  <span className="font-semibold">— please select dates</span>
                )}
            </p>
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground underline">
                    ${item.pricePerDay} x {date?.from && date?.to ? differenceInDays(date.to, date.from) : 0} days
                </span>
                <span>${calculatePrice()}</span>
            </div>
            <div className="flex justify-between font-bold text-xl pt-4 border-t border-border">
                <span>Total</span>
                <span>${totalPrice}</span>
            </div>
            <Button className="w-full py-6 mt-6" onClick={handleConfirmBooking} disabled={!date?.from || !date?.to}>
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}