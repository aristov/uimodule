import { App } from './App'

function run() {
  App.__storage.get(document.body.querySelector('.App'))?.destroy()
  new App({ parent : document.body })
}

run()

if(module.hot) {
  module.hot.accept(['./App'], run)
}
