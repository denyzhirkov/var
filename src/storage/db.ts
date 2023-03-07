import { DB } from "https://deno.land/x/sqlite/mod.ts";

const dbPathDefault = "./db.sqlite";

export interface DbInterface {
  db: DB;
  close(): void;
}

export class Db implements DbInterface {
  db!: DB;

  private init() {
    try {
      this.db.execute(`
      CREATE TABLE IF NOT EXISTS keys (
        key TEXT PRIMARY KEY,
        value TEXT
      )`);
    } catch (error) {
      Deno.stdout.writeSync(new TextEncoder().encode(error.message));
      Deno.exit(5);
    } 
  }

  constructor(dbPath: string = dbPathDefault) {
    try {
      this.db = new DB(dbPath);
      this.init();
    } catch (error) {
      Deno.stdout.writeSync(new TextEncoder().encode(error.message));
      Deno.exit(5);
    }
  }

  close() {
    this.db.close();
  }
}
