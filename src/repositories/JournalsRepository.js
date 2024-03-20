import Repository from './Repository.js'

const resource = '/journals'
export default {
  getAll() {
    return Repository.get(`${resource}`, {
      withCredentials: true
    })
  },

  // Accepts a date string in the format of YYYY-MM-DD or a UUID
  get(id) {
    return Repository.get(`${resource}/${id}`, {
      withCredentials: true
    })
  },

  add(payload) {
    return Repository.post(`${resource}`, payload)
  },

  patch(id, payload) {
    return Repository.patch(`${resource}/${id}`, payload)
  },

  update(id, payload) {
    return Repository.put(`${resource}/${id}`, payload)
  },

  delete(id) {
    return Repository.delete(`${resource}/${id}`)
  }
}
