import { Hono } from "hono";
import { db } from "./db";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as schema from "./schema";

migrate(db, { migrationsFolder: "drizzle" });

const app = new Hono();

app.get("/", (c) => {
  const query = sql`select "hello world" as text`;
  const result = db.get<{ text: string }>(query);
  return c.json(result);
});

app.get("/insert", async (c) => {
  await db.insert(schema.movies).values([
    {
      title: "The Matrix",
      releaseYear: 1999,
    },
    {
      title: "The Matrix Reloaded",
      releaseYear: 2003,
    },
    {
      title: "The Matrix Revolutions",
      releaseYear: 2003,
    },
  ]);
  return c.text("ok");
});

app.get("/list", async (c) => {
  const result = await db.select().from(schema.movies);
  return c.json(result);
});

export default app;
