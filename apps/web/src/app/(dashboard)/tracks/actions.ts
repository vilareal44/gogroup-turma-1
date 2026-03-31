"use server";

import { db } from "@/lib/db";
import { track, album, artist, genre, mediaType } from "@chinook/db/schema";
import { eq, like, asc, sql, count } from "drizzle-orm";

const PAGE_SIZE = 50;

export async function getTracks(search?: string, page?: number) {
  const offset = ((page ?? 1) - 1) * PAGE_SIZE;

  const whereClause = search ? like(track.name, `%${search}%`) : undefined;

  const [totalResult] = await db
    .select({ count: count() })
    .from(track)
    .where(whereClause);

  const data = await db
    .select({
      trackId: track.trackId,
      name: track.name,
      composer: track.composer,
      milliseconds: track.milliseconds,
      unitPrice: track.unitPrice,
      albumTitle: album.title,
      artistName: artist.name,
      genreName: genre.name,
    })
    .from(track)
    .leftJoin(album, eq(track.albumId, album.albumId))
    .leftJoin(artist, eq(album.artistId, artist.artistId))
    .leftJoin(genre, eq(track.genreId, genre.genreId))
    .where(whereClause)
    .orderBy(asc(track.name))
    .limit(PAGE_SIZE)
    .offset(offset);

  return { data, total: totalResult.count };
}

export async function getTrack(id: number) {
  const [result] = await db
    .select({
      trackId: track.trackId,
      name: track.name,
      composer: track.composer,
      milliseconds: track.milliseconds,
      bytes: track.bytes,
      unitPrice: track.unitPrice,
      albumTitle: album.title,
      artistName: artist.name,
      genreName: genre.name,
      mediaTypeName: mediaType.name,
    })
    .from(track)
    .leftJoin(album, eq(track.albumId, album.albumId))
    .leftJoin(artist, eq(album.artistId, artist.artistId))
    .leftJoin(genre, eq(track.genreId, genre.genreId))
    .leftJoin(mediaType, eq(track.mediaTypeId, mediaType.mediaTypeId))
    .where(eq(track.trackId, id));

  return result ?? null;
}

export async function getGenres() {
  return db.select().from(genre).orderBy(asc(genre.name));
}

export async function getMediaTypes() {
  return db.select().from(mediaType).orderBy(asc(mediaType.name));
}
