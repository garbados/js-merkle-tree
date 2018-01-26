# js-merkle-tree

[![Stability](https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square)](https://nodejs.org/api/documentation.html#documentation_stability_index)
[![NPM Version](https://img.shields.io/npm/v/@garbados/js-merkle-tree.svg?style=flat-square)](https://www.npmjs.com/package/@garbados/js-merkle-tree)
[![JS Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
[![Build Status](https://img.shields.io/travis/garbados/js-merkle-tree/master.svg?style=flat-square)](https://travis-ci.org/garbados/js-merkle-tree)
[![Coverage Status](https://img.shields.io/coveralls/github/garbados/js-merkle-tree/master.svg?style=flat-square)](https://coveralls.io/github/garbados/js-merkle-tree?branch=master)


Generic [Merkle trees](https://en.wikipedia.org/wiki/Merkle_tree) in JavaScript.

## Why?

Merkle trees organize an array of values into a tree whose elements can be rapidly verified as correct. Merkle trees are often used in peer-to-peer technologies so that peers can quickly verify that the data they have received is correct, guarding against data loss or manipulation. [Dat](http://datproject.org/), [IPFS](http://ipfs.io/), and [BitCoin](https://bitcoin.org/) all use Merkle trees for this reason.

This library is an effort to create a generic implementation of the datastructure accompanied by thorough testing and documentation.

## Install

Use [npm](https://www.npmjs.com/):

```bash
$ npm i @garbados/merkle-tree
```

## Usage

## Tests

To run the project's test suite, use [npm](https://npmjs.com/)

```bash
npm test
```

## Contributions

All contributions are welcome: bug reports, feature requests, "why doesn't this work" questions, patches for fixes and features, etc. For all of the above, [file an issue](https://github.com/garbados/js-merkle-tree/issues) or [submit a pull request](https://github.com/garbados/js-merkle-tree/pulls).

## License

[Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)
