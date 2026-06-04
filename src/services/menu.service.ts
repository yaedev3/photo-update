import { Io } from '../utils'
import {
  DbSource,
  getStudentPhotoFromAspirantes,
  getStudentPhotoFromDB,
  SqliteService,
  updatePhotoToAspirantes,
} from '../database'
import { PhotoService } from '.'
import { Student } from '../interfaces'

export enum MenuOptions {
  DownloadPhotoList = 'list',
  DownloadPhotoEscolares = 'es',
  DownloadPhotoAspirantes = 'as',
  UploadPhotoList = 'up',
}

const options: Record<MenuOptions, string> = {
  [MenuOptions.DownloadPhotoAspirantes]:
    'Para descargar las fotos de los aspirantes',
  [MenuOptions.DownloadPhotoEscolares]:
    'Para descargar las fotos revisadas de los aspirantes',
  [MenuOptions.DownloadPhotoList]: 'Para descargar el listado de fotos por mes',
  [MenuOptions.UploadPhotoList]:
    'Para subir las fotos revisadas al servidor de aspirantes',
}

export class MenuService {
  private photoService = new PhotoService()

  constructor() {}

  public async downloadPhotoList(): Promise<void> {
    const months: string[] = this.getMonthList()
    for (const month of months) {
      await this.photoService.savePhotosByMonth(month)
    }
  }

  public async downloadPhotosFromDb(source: DbSource): Promise<void> {
    const months: string[] = this.getMonthList()
    const sqliteService = new SqliteService(source)
    const getPohotoFrom = this.getDbSource(source)

    for (const month of months) {
      const students: Student[] =
        await this.photoService.getPhotosByMonth(month)
      const downloadStatus: boolean[] = []
      const canSkipped = sqliteService.isMonthCompleted(month, students.length)

      if (!canSkipped) {
        for (const student of students) {
          const photo = await getPohotoFrom(student.id)
          const status = sqliteService.insertPhoto(student.id, month, photo)
          downloadStatus.push(status)
        }
      }

      this.printStatusSummary(downloadStatus, month)
    }
  }

  private printStatusSummary(downloadStatus: boolean[], month: string): void {
    const success: number = downloadStatus.filter((s) => s).length
    const error: number = downloadStatus.filter((s) => s).length
    const total: number = downloadStatus.length

    console.log(`Resumen del mes ${month}`)
    console.log(`Alumnos insertados ${success}`)
    console.log(`Alumnos que no se pudieron insertar ${error}`)
    console.log(`Total de alumnos ${total}`)
  }

  public printMenuOptions(): void {
    const keys = Object.values(MenuOptions)
    console.log('Valid options:')
    keys.forEach((key) => {
      console.log(`[${key}] - ${options[key]}`)
    })
  }

  public async updatePhotos(): Promise<void> {
    const months: string[] = this.getMonthList()
    const sqliteService = new SqliteService(DbSource.Escolares)

    for (const month of months) {
      const students: string[] = sqliteService.getStudentsByMonth(month)
      // const students: string[] = this.getTestSTudents()
      for (const student of students) {
        console.log(`Actualizando foto para ${student}`)
        const photo = sqliteService.getStudentPhoto(student)
        await updatePhotoToAspirantes(student, photo)
      }
      return
    }
  }

  private getTestSTudents(): string[] {
    return ['338089', '316507']
  }

  private getMonthList(): string[] {
    return Io.readInputFile('months')
  }

  private getDbSource(source: DbSource) {
    if (source === DbSource.Aspirantes) return getStudentPhotoFromAspirantes
    else return getStudentPhotoFromDB
  }
}
