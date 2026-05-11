import { NodeTypes } from "./ast"

export function baseParse(content:string) {
  const context = createParserContext(content)
  return createRoot(parserChildren(context))
}

function parserChildren(context) {
  const nodes:any = []

  let node
  if(context.source.startsWith('{{')){
    node = parserInterpolation(context)
  }
  
  nodes.push(node)
  return nodes
}

function parserInterpolation(context) {
  // {{message}}

  const openDelimiter = "{{"
  const closeDelimiter = "}}"

  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  )

  advanceBy(context , openDelimiter.length)
  
  const rawContextLength = closeIndex - openDelimiter.length
  
  const rawContent = context.source.slice(0 , rawContextLength)
  const content = rawContent.trim()

  advanceBy(context , rawContextLength + closeDelimiter.length)
  
  return {
    type: NodeTypes.INTERPOLATION, //'interpolation',
    content: {
      type: NodeTypes.SIMPLE_INTERPOLATION,
      content: content
    }
  }
}

function advanceBy(context:any , length:number) {
  context.source = context.source.slice(length)
}

function createRoot(children) {
  return {
    children
  }
}

function createParserContext(content:string): any {
  return {
    source: content
  }
}