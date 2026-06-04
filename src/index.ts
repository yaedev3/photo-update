import { DbSource } from './database'
import { MenuOptions, MenuService } from './services'

const main = async () => {
  const option: MenuOptions = process.argv[2] as MenuOptions
  const menuService = new MenuService()

  if (!option) {
    menuService.printMenuOptions()
    return
  }

  switch (option) {
    case MenuOptions.DownloadPhotoList:
      await menuService.downloadPhotoList()
      return

    case MenuOptions.DownloadPhotoAspirantes:
      await menuService.downloadPhotosFromDb(DbSource.Aspirantes)
      return

    case MenuOptions.DownloadPhotoEscolares:
      await menuService.downloadPhotosFromDb(DbSource.Escolares)
      return

    case MenuOptions.UploadPhotoList:
      await menuService.updatePhotos()
      return
  }
}

main()
