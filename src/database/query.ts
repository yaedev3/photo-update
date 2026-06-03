export const DB_QUERIES = {
  StudentPhotoEscolares: (id: string) =>
    `SELECT EstadisticasSE.FotografiaAspirante('${id.padStart(7, '0')}')`,
  StudentPhotoAspirantes: (id: string) =>
    `SELECT EstadisticasSE.FotografiaAspirante('${id}')`,
}
