---
id: using-react
title: React and MST
---

<div id="codefund"></div>

<details>
    <summary style="color: white; background:#ff7000;padding:5px;margin:5px;border-radius:2px">egghead.io lesson 5: Render mobx-state-tree Models in React</summary>
    <br>
    <div style="padding:5px;">
        <iframe style="border: none;" width=760 height=427  src="https://egghead.io/lessons/react-render-mobx-state-tree-models-in-react/embed" ></iframe>
    </div>
    <a style="font-style:italic;padding:5px;margin:5px;"  href="https://egghead.io/lessons/react-render-mobx-state-tree-models-in-react">Hosted on egghead.io</a>
</details>

### Can I use React and MST together?

Yep, that works perfectly fine, everything that applies to MobX and React applies to MST and React as well.  `observer`, `autorun`, etc. will work as expected.
To share MST trees between components we recommend to use `React.createContext`.

In the examples folder several examples of React and MST can be found, or check this [example](https://github.com/impulse/react-hooks-mobx-state-tree) which uses hooks (recommended).

### Tips

When passing models in to a component **do not** use the spread syntax, e.g. `<Component foo={bar} {...model}>`. See [here](https://github.com/mobxjs/mobx-state-tree/issues/726).
