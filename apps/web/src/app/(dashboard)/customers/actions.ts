"use server";

import { db } from "@/lib/db";
import { customer, employee } from "@chinook/db/schema";
import { eq, or, like, asc, sql } from "drizzle-orm";

export async function getCustomers(search?: string) {
  const results = await db
    .select({
      customerId: customer.customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      company: customer.company,
      city: customer.city,
      country: customer.country,
      supportRep:
        sql<string>`${employee.firstName} || ' ' || ${employee.lastName}`,
    })
    .from(customer)
    .leftJoin(employee, eq(customer.supportRepId, employee.employeeId))
    .where(
      search
        ? or(
            like(customer.firstName, `%${search}%`),
            like(customer.lastName, `%${search}%`),
            like(customer.email, `%${search}%`)
          )
        : undefined
    )
    .orderBy(asc(customer.lastName));

  return results;
}
