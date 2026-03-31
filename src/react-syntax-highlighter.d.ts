declare module 'react-syntax-highlighter/dist/esm/light' {
  import { Light } from 'react-syntax-highlighter'
  export default Light
}

declare module 'react-syntax-highlighter/dist/esm/languages/hljs/yaml' {
  const language: unknown
  export default language
}

declare module 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark' {
  const style: Record<string, React.CSSProperties>
  export default style
}
