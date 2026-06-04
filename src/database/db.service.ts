import sql from 'mssql'
import { selectAspirantes, selectEscolares, updateBinaryAspirantes } from './db'
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

export const updatePhotoToAspirantes = async (id: string, photo: Buffer) => {
  const query = DB_QUERIES.StudenPhotoUpdate
  await updateBinaryAspirantes(query, id, photo)
}
