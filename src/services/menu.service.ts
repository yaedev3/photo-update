import { Io } from '../utils'
import {
  DbSource,
  getStudentPhotoFromAspirantes,
  getStudentPhotoFromDB,
  SqliteService,
} from '../database'
import { PhotoService } from '.'

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
    for (const month of months) {
      const students = await this.photoService.getPhotosByMonth(month)

      for (const student of students) {
        const getPohotoFrom = this.getDbSource(source)
        const photo = await getPohotoFrom(student.id)
        sqliteService.insertPhoto(student.id, month, photo)
      }
    }
  }

  public printMenuOptions(): void {
    const keys = Object.values(MenuOptions)
    console.log('Valid options:')
    keys.forEach((key) => {
      console.log(`[${key}] - ${options[key]}`)
    })
  }

  private getMonthList(): string[] {
    return Io.readInputFile('months')
  }

  private getDbSource(source: DbSource) {
    if (source === DbSource.Aspirantes) return getStudentPhotoFromAspirantes
    else return getStudentPhotoFromDB
  }
}
