export * from './runtime-dom'

import {baseCompiled} from './compiler-core/src'
import * as runtimeDom from './runtime-dom'
import {registerRuntimeCompiler} from './runtime-dom'

function compileToFunction(template) {
  const {code} = baseCompiled(template)
  const render = new Function('Vue' , code)(runtimeDom)

  return render
}

registerRuntimeCompiler(compileToFunction)