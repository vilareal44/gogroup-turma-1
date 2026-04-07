import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { invoice, invoiceLine, track, customer } from "@chinook/db/schema";
import { eq, and, gte, lt, desc, sql, sum, count } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // ── Auth guard ───────────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // ── Calcula "ontem" no fuso BRT ──────────────────────────
  const now = new Date();
  const brt = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );
  const offsetMs = brt.getTime() - now.getTime();

  const yesterdayStart = new Date(brt);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  yesterdayStart.setHours(0, 0, 0, 0);

  const yesterdayEnd = new Date(yesterdayStart);
  yesterdayEnd.setDate(yesterdayEnd.getDate() + 1);

  // Converte de volta para UTC para a query no banco
  const startUtc = new Date(yesterdayStart.getTime() - offsetMs);
  const endUtc = new Date(yesterdayEnd.getTime() - offsetMs);

  try {
    // ── Queries ──────────────────────────────────────────────

    // Resumo: receita total + contagem de invoices
    const [summary] = await db
      .select({
        totalRevenue: sum(invoice.total),
        invoiceCount: count(invoice.invoiceId),
      })
      .from(invoice)
      .where(
        and(gte(invoice.invoiceDate, startUtc), lt(invoice.invoiceDate, endUtc))
      );

    // Top 5 tracks por quantidade vendida
    const topTracks = await db
      .select({
        trackName: track.name,
        totalQuantity: sum(invoiceLine.quantity),
      })
      .from(invoiceLine)
      .innerJoin(invoice, eq(invoiceLine.invoiceId, invoice.invoiceId))
      .innerJoin(track, eq(invoiceLine.trackId, track.trackId))
      .where(
        and(gte(invoice.invoiceDate, startUtc), lt(invoice.invoiceDate, endUtc))
      )
      .groupBy(track.trackId, track.name)
      .orderBy(desc(sum(invoiceLine.quantity)))
      .limit(5);

    // Top 5 clientes por gasto
    const topCustomers = await db
      .select({
        customerName:
          sql<string>`${customer.firstName} || ' ' || ${customer.lastName}`,
        totalSpent: sum(invoice.total),
      })
      .from(invoice)
      .innerJoin(customer, eq(invoice.customerId, customer.customerId))
      .where(
        and(gte(invoice.invoiceDate, startUtc), lt(invoice.invoiceDate, endUtc))
      )
      .groupBy(customer.customerId, customer.firstName, customer.lastName)
      .orderBy(desc(sum(invoice.total)))
      .limit(5);

    // Top 5 países por receita
    const topCountries = await db
      .select({
        country: invoice.billingCountry,
        totalRevenue: sum(invoice.total),
      })
      .from(invoice)
      .where(
        and(gte(invoice.invoiceDate, startUtc), lt(invoice.invoiceDate, endUtc))
      )
      .groupBy(invoice.billingCountry)
      .orderBy(desc(sum(invoice.total)))
      .limit(5);

    // ── Formata mensagem Slack ──────────────────────────────
    const dateStr = yesterdayStart.toLocaleDateString("pt-BR");
    const revenue = Number(summary.totalRevenue ?? 0).toFixed(2);
    const invCount = summary.invoiceCount ?? 0;

    const tracksSection =
      topTracks.length > 0
        ? topTracks
            .map(
              (t, i) => `  ${i + 1}. ${t.trackName} (${t.totalQuantity} vendidas)`
            )
            .join("\n")
        : "  Sem vendas de tracks";

    const customersSection =
      topCustomers.length > 0
        ? topCustomers
            .map(
              (c, i) =>
                `  ${i + 1}. ${c.customerName} ($${Number(c.totalSpent).toFixed(2)})`
            )
            .join("\n")
        : "  Sem compras de clientes";

    const countriesSection =
      topCountries.length > 0
        ? topCountries
            .map(
              (c, i) =>
                `  ${i + 1}. ${c.country} ($${Number(c.totalRevenue).toFixed(2)})`
            )
            .join("\n")
        : "  Sem dados por país";

    const message = [
      `:chart_with_upwards_trend: *Relatório Diário de Vendas — ${dateStr}*`,
      "",
      `*Receita:* $${revenue}`,
      `*Invoices:* ${invCount}`,
      "",
      "*Top Tracks:*",
      tracksSection,
      "",
      "*Top Clientes:*",
      customersSection,
      "",
      "*Top Países:*",
      countriesSection,
    ].join("\n");

    // ── Envia para Slack (ou log mock) ──────────────────────
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (webhookUrl) {
      const slackResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });

      if (!slackResponse.ok) {
        console.error(
          "Slack webhook falhou:",
          slackResponse.status,
          await slackResponse.text()
        );
      }
    } else {
      console.log("[Relatório Diário de Vendas — Mock Slack]");
      console.log(message);
    }

    // ── Response ────────────────────────────────────────────
    return NextResponse.json({
      ok: true,
      date: dateStr,
      revenue,
      invoiceCount: invCount,
      topTracks,
      topCustomers,
      topCountries,
    });
  } catch (error) {
    console.error("Falha no relatório diário de vendas:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
