---
id: installation
title: Installation
---

<div id="codefund"></div>

-   NPM: `npm install mobx mobx-state-tree --save`
-   Yarn: `yarn add mobx mobx-state-tree`
-   CDN: https://unpkg.com/mobx-state-tree/dist/mobx-state-tree.umd.js (exposed as `window.mobxStateTree`)
-   CodeSandbox [TodoList demo](https://codesandbox.io/s/y64pzxj01) fork for testing and bug reporting

TypeScript typings are included in the packages. Use `module: "commonjs"` or `moduleResolution: "node"` to make sure they are picked up automatically in any consuming project.

Supported environments:

-   MobX-State-Tree 4+ runs in any JavaScript environment, including browsers, Node, React Native (including Hermes), and more

Supported devtools:

-   [Reactotron](https://github.com/infinitered/reactotron)
-   [MobX DevTools](https://chrome.google.com/webstore/detail/mobx-developer-tools/pfgnfdagidkfgccljigdamigbcnndkod)
-   The Redux DevTools can be connected as well as demonstrated [here](https://github.com/coolsoftwaretyler/mst-example-redux-todomvc/blob/main/src/index.js#L6)
