import Repository from './Repository.js'

const resource = '/reminders'
export default {
  get() {
    return Repository.get(`${resource}`, {
      withCredentials: true
    })
  },

  patch(id, payload) {
    return Repository.patch(`${resource}/${id}`, payload, {
      withCredentials: true
    })
  },

  delete(id) {
    return Repository.delete(`${resource}/${id}`, {
      withCredentials: true
    })
  }
}
