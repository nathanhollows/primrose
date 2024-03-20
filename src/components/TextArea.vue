<template>
  <div>
    <div
      contenteditable="true"
      ref="editableDiv"
      @input="processContent"
      v-html="processedContent"
      @blur="saveCaretPosition"
    ></div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'

export default {
  setup() {
    const editableDiv = ref(null)
    const rawContent = ref('')
    const processedContent = ref('')
    const timePattern =
      /in (\d+|one|two|three|four|five|six|seven|eight|nine|ten) (seconds?|minutes?|hours?|days?|weeks?|months?|years?)/i
    let caretPosition = 0

    const processContent = () => {
      rawContent.value = editableDiv.value.innerText
      const matches = rawContent.value.match(timePattern)
      if (matches) {
        processedContent.value = rawContent.value.replace(
          matches[0],
          `<span class="highlight">${matches[0]}</span>`
        )
      } else {
        processedContent.value = rawContent.value
      }
    }

    const restoreCaretPosition = () => {
      const range = document.createRange()
      range.setStart(editableDiv.value.firstChild, caretPosition)
      range.collapse(true)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }

    watch(processedContent, () => {
      restoreCaretPosition()
    })

    onMounted(() => {
      processContent()
    })

    return { editableDiv, processContent, processedContent }
  }
}
</script>

<style>
.highlight {
  background-color: yellow;
}
</style>
