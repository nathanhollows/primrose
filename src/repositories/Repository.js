import axios from 'axios'
import applyCaseMiddleware from 'axios-case-converter'
import $bus from '../utils/Events'
import { setupCache } from 'axios-cache-interceptor'

const baseDomain = 'http://localhost:8080'
const baseURL = `${baseDomain}`

const axiosApiInstance = applyCaseMiddleware(
  setupCache(
    axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      withCredentials: true // Required to handle cookies
    })
  )
)

// Response interceptor for handling token expiration
axiosApiInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async function (error) {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      // Check if the request is for the refresh token endpoint
      if (originalRequest.url === '/refresh-token') {
        $bus.$emit('session-expired')
        return Promise.reject(error)
      }

      try {
        // Here, send a request to your server to refresh the token
        // The server should set a new HTTP-only cookie with the refreshed token
        await axiosApiInstance.post('/refresh-token')
        return axiosApiInstance(originalRequest)
      } catch (refreshError) {
        // Handle the case where the refresh attempt fails
        // Possibly redirect to login or show an error message
        $bus.$emit('session-expired')
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosApiInstance
