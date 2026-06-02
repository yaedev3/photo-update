import { Request, API_URLS } from '../api'
import { PhotoStatus, Student } from '../interfaces/student'

const getPhotosByMounth = async (month: number): Promise<Student[]> => {
  const url: string = `${API_URLS.PhotoByMonth}/${month}`
  const photos: Student[] = await Request.get<Student[]>(url)
  console.log(photos.length)
  return await photos.filter((photo) => photo.status === PhotoStatus.Done)
}

export default {
  getPhotosByMounth,
}
