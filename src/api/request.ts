import axios from 'axios'

const baseUrl = 'https://sescolares.uaslp.mx/WSAPIEscolares/api'

const getFullUrl = (url: string): string => `${baseUrl}/${url}`

const get = async <T>(url: string): Promise<T> => {
  const fullUrl = getFullUrl(url)
  const response = await axios.get(fullUrl)
  return response.data
}

export default {
  get,
}
