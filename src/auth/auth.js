// auth.js
import { reactive } from 'vue'
import { RepositoryFactory } from '../repositories/RepositoryFactory'

const user = JSON.parse(localStorage.getItem('user'))
const SessionRepository = RepositoryFactory.get('sessions')

export const auth = reactive({
  login(user) {
    this.user = user
    // Optionally save to local storage
    localStorage.setItem('user', JSON.stringify(user))
  },

  logout() {
    this.user = null
    localStorage.removeItem('user')
    // Redirect to login page or do other cleanup
  },

  // Return true if user is logged in
  loggedIn() {
    return !!user
  },

  // Get the logged in user
  user() {
    return user
  },

  // Check if the session is still valid
  async checkSession() {
    try {
      const response = await SessionRepository.check()
      this.login(response.data)
      return true
    } catch (error) {
      return false
    }
  }
})
