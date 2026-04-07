"use server";

import { db } from "@/lib/db";
import { album, artist, track, invoiceLine, playlistTrack } from "@chinook/db/schema";
import { eq, like, asc, sql, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const albumSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(160, "Title must be 160 characters or less"),
  artistId: z.coerce.number().int().positive("Artist is required"),
});

export async function getAlbums(search?: string) {
  const results = await db
    .select({
      albumId: album.albumId,
      title: album.title,
      artistId: album.artistId,
      artistName: artist.name,
    })
    .from(album)
    .innerJoin(artist, eq(album.artistId, artist.artistId))
    .where(search ? like(album.title, `%${search}%`) : undefined)
    .orderBy(asc(album.title));

  return results;
}

export async function getAlbumsByArtist(artistId: number) {
  const results = await db
    .select()
    .from(album)
    .where(eq(album.artistId, artistId))
    .orderBy(asc(album.title));

  return results;
}

export async function createAlbum(formData: FormData) {
  const parsed = albumSchema.safeParse({
    title: formData.get("title"),
    artistId: formData.get("artistId"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { error: errors.title?.[0] ?? errors.artistId?.[0] ?? "Invalid input" };
  }

  const [maxId] = await db
    .select({ max: sql<number>`coalesce(max("AlbumId"), 0)` })
    .from(album);

  await db.insert(album).values({
    albumId: maxId.max + 1,
    title: parsed.data.title,
    artistId: parsed.data.artistId,
  });

  revalidatePath("/albums");
  return { success: true };
}

export async function updateAlbum(formData: FormData) {
  const id = Number(formData.get("albumId"));

  if (!id || isNaN(id)) {
    return { error: "Invalid album ID" };
  }

  const parsed = albumSchema.safeParse({
    title: formData.get("title"),
    artistId: formData.get("artistId"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { error: errors.title?.[0] ?? errors.artistId?.[0] ?? "Invalid input" };
  }

  await db
    .update(album)
    .set({ title: parsed.data.title, artistId: parsed.data.artistId })
    .where(eq(album.albumId, id));

  revalidatePath("/albums");
  return { success: true };
}

export async function deleteAlbum(id: number) {
  const trackIds = db.select({ id: track.trackId }).from(track).where(eq(track.albumId, id));

  await Promise.all([
    db.delete(invoiceLine).where(inArray(invoiceLine.trackId, trackIds)),
    db.delete(playlistTrack).where(inArray(playlistTrack.trackId, trackIds)),
  ]);
  await db.delete(track).where(eq(track.albumId, id));
  await db.delete(album).where(eq(album.albumId, id));

  revalidatePath("/albums");
  return { success: true };
}
