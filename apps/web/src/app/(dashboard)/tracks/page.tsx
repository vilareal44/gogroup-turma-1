import Link from "next/link";
import { getTracks } from "./actions";
import { formatDuration, formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function TracksPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search, page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  const { data: tracks, total } = await getTracks(search, page);

  const totalPages = Math.ceil(total / 50);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tracks</h1>
      </div>

      <form className="flex items-center gap-2">
        <Input
          name="search"
          placeholder="Search tracks..."
          defaultValue={search ?? ""}
          className="max-w-sm"
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
        {search && (
          <Link href="/tracks" className="text-sm text-muted-foreground hover:underline">
            Clear
          </Link>
        )}
      </form>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Album</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tracks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No tracks found.
                </TableCell>
              </TableRow>
            ) : (
              tracks.map((t) => (
                <TableRow key={t.trackId}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{t.albumTitle ?? "—"}</TableCell>
                  <TableCell>{t.artistName ?? "—"}</TableCell>
                  <TableCell>{t.genreName ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    {formatDuration(t.milliseconds)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(t.unitPrice)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {tracks.length} of {total} tracks
        </p>
        <div className="flex items-center gap-2">
          {page > 1 ? (
            <Link
              href={{
                pathname: "/tracks",
                query: { ...(search ? { search } : {}), page: String(page - 1) },
              }}
            >
              <Button variant="outline" size="sm">Previous</Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>Previous</Button>
          )}
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={{
                pathname: "/tracks",
                query: { ...(search ? { search } : {}), page: String(page + 1) },
              }}
            >
              <Button variant="outline" size="sm">Next</Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>Next</Button>
          )}
        </div>
      </div>
    </div>
  );
}
