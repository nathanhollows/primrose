import Repository from './Repository.js'

const resource = '/contacts'
export default {
  getAll() {
    return Repository.get(`${resource}`, {
      withCredentials: true
    })
  },

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

  put(id, payload) {
    return Repository.put(`${resource}/${id}`, payload)
  },

  delete(id) {
    return Repository.delete(`${resource}/${id}`)
  }
}
