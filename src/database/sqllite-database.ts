import Database from 'better-sqlite3'

export class SqliteDatabase {
  private db

  constructor(name: string, queries: string[]) {
    this.db = new Database(name)
    this.initDatabase(queries)
  }

  public insert(query: string, data: string[]): void {
    this.db.prepare(query).run(...data)
  }

  public where<T>(query: string, filter: string[]): T[] {
    return <T[]>this.db.prepare(query).all(...filter)
  }

  public blob(query: string, id: string): Buffer | null {
    const row = this.db.prepare(query).get(id)
    if (!row) return null
    return Object.values(row)[0] as Buffer
  }

  private initDatabase(queries: string[]): void {
    queries.forEach((query) => {
      this.db.exec(query)
    })
  }
}
