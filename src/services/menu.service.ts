import { Io } from '../utils'
import {
  DbSource,
  getStudentPhotoFromAspirantes,
  getStudentPhotoFromDB,
  MonthSummary,
  SqliteService,
  updatePhotoToAspirantes,
} from '../database'
import { FileService, PhotoService } from '.'
import { Student } from '../interfaces'

export enum MenuOptions {
  DownloadPhotoList = 'list',
  DownloadPhotoEscolares = 'es',
  DownloadPhotoAspirantes = 'as',
  UploadPhotoList = 'up',
  Summary = 'sum',
  Inconsistency = 'inc',
  Check = 'com',
}

const options: Record<MenuOptions, string> = {
  [MenuOptions.DownloadPhotoAspirantes]:
    'Para descargar las fotos de los aspirantes',
  [MenuOptions.DownloadPhotoEscolares]:
    'Para descargar las fotos revisadas de los aspirantes',
  [MenuOptions.DownloadPhotoList]: 'Para descargar el listado de fotos por mes',
  [MenuOptions.UploadPhotoList]:
    'Para subir las fotos revisadas al servidor de aspirantes',
  [MenuOptions.Summary]: 'Resumen de fotos por en las bases de datos locales',
  [MenuOptions.Inconsistency]:
    'Revisa las inconsistencias de meses de los alumnos',
  [MenuOptions.Check]:
    'Descarga fotos para revisar que la actualizacion de fotos fue hecha sin problemas',
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
    const getPhotoFrom = this.getDbSource(source)

    for (const month of months) {
      const students: Student[] =
        await this.photoService.getPhotosByMonth(month)
      const downloadStatus: boolean[] = []
      const canSkipped = sqliteService.isMonthCompleted(month, students.length)

      if (!canSkipped) {
        for (const student of students) {
          const photo = await getPhotoFrom(student.id)
          const status = sqliteService.insertPhoto(student.id, month, photo)
          downloadStatus.push(status)
        }
      }

      this.printStatusSummary(downloadStatus, month)
    }
  }

  private printStatusSummary(downloadStatus: boolean[], month: string): void {
    const success: number = downloadStatus.filter((s) => s).length
    const error: number = downloadStatus.filter((s) => !s).length
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
    const doneList: string[] = this.getPhotosDone()

    for (const month of months) {
      const students: string[] = sqliteService.getStudentsByMonth(month)
      const lessStudents: string[] = students.filter(
        (s) => !doneList.includes(s),
      )
      console.log(`Aspirantes ${students.length}`)
      console.log(`Aspirantes por actualizar ${lessStudents.length}`)

      for (const student of lessStudents) {
        console.log(`Actualizando foto para ${student}`)

        const photo = sqliteService.getStudentPhoto(student)
        const wasUpdated = await updatePhotoToAspirantes(student, photo)

        if (wasUpdated) {
          doneList.push(student)
          this.writeDone(doneList)
        }
      }
    }
  }

  public printSummary(): void {
    this.printSummaryBySource(DbSource.Aspirantes)
    this.printSummaryBySource(DbSource.Escolares)
  }

  public async checkInconsistency(): Promise<void> {
    const months: string[] = this.getMonthList()
    const photoService = new PhotoService()
    let students: string[] = []

    for (const month of months) {
      const data: Student[] = await photoService.getPhotosByMonth(month)

      for (const student of data) {
        if (students.includes(student.id)) {
          console.log(`Aspirante ${student.id} con error en el mes ${month}`)
        } else {
          students.push(student.id)
        }
      }
    }

    console.log(`Total de aspirantes ${students.length}`)
  }

  private printSummaryBySource(source: DbSource): void {
    const sqliteService = new SqliteService(source)
    const summary: MonthSummary[] = sqliteService.getSummary()
    const total: number = summary.reduce((prev, curr) => prev + curr.total, 0)
    console.log(`Fuente ${source}`)
    summary.forEach((sum) => console.log(`Mes ${sum.month} : ${sum.total}`))
    console.log(`Total : ${total}`)
  }

  public async downloadPhotosToCheck() {
    const months: string[] = this.getMonthList()
    const fileService = new FileService()

    for (const month of months) {
      const photos: Student[] = await this.photoService.getPhotosByMonth(month)
      const tests: string[] = this.getTestStudents(photos, 100)
      fileService.setMonth(month)

      console.log(`Mes ${month}`)
      console.log(`Cantidad de aspirantes ${photos.length}`)
      console.log(`Cantidad de aspirantes de prueba ${tests.length}`)

      await fileService.storePhotos(tests)
    }
  }

  private getTestStudents(array: Student[], interval: number) {
    return array
      .filter((_, index) => index % interval === 0)
      .map((element) => element.id)
  }

  private getMonthList(): string[] {
    return Io.readInputFile('months')
  }

  private getPhotosDone(): string[] {
    return Io.readInputFile('done')
  }

  private writeDone(done: string[]): void {
    Io.writeInputFile('done', done.join('\n'))
  }

  private getDbSource(source: DbSource) {
    if (source === DbSource.Aspirantes) return getStudentPhotoFromAspirantes
    else return getStudentPhotoFromDB
  }
}
