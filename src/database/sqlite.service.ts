import { DbSource } from './interfaces'
import { SqliteDatabase } from './sqllite-database'

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
  students: `
    SELECT 
    id
    FROM Photo
    WHERE month = ?
  `,
  photo: `
    SELECT 
    picture
    FROM Photo
    WHERE id = ?
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
    const query = QUERIES.students
    const data: any[] = this.db.where(query, [month])
    return data.map((d) => d.id)
  }

  public getStudentPhoto(id: string) {
    const query = QUERIES.photo
    const data = this.db.blob(query, id)
    return data
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
