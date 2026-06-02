import { Photo } from './utils'

const main = async () => {
  const months = [1, 2, 3, 4, 5, 6]
  const photos = await Photo.getPhotosByMounth(6)
  console.log(photos.length)
}

main()
