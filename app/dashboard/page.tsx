"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Calendar, Package, Settings , TrashIcon , Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


export default function DashboardPage() {
const [view, setView] = useState<"renter" | "owner">("renter");
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [RemoveConfirmation, setRemoveConfirmation] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);

  const handleEditClick = (booking: any) => {
    setSelectedBooking(booking);
    setIsEditing(true);
  };

  const handleRemoveClick = (booking: any) => {
    setSelectedBooking(booking);
    setRemoveConfirmation(true);
  } 

    const handleRemoveConfirmed = async () => {
    if (!selectedBooking) return;
    setIsRemoving(true);
    try {
      const response = await fetch(`/api/listings/${selectedBooking.listing.id}`, {
      method: "DELETE",
      });

      if (response.ok) {
      setBookings((prev) => prev.filter((b) => b.id !== selectedBooking.id));
      setRemoveConfirmation(false);
      setSelectedBooking(null);
      }
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setIsRemoving(false);
    }
    };

    const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    try {
      const response = await fetch(`/api/listings/${selectedBooking.listing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedBooking.listing),
      });

      if (response.ok) {
      const updatedListing = await response.json().catch(() => null);
      setBookings((prev) =>
        prev.map((b) =>
        b.id === selectedBooking.id
          ? { ...b, listing: updatedListing ?? selectedBooking.listing }
          : b
        )
      );
      setIsEditing(false);
      setSelectedBooking(null);
      }
      } catch (error) {
        console.error("Update failed", error);
      }
    };

    useEffect(() => {
    const fetchCategories = async () => {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setAvailableCategories(data);
    };
    fetchCategories();
    }, []);

    useEffect(() => {
    const fetchBookings = async () => {
        setIsLoading(true);
        try {
        const response = await fetch(`/api/bookings?userId=1&mode=${view}`);
        const data = await response.json();
        setBookings(data);
        } catch (error) {
        console.error("Failed to fetch bookings:", error);
        } finally {
        setIsLoading(false);
        }
    };

    fetchBookings();
    }, [view]);

//   const DisplayEditView = () => {
//     <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
//         <DialogContent>
//             <h2 className="text-lg font-bold mb-4">Edit Booking</h2>
//             <p>This is where the edit booking form will go.</p>
//         </DialogContent>
//     </Dialog>
//   };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 pt-24 pb-12 mt-10">
        <div className="flex flex-col items-center mb-10 gap-4">
          <div className="flex p-1 bg-secondary rounded-lg w-full max-w-[300px]">
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => setView("renter")}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === "renter" ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              Renter View
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView("owner")}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === "owner" ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              Owner View
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">
            {view === "renter" ? "Active Rentals" : "Upcoming Requests"}
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="group border rounded-2xl p-4 bg-card hover:shadow-md transition-all flex items-center gap-4"
              >
                <div className="relative h-20 w-20 min-w-[80px] max-w-[80px] rounded-xl overflow-hidden bg-muted flex-shrink-0">
                {booking.listing.images?.[0]?.url ? (
                    <img 
                    src={booking.listing.images[0].url} 
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="text-muted-foreground w-6 h-6" />
                    </div>
                )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">
                    {booking.listing.title}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {format(new Date(booking.startDate), "MMM dd")} -{" "}
                        {format(new Date(booking.endDate), "MMM dd")}
                      </span>
                    </div>
                    <span className="w-fit text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">
                      {booking.status}
                    </span>
                  </div>
                  {view === "owner" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Renter: <span className="font-medium text-foreground">{booking.renter?.name}</span>
                    </p>
                  )}
                </div>

                {view === "owner" && (
                <div className="flex items-center gap-1">
                    <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full" 
                    onClick={() => handleEditClick(booking)} 
                    >
                    <Settings className="w-4 h-4 text-blue-500" />
                    </Button>

                    <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full" 
                    onClick={() => handleRemoveClick(booking)} 
                    >
                    <TrashIcon className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
                )}
              </div>
            ))
          ) : (
            <div className="border border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-muted/30">
              <Calendar className="w-10 h-10 text-muted-foreground mb-4 opacity-20" />
              <p className="text-sm font-medium text-muted-foreground">
                {view === "renter" 
                  ? "You haven't rented any items yet." 
                  : "No one has booked your items yet."}
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                New {view === "renter" ? "bookings" : "requests"} will appear here.
              </p>
            </div>
          )}
          
          <Dialog open={RemoveConfirmation} onOpenChange={setRemoveConfirmation}>
            <DialogContent className="max-w-sm">
            <div className="space-y-6 py-4">
                <div>
                <h2 className="text-2xl font-bold">Confirm Removal</h2>
                <p className="text-sm text-muted-foreground">Are you sure you want to remove this booking?</p>
                </div>
                <div className="flex gap-3 pt-4">
                    <Button 
                        type="button"
                        variant="outline"
                        className="flex-1 border"
                        onClick={() => setRemoveConfirmation(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className="flex-1"
                      onClick={handleRemoveConfirmed}
                      disabled={isRemoving}
                    >
                      {isRemoving ? "Removing..." : "Remove"}
                    </Button>
                </div>
            </div>
            </DialogContent>
        </Dialog>


          

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <div className="space-y-6 py-4">
                <div>
                <h2 className="text-2xl font-bold">Edit Listing</h2>
                <p className="text-sm text-muted-foreground">Update your item details below.</p>
                </div>

                {selectedBooking && (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="space-y-2">
                  <label className="text-sm font-medium">Item Name</label>
                  <input 
                    className="w-full p-2 border rounded-md bg-background"
                    value={selectedBooking.listing.title ?? ""}
                    onChange={(e) => setSelectedBooking({...selectedBooking, listing: {...selectedBooking.listing, title: e.target.value}})}
                  />
                  </div>

                  <div className="space-y-2">
                  <label className="text-sm font-medium">Price per Day ($)</label>
                  <input 
                    type="number"
                    className="w-full p-2 border rounded-md bg-background"
                    value={selectedBooking.listing.pricePerDay ?? 0}
                    onChange={(e) => setSelectedBooking({...selectedBooking, listing: {...selectedBooking.listing, pricePerDay: Number(e.target.value)}})}
                  />
                  </div>

                  <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={selectedBooking.listing.categoryId ?? ""}
                    onChange={(e) => setSelectedBooking({...selectedBooking, listing: {...selectedBooking.listing, categoryId: Number(e.target.value)}})}
                  >
                    {availableCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                    ))}
                  </select>
                  </div>

                  <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea 
                    className="w-full p-2 border rounded-md bg-background h-24"
                    value={selectedBooking.listing.description ?? ""}
                    onChange={(e) => setSelectedBooking({...selectedBooking, listing: {...selectedBooking.listing, description: e.target.value}})}
                  />
                  </div>

                  <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <input 
                    className="w-full p-2 border rounded-md bg-background"
                    value={selectedBooking.listing.location ?? ""}
                    onChange={(e) => setSelectedBooking({...selectedBooking, listing: {...selectedBooking.listing, location: e.target.value}})}
                  />
                  </div>

                  <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="flex-1 border" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-primary text-primary-foreground"
                  >
                    Save Changes
                  </Button>
                  </div>
                </form>
                )}
            </div>
            </DialogContent>
        </Dialog>
        </div>
      </main>
    </div>
  );
}
