const events = new Map()

export default {
  $on(event, fn) {
    if (!events.has(event)) {
      events.set(event, new Set())
    }
    events.get(event).add(fn)
  },

  $off(event, fn) {
    if (!events.has(event)) {
      return
    }
    events.get(event).delete(fn)
  },

  $emit(event, data) {
    if (events.has(event)) {
      events.get(event).forEach((fn) => fn(data))
    }
  },

  // confirm-delete-modal model
  confirmDeleteModal: {
    show: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    onConfirm: null
  }
}
