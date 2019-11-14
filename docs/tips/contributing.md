
## Contributing

MobX state tree is a community driven project, but is looking for active maintainers! See [#700](https://github.com/mobxjs/mobx-state-tree/issues/700)

Extensive pull requests are best discussed in an issue first.

Setting up the environment:

1.  Clone this repository
2.  `yarn` is the package manager of choice (with workspaces support enabled). Make sure to run Node 8 or higher.
3.  Run `yarn install` on the root.
4.  Editor settings are optimized for VS Code, so just run `code .` in the root folder. Debugger settings are included in the project.

For `mobx-state-tree`:

1.  Go to `packages/mobx-state-tree` and run `yarn jest` to ensure all tests pass.
2.  After updating jsdocs, better run `yarn build-docs` in `packages/mobx-state-tree` to regenerate them.

For `mst-middlewares`:

1.  Go to `packages/mst-middlewares` and run `yarn jest` to ensure all tests pass.
2.  If your changes depend on a change in `packages/mobx-state-tree` you will need to run `yarn buld` there first!

Once you think your PR is ready:

1.  Run on the root `yarn build` to ensure it all builds.
2.  Run on the root `yarn test` to ensure all tests pass.
3.  Create the PR on GitHub.
4.  Check the CI build passes on the PR thread in GitHub.

Have fun!
