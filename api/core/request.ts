import axios, { type AxiosResponse } from 'axios'

// const config = useRuntimeConfig()
export const baseURL  = 'https://29548.wu.elitepro.ltd/api'
// export const baseURL  = config.public.apiBaseUrl ?? '/api/'

export const request = axios.create({ baseURL, timeout: 10000 })

request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
      return handleResultCode(response)
  },
  (error) => {
    return Promise.reject(error)
  },
)

const handleResultCode = (response: AxiosResponse) => {
  const { data: result } = response
  if (result?.code === 200) {
    return result
  } else  {
    return Promise.reject(`request error: ${result.message}`)
  }
}
