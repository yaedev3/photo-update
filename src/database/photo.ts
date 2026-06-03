import { selectAspirantes, selectEscolares } from './db'
import { DB_QUERIES } from './query'

export const getStudentPhotoFromDB = async (id: string) => {
  const query = DB_QUERIES.StudentPhotoEscolares(id)
  const result: any = await selectEscolares(query)
  return result[0]['']
}

export const getStudentPhotoFromAspirantes = async (id: string) => {
  const query = DB_QUERIES.StudentPhotoAspirantes(id)
  const result: any = await selectAspirantes(query)
  return result[0]['']
}
