import sql from 'mssql'

const CONNECTION_STRINGS = {
  Escolares:
    'data source=datos.finanzas.uaslp.mx,2326;initial catalog=s.escolares;user id=app_SDA;password=@Pp$D@;database=Escolares',
  Aspirantes:
    'data source=148.224.252.254;initial catalog=app_user_w;user id=app_user_w;password=AppUser7W#;database=Preinscripcion',
}

const pools = new Map<string, sql.ConnectionPool>()

const getConnection = async (
  connectionString: string,
): Promise<sql.ConnectionPool> => {
  if (pools.has(connectionString)) {
    return pools.get(connectionString)!
  }

  const pool = new sql.ConnectionPool(connectionString)
  await pool.connect()
  pools.set(connectionString, pool)
  return pool
}

export const getConnections = async () => {
  return {
    Escolares: await getConnection(CONNECTION_STRINGS.Escolares),
    Aspirantes: await getConnection(CONNECTION_STRINGS.Aspirantes),
  }
}
