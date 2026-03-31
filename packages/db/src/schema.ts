import {
  pgTable,
  integer,
  varchar,
  numeric,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Artist ───────────────────────────────────────────────
export const artist = pgTable("Artist", {
  artistId: integer("ArtistId").primaryKey(),
  name: varchar("Name", { length: 120 }),
});

export const artistRelations = relations(artist, ({ many }) => ({
  albums: many(album),
}));

// ─── Album ────────────────────────────────────────────────
export const album = pgTable("Album", {
  albumId: integer("AlbumId").primaryKey(),
  title: varchar("Title", { length: 160 }).notNull(),
  artistId: integer("ArtistId")
    .notNull()
    .references(() => artist.artistId),
});

export const albumRelations = relations(album, ({ one, many }) => ({
  artist: one(artist, {
    fields: [album.artistId],
    references: [artist.artistId],
  }),
  tracks: many(track),
}));

// ─── Genre ────────────────────────────────────────────────
export const genre = pgTable("Genre", {
  genreId: integer("GenreId").primaryKey(),
  name: varchar("Name", { length: 120 }),
});

export const genreRelations = relations(genre, ({ many }) => ({
  tracks: many(track),
}));

// ─── MediaType ────────────────────────────────────────────
export const mediaType = pgTable("MediaType", {
  mediaTypeId: integer("MediaTypeId").primaryKey(),
  name: varchar("Name", { length: 120 }),
});

export const mediaTypeRelations = relations(mediaType, ({ many }) => ({
  tracks: many(track),
}));

// ─── Track ────────────────────────────────────────────────
export const track = pgTable("Track", {
  trackId: integer("TrackId").primaryKey(),
  name: varchar("Name", { length: 200 }).notNull(),
  albumId: integer("AlbumId").references(() => album.albumId),
  mediaTypeId: integer("MediaTypeId")
    .notNull()
    .references(() => mediaType.mediaTypeId),
  genreId: integer("GenreId").references(() => genre.genreId),
  composer: varchar("Composer", { length: 220 }),
  milliseconds: integer("Milliseconds").notNull(),
  bytes: integer("Bytes"),
  unitPrice: numeric("UnitPrice", { precision: 10, scale: 2 }).notNull(),
});

export const trackRelations = relations(track, ({ one, many }) => ({
  album: one(album, {
    fields: [track.albumId],
    references: [album.albumId],
  }),
  genre: one(genre, {
    fields: [track.genreId],
    references: [genre.genreId],
  }),
  mediaType: one(mediaType, {
    fields: [track.mediaTypeId],
    references: [mediaType.mediaTypeId],
  }),
  invoiceLines: many(invoiceLine),
  playlistTracks: many(playlistTrack),
}));

// ─── Playlist ─────────────────────────────────────────────
export const playlist = pgTable("Playlist", {
  playlistId: integer("PlaylistId").primaryKey(),
  name: varchar("Name", { length: 120 }),
});

export const playlistRelations = relations(playlist, ({ many }) => ({
  playlistTracks: many(playlistTrack),
}));

// ─── PlaylistTrack ────────────────────────────────────────
export const playlistTrack = pgTable(
  "PlaylistTrack",
  {
    playlistId: integer("PlaylistId")
      .notNull()
      .references(() => playlist.playlistId),
    trackId: integer("TrackId")
      .notNull()
      .references(() => track.trackId),
  },
  (t) => [primaryKey({ columns: [t.playlistId, t.trackId] })]
);

export const playlistTrackRelations = relations(playlistTrack, ({ one }) => ({
  playlist: one(playlist, {
    fields: [playlistTrack.playlistId],
    references: [playlist.playlistId],
  }),
  track: one(track, {
    fields: [playlistTrack.trackId],
    references: [track.trackId],
  }),
}));

// ─── Employee ─────────────────────────────────────────────
export const employee = pgTable("Employee", {
  employeeId: integer("EmployeeId").primaryKey(),
  lastName: varchar("LastName", { length: 20 }).notNull(),
  firstName: varchar("FirstName", { length: 20 }).notNull(),
  title: varchar("Title", { length: 30 }),
  reportsTo: integer("ReportsTo"),
  birthDate: timestamp("BirthDate"),
  hireDate: timestamp("HireDate"),
  address: varchar("Address", { length: 70 }),
  city: varchar("City", { length: 40 }),
  state: varchar("State", { length: 40 }),
  country: varchar("Country", { length: 40 }),
  postalCode: varchar("PostalCode", { length: 10 }),
  phone: varchar("Phone", { length: 24 }),
  fax: varchar("Fax", { length: 24 }),
  email: varchar("Email", { length: 60 }),
});

export const employeeRelations = relations(employee, ({ one, many }) => ({
  manager: one(employee, {
    fields: [employee.reportsTo],
    references: [employee.employeeId],
    relationName: "manager",
  }),
  subordinates: many(employee, { relationName: "manager" }),
  customers: many(customer),
}));

// ─── Customer ─────────────────────────────────────────────
export const customer = pgTable("Customer", {
  customerId: integer("CustomerId").primaryKey(),
  firstName: varchar("FirstName", { length: 40 }).notNull(),
  lastName: varchar("LastName", { length: 20 }).notNull(),
  company: varchar("Company", { length: 80 }),
  address: varchar("Address", { length: 70 }),
  city: varchar("City", { length: 40 }),
  state: varchar("State", { length: 40 }),
  country: varchar("Country", { length: 40 }),
  postalCode: varchar("PostalCode", { length: 10 }),
  phone: varchar("Phone", { length: 24 }),
  fax: varchar("Fax", { length: 24 }),
  email: varchar("Email", { length: 60 }).notNull(),
  supportRepId: integer("SupportRepId").references(() => employee.employeeId),
});

export const customerRelations = relations(customer, ({ one, many }) => ({
  supportRep: one(employee, {
    fields: [customer.supportRepId],
    references: [employee.employeeId],
  }),
  invoices: many(invoice),
}));

// ─── Invoice ──────────────────────────────────────────────
export const invoice = pgTable("Invoice", {
  invoiceId: integer("InvoiceId").primaryKey(),
  customerId: integer("CustomerId")
    .notNull()
    .references(() => customer.customerId),
  invoiceDate: timestamp("InvoiceDate").notNull(),
  billingAddress: varchar("BillingAddress", { length: 70 }),
  billingCity: varchar("BillingCity", { length: 40 }),
  billingState: varchar("BillingState", { length: 40 }),
  billingCountry: varchar("BillingCountry", { length: 40 }),
  billingPostalCode: varchar("BillingPostalCode", { length: 10 }),
  total: numeric("Total", { precision: 10, scale: 2 }).notNull(),
});

export const invoiceRelations = relations(invoice, ({ one, many }) => ({
  customer: one(customer, {
    fields: [invoice.customerId],
    references: [customer.customerId],
  }),
  invoiceLines: many(invoiceLine),
}));

// ─── InvoiceLine ──────────────────────────────────────────
export const invoiceLine = pgTable("InvoiceLine", {
  invoiceLineId: integer("InvoiceLineId").primaryKey(),
  invoiceId: integer("InvoiceId")
    .notNull()
    .references(() => invoice.invoiceId),
  trackId: integer("TrackId")
    .notNull()
    .references(() => track.trackId),
  unitPrice: numeric("UnitPrice", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("Quantity").notNull(),
});

export const invoiceLineRelations = relations(invoiceLine, ({ one }) => ({
  invoice: one(invoice, {
    fields: [invoiceLine.invoiceId],
    references: [invoice.invoiceId],
  }),
  track: one(track, {
    fields: [invoiceLine.trackId],
    references: [track.trackId],
  }),
}));
