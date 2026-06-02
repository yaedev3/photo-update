import { PhotoService } from './services/photo'
import { Io } from './utils'

const main = async () => {
  const photoService = new PhotoService()

  const months: string[] = Io.readInputFile('months')

  for (const month of months) {
    await photoService.getPhotosByMounth(month)
  }
}

main()
