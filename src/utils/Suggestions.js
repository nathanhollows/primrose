import tippy from 'tippy.js'
import { VueRenderer } from '@tiptap/vue-3'
import { RepositoryFactory } from './../repositories/RepositoryFactory.js'
import { FuzzySearcher, Query, SearcherFactory } from '@m31coding/fuzzy-search'

import MentionList from '../components/MentionList.vue'

const ContactsRepository = RepositoryFactory.get('contacts')

const searcher = SearcherFactory.createDefaultSearcher()

async function getMentionList() {
  const response = await ContactsRepository.getAll()
  let list = []
  response.data.data.forEach((item) => {
    list.push({
      id: item.id,
      label: item.firstName + ' ' + item.lastName,
      nickname: item.nickname
    })
  })
  // Convert list to a searchable list
  searcher.indexEntities(
    list,
    (e) => e.id,
    (e) => [e.label, e.nickname, `${e.label} ${e.nickname}`]
  )
}
getMentionList()

export default {
  items: async ({ query }) => {
    // replace spaces with a $
    query = query.replace(/\s/g, '$')
    const results = searcher.getMatches(new Query(query, 8, 0.18))
    let arr = results.matches.map((item) => {
      let nickname = ''
      if (item.entity.nickname === null || item.entity.nickname === '') {
        nickname = ''
      } else {
        nickname = ` (${item.entity.nickname})`
      }
      return {
        id: item.entity.id,
        label: item.entity.label + nickname
      }
    })

    return arr
  },

  render: () => {
    let component
    let popup

    return {
      onStart: (props) => {
        component = new VueRenderer(MentionList, {
          props,
          editor: props.editor
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start'
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      }
    }
  }
}
