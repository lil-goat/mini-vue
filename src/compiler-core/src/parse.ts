import { NodeTypes } from "./ast"

export function baseParse(content:string) {
  const context = createparseContext(content)
  return createRoot(parseChildren(context))
}

const enum TagType {
  Start,
  End
}

function parseChildren(context) {
  const nodes:any = []

  let node
  const s = context.source 
  if(s.startsWith('{{')){
    node = parseInterpolation(context)
  } else if(s[0] === '<') {
    if(/[a-z]/i.test(s[1])) {
      node = parseElement(context)
    }
  }
  
  nodes.push(node)
  return nodes
}

function parseElement(context) {
  const element = parseTag(context , TagType.Start)
  
  parseTag(context , TagType.End)
  
  return element
}

function parseTag(context , type: TagType){
  // Implement
  const match:any = /^<\/?([a-z]*)/i.exec(context.source)

  // 1. 解析 tag
  const tag = match[1]

  // 2. 删除处理完的代码
  advanceBy(context, match[0].length + 1)
  
  if(type === TagType.End) return

  return {
    type: NodeTypes.ELEMENT,
    tag
  }  
}

function parseInterpolation(context) {
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

function createparseContext(content:string): any {
  return {
    source: content
  }
}