import { getStudentPhotoFromDB } from './database'
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

  for (const month of months) {
    const students = await photoService.getPhotosByMonth(month)
    const student = students[0]
    console.log('photos')
    console.log(students.length)
    console.log(student)
    getStudentPhotoFromDB(student.id)

    return
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
