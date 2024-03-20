import Repository from './Repository.js'

export default {
  login(payload) {
    return Repository.post('login', payload)
  },

  logout() {
    return Repository.post('logout')
  },

  check() {
    return Repository.get('check-session')
  }
}
