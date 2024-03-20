import Repository from './Repository.js'

const contact = '/contacts'
const resource = '/interactions'
export default {
  get(id) {
    return Repository.get(`${contact}/${id}`)
  },

  getAll() {
    return Repository.get(`${resource}`)
  },

  patch(id, payload) {
    return Repository.patch(`${resource}/${id}`, payload)
  },

  add(id, payload) {
    return Repository.post(`${contact}/${id}${resource}`, payload)
  },

  delete(id) {
    return Repository.delete(`${resource}/${id}`)
  }
}
