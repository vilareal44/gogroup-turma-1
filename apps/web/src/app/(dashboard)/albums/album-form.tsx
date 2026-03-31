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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PencilIcon, PlusIcon } from "lucide-react";
import { createAlbum, updateAlbum } from "./actions";

interface AlbumFormProps {
  album?: { albumId: number; title: string; artistId: number };
  artists: { artistId: number; name: string | null }[];
}

async function handleCreate(_prev: unknown, formData: FormData) {
  return await createAlbum(formData);
}

async function handleUpdate(_prev: unknown, formData: FormData) {
  return await updateAlbum(formData);
}

export function AlbumForm({ album, artists }: AlbumFormProps) {
  const isEditing = !!album;
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    isEditing ? handleUpdate : handleCreate,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedArtistId, setSelectedArtistId] = useState<string>(
    album?.artistId?.toString() ?? ""
  );

  useEffect(() => {
    if (state && "success" in state && state.success) {
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state]);

  useEffect(() => {
    if (open) {
      setSelectedArtistId(album?.artistId?.toString() ?? "");
    }
  }, [open, album?.artistId]);

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
            New Album
          </>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Album" : "New Album"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the album details."
              : "Add a new album to the database."}
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="grid gap-4">
          {isEditing && (
            <input type="hidden" name="albumId" value={album.albumId} />
          )}

          <input type="hidden" name="artistId" value={selectedArtistId} />

          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Album title"
              defaultValue={album?.title ?? ""}
              required
              maxLength={160}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="artistId-select">Artist</Label>
            <Select
              value={selectedArtistId}
              onValueChange={(val) => setSelectedArtistId(String(val))}
            >
              <SelectTrigger className="w-full" id="artistId-select">
                <SelectValue placeholder="Select an artist" />
              </SelectTrigger>
              <SelectContent>
                {artists.map((a) => (
                  <SelectItem key={a.artistId} value={String(a.artistId)}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {state && "error" in state && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Update Album"
                  : "Create Album"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
