import {
  getStudentPhotoFromAspirantes,
  getStudentPhotoFromDB,
  SqliteService,
} from './database'
import { PhotoService } from './services'
import { Io } from './utils'

enum Options {
  DownloadPhotoList = 'list',
  DownloadPhotoDB = 'db',
  UploadPhotoList = 'up',
}

const downloadPhotoList = async () => {
  const photoService = new PhotoService()
  const months: string[] = Io.readInputFile('months')

  for (const month of months) {
    await photoService.savePhotosByMonth(month)
  }
}

const downloadPhotoDB = async () => {
  const photoService = new PhotoService()
  const months: string[] = Io.readInputFile('months')
  const sqliteService = new SqliteService()

  for (const month of months) {
    const students = await photoService.getPhotosByMonth(month)
    for (const student of students) {
      const photo = await getStudentPhotoFromAspirantes(student.id)
      sqliteService.insertPhoto(student.id, month, photo)
    }
  }
}

const main = async () => {
  const option: Options = process.argv[2] as Options

  if (!option) {
    console.log('Option is required')
    return
  }

  switch (option) {
    case Options.DownloadPhotoList:
      await downloadPhotoList()
      return

    case Options.DownloadPhotoDB:
      await downloadPhotoDB()
      return

    case Options.UploadPhotoList:
      return
  }
}

main()
