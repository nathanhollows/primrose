import Repository from './Repository.js'

const resource = '/gifts'
export default {
  // Get from /contacts/:id/gifts
  get(contactId) {
    return Repository.get(`/contacts/${contactId}${resource}`)
  },

  // Get from /gifts
  getAll() {
    return Repository.get(`${resource}`)
  },

  // Post to /contacts/:id/gifts
  create(contactId, payload) {
    return Repository.post(`/contacts/${contactId}${resource}`, payload)
  },

  // Patch to /gifts/:id
  patch(id, payload) {
    return Repository.patch(`${resource}/${id}`, payload)
  },

  // Delete to /gifts/:id
  delete(id) {
    return Repository.delete(`${resource}/${id}`)
  }
}
