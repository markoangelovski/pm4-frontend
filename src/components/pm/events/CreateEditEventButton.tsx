"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateEditEventForm from "./CreateEditEventForm";
import { PmEvent } from "@/types";

interface CreateEditEventButtonProps {
  event?: PmEvent;
}

export default function CreateEditEventButton({
  event,
}: CreateEditEventButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={event ? "outline" : "default"}>
          {event ? (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Edit Event
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Event
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          {event ? "Edit Event " + event.title : "New Event"}
        </DialogTitle>
        <CreateEditEventForm event={event} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
