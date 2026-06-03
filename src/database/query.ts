export const DB_QUERIES = {
  StudentPhoto: (id: string) =>
    `SELECT EstadisticasSE.FotografiaAspirante('${id.padStart(7, '0')}')`,
}
