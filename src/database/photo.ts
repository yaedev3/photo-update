import { selectEscolares } from './db'
import { DB_QUERIES } from './query'

export const getStudentPhotoFromDB = async (id: string) => {
  const query = DB_QUERIES.StudentPhoto(id)
  console.log(query)
  const result = await selectEscolares(query)
  console.log(result)
}
