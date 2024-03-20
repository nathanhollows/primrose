const siteTitle = 'Primrose'
const seperator = ' | '

export function setTitle(title) {
  document.title = `${title}${seperator}${siteTitle}`
}
