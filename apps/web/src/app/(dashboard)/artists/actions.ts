"use server";

import { db } from "@/lib/db";
import { artist, album } from "@chinook/db/schema";
import { eq, like, sql, asc, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const artistSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(120, "Name must be 120 characters or less"),
});

export async function getArtists(search?: string) {
  const results = await db
    .select({
      artistId: artist.artistId,
      name: artist.name,
      albumCount: count(album.albumId),
    })
    .from(artist)
    .leftJoin(album, eq(artist.artistId, album.artistId))
    .where(search ? like(artist.name, `%${search}%`) : undefined)
    .groupBy(artist.artistId, artist.name)
    .orderBy(asc(artist.name));

  return results;
}

export async function getArtist(id: number) {
  const [foundArtist] = await db
    .select()
    .from(artist)
    .where(eq(artist.artistId, id));

  if (!foundArtist) return null;

  const albums = await db
    .select()
    .from(album)
    .where(eq(album.artistId, id))
    .orderBy(asc(album.title));

  return { ...foundArtist, albums };
}

export async function createArtist(formData: FormData) {
  const parsed = artistSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.name?.[0] ?? "Invalid input" };
  }

  const [maxId] = await db
    .select({ max: sql<number>`coalesce(max("ArtistId"), 0)` })
    .from(artist);

  await db.insert(artist).values({
    artistId: maxId.max + 1,
    name: parsed.data.name,
  });

  revalidatePath("/artists");
  return { success: true };
}

export async function updateArtist(formData: FormData) {
  const id = Number(formData.get("artistId"));

  if (!id || isNaN(id)) {
    return { error: "Invalid artist ID" };
  }

  const parsed = artistSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.name?.[0] ?? "Invalid input" };
  }

  await db
    .update(artist)
    .set({ name: parsed.data.name })
    .where(eq(artist.artistId, id));

  revalidatePath("/artists");
  return { success: true };
}

export async function deleteArtist(id: number) {
  await db.delete(album).where(eq(album.artistId, id));
  await db.delete(artist).where(eq(artist.artistId, id));

  revalidatePath("/artists");
  return { success: true };
}
