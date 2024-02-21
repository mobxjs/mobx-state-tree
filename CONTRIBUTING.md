# Contributing to MobX-State-Tree

Welcome to MobX-State-Tree! We're stoked that you want to contribute to our open-source project. Our community is essential in maintaining and improving the stability, test coverage, and documentation of MST. We really appreciate your time and interest in pitching in. Overall, we want to build useful software and have fun doing it - we hope you'll be able to join us!

## Table of Contents

1. [Getting Started](#getting-started)
2. [Contributing Guidelines](#contributing-guidelines)
3. [Reporting Bugs](#reporting-bugs)
4. [Code of Conduct](#code-of-conduct)

## Getting Started

Before you start contributing, please make sure you have:

- [Bun](https://bun.sh/) installed on your local machine.
- A [GitHub](https://github.com/) account, as you'll need it to create issues and submit pull requests.

Most of the documentation and community assumes some amount of familiarity with:

1. JavaScript
2. TypeScript
3. git
4. Using the command line
5. Experience with state management libraries (typically on the frontend, although there are plenty of applications using MST in other contexts).

If you don't feel comfortable with these concepts, we'd be happy to help you get started, but you may want to consider brushing up on them before digging into the codebase. Reach out in the [discussions section of our GitHub repository](https://github.com/mobxjs/mobx-state-tree/discussions) if you'd like pointers about where to start.

## Contributing Guidelines

### Prioritizing Stability Over New Features

The existing API for MobX-State-Tree is [already quite extensive](https://mobx-state-tree.js.org/intro/welcome). As such, issues and PRs about new features may take lower priority than bug fixes, improving existing features, and performance/TypeScript improvements. If you're looking to augment MST with new functionality, we encourage you to consider building your own third-party library around our project, or perhaps [contributing to the mst-middlewares package](https://github.com/coolsoftwaretyler/mst-middlewares). We'd be happy to help faciliate that work, especially if it keeps our API from expanding much further.

### Tests

To maintain our library's stability, we are always striving to improve test coverage, even where more tests might be redundant. Every PR is _required to add at least one test that directly exercises your code change_, even if that test may be duplicative of existing tests. If you do not include tests with your PR, we will ask you to do so before reviewing. If you open a PR and are unwilling to write tests, we may either write tests on your behalf, or close the PR. If you are uncomfortable writing tests or working with Jest (our current testing library), we would be happy to guide you. This requirement is not intended as a barrier to entry, but as a way for us to enforce and improve the stability of our long-lived library here. It also serves as a way to externally communicate how your change will (or perhaps how it will not) modify the behavior of MST. There's no documentation quite as good as a comprehensive test suite!

### Documentation Changes

Good documentation is crucial for our users. If your contribution involves changes to the library's behavior, please update the documentation accordingly. Not every PR is necessarily going to require documentation updates, but we encourage you to consider touching up documentation related to your code changes. If you're unsure about where to make changes, feel free to reach out to us, and we'll be happy to guide you.

### Submitting a Pull Request

1. Fork the MobX-State-Tree repository on GitHub to your own GitHub account.
2. Clone your fork to your local machine.
3. Create a new branch for your changes: `git checkout -b my-feature`.
4. Before starting, it's not a bad idea to `bun install && bun run build && bun run test` to check that your machine can run the full test suite to start.
5. Make your changes and ensure that all tests pass (including any new tests you have added).
6. Update the documentation if necessary.
7. Commit your changes: `git commit -m "Add my feature"`. Please consider [following conventional commit formatting](https://www.conventionalcommits.org/en/v1.0.0/).
8. Push your changes to your fork: `git push origin my-feature`.
9. Create a pull request on the MobX-State-Tree repository. We have a pull request template. If you fill that out and include examples of your changes, links to any issue(s) you're working on, and a good description of your PR, that would help us out a lot. If you skip those steps, we may ask you for clarification before reviewing your work.

Our team will review your pull request as soon as possible and provide feedback. Please be patient, as it may take some time to review and merge your contribution.

## Reporting Bugs

If you encounter a bug while using MobX-State-Tree, please help us by reporting it. To report a bug:

1. Check if the bug has already been reported by searching our [issue tracker](https://github.com/mobxjs/mobx-state-tree/issues).
2. If not, create a new issue, including as much detail as possible about the bug and steps to reproduce it. We have issue templates that will ask specific questions for you to help us understand the problem.

## Bigger PRs

If you want to contribute a large or significant change to MST, we'd love to connect with you ahead of time to make sure it fits in with our overall road map, meets our stability requirements, and make sure you are set up for success. Please consider [asking around in the discussion forum](https://github.com/mobxjs/mobx-state-tree/discussions) if you have a big idea you want to implement, or if you want to work on some existing big ideas out therein the communit.

## Code of Conduct

We strive to maintain a friendly and welcoming community. Please read and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions within the MobX-State-Tree project.

Thank you for considering contributing to MobX-State-Tree. Your contributions help us make our library better for everyone. We appreciate your support and look forward to collaborating with you!
