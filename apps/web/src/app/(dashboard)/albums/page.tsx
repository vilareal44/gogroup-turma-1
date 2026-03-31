import { getAlbums } from "./actions";
import { getArtists } from "../artists/actions";
import { AlbumForm } from "./album-form";
import { DeleteButton } from "./delete-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchIcon } from "lucide-react";

export default async function AlbumsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const [albums, artists] = await Promise.all([
    getAlbums(search),
    getArtists(),
  ]);

  const artistOptions = artists.map((a) => ({
    artistId: a.artistId,
    name: a.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Albums</h1>
        <AlbumForm artists={artistOptions} />
      </div>

      <form className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Search albums..."
            defaultValue={search ?? ""}
            className="pl-8"
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {albums.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No albums found.
                </TableCell>
              </TableRow>
            ) : (
              albums.map((a) => (
                <TableRow key={a.albumId}>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell>{a.artistName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <AlbumForm
                        album={{
                          albumId: a.albumId,
                          title: a.title,
                          artistId: a.artistId,
                        }}
                        artists={artistOptions}
                      />
                      <DeleteButton albumId={a.albumId} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        {albums.length} album{albums.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
