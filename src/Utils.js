import hljs from 'highlight.js'
import marked from 'marked'

hljs.configure({
    tabReplace: '    ',
    classPrefix: 'hljs-',
    languages: ['Objective-C', 'HTML, XML', 'JSON', 'JavaScript', 'Markdown']
})

marked.setOptions({
    highlight: (code) => hljs.highlightAuto(code).value,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
})

export default {
    marked
}