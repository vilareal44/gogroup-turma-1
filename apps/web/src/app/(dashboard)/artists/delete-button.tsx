"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { deleteArtist } from "./actions";

export function DeleteButton({ artistId }: { artistId: number }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this artist? This will also delete all their albums.")) {
      return;
    }

    startTransition(async () => {
      await deleteArtist(artistId);
    });
  }

  return (
    <Button
      variant="destructive"
      size="icon-sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2Icon />
      <span className="sr-only">Delete</span>
    </Button>
  );
}
