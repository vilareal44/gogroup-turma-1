"use server";

import { db } from "@/lib/db";
import { invoice, customer } from "@chinook/db/schema";
import { eq, or, like, desc, sql } from "drizzle-orm";

export async function getInvoices(search?: string) {
  const results = await db
    .select({
      invoiceId: invoice.invoiceId,
      invoiceDate: invoice.invoiceDate,
      billingCity: invoice.billingCity,
      billingCountry: invoice.billingCountry,
      total: invoice.total,
      customerName:
        sql<string>`${customer.firstName} || ' ' || ${customer.lastName}`,
      customerEmail: customer.email,
    })
    .from(invoice)
    .innerJoin(customer, eq(invoice.customerId, customer.customerId))
    .where(
      search
        ? or(
            like(customer.firstName, `%${search}%`),
            like(customer.lastName, `%${search}%`)
          )
        : undefined
    )
    .orderBy(desc(invoice.invoiceDate));

  return results;
}
