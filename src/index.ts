import { PhotoService } from './services/photo'
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
    const photos = await photoService.getPhotosByMonth(month)
    const photo = photos[0]
    console.log('photos')
    console.log(photos.length)
    console.log(photo)

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
