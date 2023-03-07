import { DbInterface } from "./db.ts";

const rowToItem = (row: [string, string]): Item => {
  return {
    key: row[0],
    value: row[1]
  };
};

export type Item = {
  key: string;
  value: string;
}

export class Storage {
  storage: DbInterface;
  constructor(storage: DbInterface) {
    this.storage = storage;
  }

  findByKey(key: string): Item | null {
    const result = this.storage.db.query<[string, string]>(`SELECT * FROM keys WHERE key = ?;`, [key]);
    if (result.length === 0) {
      return null;
    }
    return rowToItem(result[0]);
  }

  findAll(): Item[] {
    const result = this.storage.db.query<[string, string]>(`SELECT * FROM keys;`);
    return result.map(rowToItem);
  }

  saveKey(key: string, value: string): void {
    this.storage.db.query(`INSERT INTO keys (key, value) VALUES (?, ?);`, [key, value]);
  }

  replaceKey(key: string, value: string): void {
    this.storage.db.query(`REPLACE INTO keys (key, value) VALUES(?, ?);`, [key, value]);
  }


  deleteByKey(key: string): void {
    this.storage.db.query(`DELETE FROM keys WHERE key = ?;`, [key]);
  }

  deleteAll(): void {
    this.storage.db.query(`DELETE FROM keys;`);
  }
}
