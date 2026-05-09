import { createRenderer } from "../runtime-core";

function createElement(type) {
  return document.createElement(type)
}

function patchProp(el , key , preVal , val) {
  const isOn = (key: string) => /^on[A-Z]/.test(key)
  if (isOn(key)) {
    el.addEventListener(key.slice(2).toLowerCase() , val)
  }
  else {
    if(val === undefined || val === null){
      el.removeAttribute(key)
    } else el.setAttribute(key , val)
  }
}

function insert(el , container) {
  container.append(el)
}

function remove(child) {
  const parent = child.parentNode
  if(parent) {
    parent.removeChild(child)
  }
}

function setElementText(el , text){
  el.textContent = text
}

export const renderer: any = createRenderer({
  createElement, 
  patchProp,
  insert,
  remove,
  setElementText
})

export function createApp(...args){
  return renderer.createApp(...args)
}

export * from '../runtime-core'