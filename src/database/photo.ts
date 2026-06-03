import { DB_QUERIES } from './query'

export const getStudentPhotoFromDB = (id: string) => {
  const query = DB_QUERIES.StudentPhoto(id)
  console.log(query)
}
