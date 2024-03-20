import Repository from './Repository.js'

const resource = '/groups'
export default {
  get() {
    return Repository.get(`${resource}`)
  },

  patch(id, payload) {
    return Repository.patch(`${resource}/${id}`, payload)
  }
}
