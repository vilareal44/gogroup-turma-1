import { getInvoices } from "./actions";
import { formatCurrency } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const invoices = await getInvoices(search);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Invoices</h1>
        <p className="text-muted-foreground">
          Browse all invoices ({invoices.length} results)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>
            Search by customer name to filter results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="mb-4">
            <Input
              name="search"
              placeholder="Search by customer name..."
              defaultValue={search ?? ""}
              className="max-w-sm"
            />
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.invoiceId}>
                  <TableCell className="font-medium">
                    #{inv.invoiceId}
                  </TableCell>
                  <TableCell>
                    {new Date(inv.invoiceDate).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>{inv.customerName}</TableCell>
                  <TableCell>{inv.billingCity}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{inv.billingCountry}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(inv.total)}
                  </TableCell>
                </TableRow>
              ))}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
