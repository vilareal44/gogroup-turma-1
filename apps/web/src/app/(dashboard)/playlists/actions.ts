"use server";

import { db } from "@/lib/db";
import { playlist, playlistTrack } from "@chinook/db/schema";
import { eq, asc, count } from "drizzle-orm";

export async function getPlaylists() {
  return db
    .select({
      playlistId: playlist.playlistId,
      name: playlist.name,
      trackCount: count(playlistTrack.trackId),
    })
    .from(playlist)
    .leftJoin(playlistTrack, eq(playlist.playlistId, playlistTrack.playlistId))
    .groupBy(playlist.playlistId, playlist.name)
    .orderBy(asc(playlist.name));
}
