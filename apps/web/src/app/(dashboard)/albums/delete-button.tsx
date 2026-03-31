"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { deleteAlbum } from "./actions";

export function DeleteButton({ albumId }: { albumId: number }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this album?")) {
      return;
    }

    startTransition(async () => {
      await deleteAlbum(albumId);
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
