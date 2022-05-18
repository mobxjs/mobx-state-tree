---
2
id: installation
3
title: Installation
4
---
5
​
6
<div id="codefund"></div>
7
​
8
-   NPM: `npm install mobx mobx-state-tree --save`
9
-   Yarn: `yarn add mobx mobx-state-tree`
-   pnpm: `pnpm add mobx mobx-state-tree`
10
-   CDN: https://unpkg.com/mobx-state-tree/dist/mobx-state-tree.umd.js (exposed as `window.mobxStateTree`)
11
-   CodeSandbox [TodoList demo](https://codesandbox.io/s/y64pzxj01) fork for testing and bug reporting
12
​
13
TypeScript typings are included in the packages. Use `module: "commonjs"` or `moduleResolution: "node"` to make sure they are picked up automatically in any consuming project.
14
​
15
Supported environments:
16
​
17
-   MobX-State-Tree 4+ runs in any JavaScript environment, including browsers, Node, React Native (including Hermes), and more
18
​
19
Supported devtools:
20
​
21
-   [Reactotron](https://github.com/infinitered/reactotron)
22
-   [MobX DevTools](https://chrome.google.com/webstore/detail/mobx-developer-tools/pfgnfdagidkfgccljigdamigbcnndkod)
23
-   The Redux DevTools can be connected as well as demonstrated [here](https://github.com/mobxjs/mobx-state-tree/blob/1906a394906d2e8f2cc1c778e1e3228307c1b112/packages/mst-example-redux-todomvc/src/index.js#L6)
24
​
