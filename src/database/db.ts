import { config, connect, Request } from 'mssql'

interface ConnectionModel {
  Escolares: config
  Aspirantes: config
  Default: config
}

const connections: ConnectionModel = {
  Escolares: {
    user: 'app_SDA',
    password: '@Pp$D@',
    server: 'datos.finanzas.uaslp.mx',
    database: 'Escolares',
    port: 2326,
  },
  Aspirantes: {
    user: 'app_user_w',
    password: 'AppUser7W#',
    server: '148.224.252.254',
    database: 'Preinscripcion',
  },
  Default: {
    user: '',
    password: '',
    server: '',
    database: '',
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
    connectionTimeout: 600000,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  },
}

export const selectEscolares = async <T>(query: string): Promise<T> => {
  return select(query, connections.Escolares)
}

export const selectAspirantes = async <T>(query: string): Promise<T> => {
  return select(query, connections.Aspirantes)
}

const select = async (query: string, config: config): Promise<any> => {
  try {
    await connect({
      ...connections.Default,
      ...config,
    })
    const request = new Request()
    const result = await request.query(query)
    return result.recordset
  } catch (error) {
    console.log(error)
  }
}
