import { getArtists } from "./actions";
import { ArtistForm } from "./artist-form";
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

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const artists = await getArtists(search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Artists</h1>
        <ArtistForm />
      </div>

      <form className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Search artists..."
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
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Albums</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No artists found.
                </TableCell>
              </TableRow>
            ) : (
              artists.map((a) => (
                <TableRow key={a.artistId}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell>{a.albumCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <ArtistForm
                        artist={{ artistId: a.artistId, name: a.name }}
                      />
                      <DeleteButton artistId={a.artistId} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        {artists.length} artist{artists.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
