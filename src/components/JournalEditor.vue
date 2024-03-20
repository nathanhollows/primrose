<template>
  <label class="form-control" v-if="editor">
    <div class="label">
      <span class="label-text">Notes</span>
    </div>
    <editor-content :editor="editor" />
  </label>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Mention from '@tiptap/extension-mention'
import HistoryOptions from '@tiptap/extension-history'
import suggestion from '../utils/Suggestions.js'
import { watch } from 'vue'

const props = defineProps({
  journal: {
    type: String,
    default: '{ "type": "doc", "content": [ { "type": "paragraph" } ] }'
  }
})

watch(
  () => props.journal,
  (newVal) => {
    if (editor.value) {
      try {
        const parsedNewVal = JSON.parse(newVal)
        const currentContent = editor.value.getJSON()
        if (JSON.stringify(currentContent) !== JSON.stringify(parsedNewVal)) {
          editor.value.commands.setContent(JSON.parse(parsedNewVal))
        }
      } catch (error) {
        editor.value.commands.setContent({ type: 'doc', content: [{ type: 'paragraph' }] })
      }
    }
  }
)
const emits = defineEmits(['update:modelValue'])

const editor = useEditor({
  extensions: [
    Document,
    Paragraph,
    Text,
    HistoryOptions,
    Mention.configure({
      HTMLAttributes: {
        class: 'mention'
      },
      suggestion
    })
  ],

  onUpdate({ editor }) {
    const jsonContent = editor.getJSON()
    emits('update:modelValue', jsonContent)
  }
})
</script>

<style>
.tiptap.ProseMirror {
  @apply textarea textarea-bordered w-full my-3 min-h-[200px];
}
</style>
emits
