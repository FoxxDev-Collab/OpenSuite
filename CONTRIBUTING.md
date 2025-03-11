# Contributing to OpenSuite

First off, thank you for considering contributing to OpenSuite! It's people like you that make OpenSuite such a great tool for businesses around the world.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for OpenSuite. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

Before creating bug reports, please check [this list](#before-submitting-a-bug-report) as you might find out that you don't need to create one. When you are creating a bug report, please [include as many details as possible](#how-do-i-submit-a-good-bug-report).

#### Before Submitting A Bug Report

* **Check the [issues](https://github.com/yourusername/opensuite/issues)** for a list of common issues and solutions.
* **Perform a [search](https://github.com/yourusername/opensuite/issues)** to see if the problem has already been reported. If it has and the issue is still open, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://github.com/yourusername/opensuite/issues). Create an issue and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.
* **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for OpenSuite, including completely new features and minor improvements to existing functionality.

#### Before Submitting An Enhancement Suggestion

* **Check if the enhancement has already been suggested** by searching for it in the [issues](https://github.com/yourusername/opensuite/issues).

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/yourusername/opensuite/issues). Create an issue and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples, as [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of OpenSuite which the suggestion is related to.
* **Explain why this enhancement would be useful** to most OpenSuite users.
* **List some other applications where this enhancement exists.**

### Pull Requests

The process described here has several goals:

- Maintain OpenSuite's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible OpenSuite
- Enable a sustainable system for OpenSuite's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
    * 🎨 `:art:` when improving the format/structure of the code
    * 🐎 `:racehorse:` when improving performance
    * 🚱 `:non-potable_water:` when plugging memory leaks
    * 📝 `:memo:` when writing docs
    * 🐛 `:bug:` when fixing a bug
    * 🔥 `:fire:` when removing code or files
    * 💚 `:green_heart:` when fixing the CI build
    * ✅ `:white_check_mark:` when adding tests
    * 🔒 `:lock:` when dealing with security
    * ⬆️ `:arrow_up:` when upgrading dependencies
    * ⬇️ `:arrow_down:` when downgrading dependencies
    * 👕 `:shirt:` when removing linter warnings

### JavaScript/TypeScript Styleguide

* Use 2 spaces for indentation
* Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
* Prefer arrow function expressions (`=>`) over function declarations/expressions
* Inline exports with expressions whenever possible
  ```js
  // Use this:
  export const foo = 'bar';

  // Instead of:
  const foo = 'bar';
  export { foo };
  ```
* Use camelCase for variables, properties and function names
* Use PascalCase for classes and React components
* Use UPPERCASE for constants that are true constants
* Place imports in the following order:
  * Built-in Node modules (such as `path`)
  * External modules (such as `react`, `lodash`, etc)
  * Internal modules (using relative paths)

### Documentation Styleguide

* Use [Markdown](https://daringfireball.net/projects/markdown).
* Include code samples where appropriate. Wrap them in fenced code blocks (```) with the appropriate language for syntax highlighting.

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

* `bug` - Issues that are reported bugs.
* `enhancement` - Issues that are feature requests.
* `documentation` - Issues related to documentation.
* `duplicate` - Issues that are duplicates of other issues.
* `good first issue` - Issues which are good for newcomers.
* `help wanted` - Issues which need extra attention.
* `invalid` - Issues which are invalid or not relevant.
* `question` - Issues which are actually questions.
* `wontfix` - Issues which will not be fixed.

## Joining the Project Team

### How to Join

If you're interested in joining the project team as a maintainer:

1. Start by making a few contributions through pull requests
2. Join the discussion in [our community channels](#community-channels)
3. Express your interest in becoming a maintainer to the existing team
4. Receive an invitation from an existing maintainer

Active contributors may be invited to join the project team as maintainers.

## Recognition

We value every contribution. Contributors who make significant and valuable contributions over time may be granted commit access to the repository.

---

Thank you for being part of the OpenSuite journey. Your contributions make a difference!