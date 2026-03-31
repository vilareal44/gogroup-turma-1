import { getPlaylists } from "./actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function PlaylistsPage() {
  const playlists = await getPlaylists();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Playlists</h1>
        <p className="text-muted-foreground">
          All playlists in the catalog ({playlists.length} total)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Playlists</CardTitle>
          <CardDescription>Playlists and their track counts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Tracks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playlists.map((pl) => (
                <TableRow key={pl.playlistId}>
                  <TableCell className="font-medium">{pl.name}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{pl.trackCount}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
