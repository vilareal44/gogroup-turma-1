"use client";

import { useState, useRef, useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PencilIcon, PlusIcon } from "lucide-react";
import { createArtist, updateArtist } from "./actions";

interface ArtistFormProps {
  artist?: { artistId: number; name: string | null };
}

async function handleCreate(_prev: unknown, formData: FormData) {
  return await createArtist(formData);
}

async function handleUpdate(_prev: unknown, formData: FormData) {
  return await updateArtist(formData);
}

export function ArtistForm({ artist }: ArtistFormProps) {
  const isEditing = !!artist;
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    isEditing ? handleUpdate : handleCreate,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && "success" in state && state.success) {
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isEditing ? (
            <Button variant="ghost" size="icon-sm" />
          ) : (
            <Button />
          )
        }
      >
        {isEditing ? (
          <>
            <PencilIcon />
            <span className="sr-only">Edit</span>
          </>
        ) : (
          <>
            <PlusIcon data-icon="inline-start" />
            New Artist
          </>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Artist" : "New Artist"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the artist details."
              : "Add a new artist to the database."}
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="grid gap-4">
          {isEditing && (
            <input type="hidden" name="artistId" value={artist.artistId} />
          )}

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Artist name"
              defaultValue={artist?.name ?? ""}
              required
              maxLength={120}
            />
          </div>

          {state && "error" in state && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Update Artist"
                  : "Create Artist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
