import Database from 'better-sqlite3'
import { DbSource } from './interfaces'

const QUERIES = {
  init: `
  CREATE TABLE IF NOT EXISTS Photo (
      id TEXT,
      month TEXT, 
      picture BLOB
  );
  `,
  insert: `
    INSERT INTO Photo (id, month, picture) VALUES (?, ?, ?)
  `,
  exists: `
    SELECT * fROM Photo
    WHERE id = ?
  `,
}

export class SqliteService {
  private db

  constructor(source: DbSource) {
    const path = this.getDBPath(source)
    this.db = new SqliteDatabase(path, this.getInitQueries())
  }

  public insertPhoto(id: string, month: string, photo: any) {
    if (this.existsPhoto(id)) {
      console.log(`El alumno ${id} ya existe`)
      return
    }
    this.insertPhotoProtected(id, month, photo)
  }

  private getDBPath(source: DbSource): string {
    if (source === DbSource.Aspirantes) return 'data/photos_aspirantes.db'
    return 'data/photos_escolares.db'
  }

  private insertPhotoProtected(id: string, month: string, photo: any) {
    try {
      const query = QUERIES.insert
      this.db.insert(query, [id, month, photo])
    } catch (error: any) {
      console.log(error)
      console.log(`Error al insertar al alumno ${id}`)
    }
  }

  private existsPhoto(id: string) {
    const query = QUERIES.exists
    const data: any[] = this.db.where(query, [id])
    return data.length > 0
  }

  private getInitQueries(): string[] {
    return [QUERIES.init]
  }
}

class SqliteDatabase {
  private db

  constructor(name: string, queries: string[]) {
    this.db = new Database(name)
    this.initDatabase(queries)
  }

  public insert(query: string, data: string[]): void {
    this.db.prepare(query).run(...data)
  }

  public select<T>(query: string): T[] {
    return []
  }

  public where<T>(query: string, filter: string[]): T[] {
    return <T[]>this.db.prepare(query).all(...filter)
  }

  private initDatabase(queries: string[]): void {
    queries.forEach((query) => {
      this.db.exec(query)
    })
  }
}
