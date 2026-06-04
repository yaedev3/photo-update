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
    SELECT 
    * 
    FROM Photo
    WHERE id = ?
  `,
  count: `
    SELECT 
    id
    FROM Photo
    WHERE month = ?
  `,
}

export class SqliteService {
  private db

  constructor(source: DbSource) {
    const path = this.getDBPath(source)
    this.db = new SqliteDatabase(path, this.getInitQueries())
  }

  public insertPhoto(id: string, month: string, photo: any): boolean {
    if (this.existsPhoto(id)) return false
    this.insertPhotoProtected(id, month, photo)
    return true
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

  public isMonthCompleted(month: string, studentsCount: number): boolean {
    const photosInDB: number = this.getStudentsByMonth(month).length
    return photosInDB === studentsCount
  }

  public getStudentsByMonth(month: string): string[] {
    const query = QUERIES.count
    const data: any[] = this.db.where(query, [month])
    return data.map((d) => d.id)
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
