'use strict'

const assert = require('assert')
const crypto = require('crypto')

module.exports =
/**
 * Merkle trees, in JavaScript!
 * @class
 * @param {Function} digestFn Digest function (or the name of one) used to hash values.
 * @param {Array} data Values to be processed into a Merkle tree.
 * @example
 *
 * const MerkleTree = require('@garbados/merkle-tree')
 * const tree = new MerkleTree('sha256', [1, 2, 3, 4, 5, 6])
 * console.log(tree.root)
 * > b0f83986db9ecaa36bd08d732a99fc461f113b78e75612bade03892cd7bb8d25
 */
class MerkleTree {
  constructor (digestFn, data) {
    assert(['string', 'function'].includes(typeof digestFn), 'A Merkle tree requires a digest function.')
    assert(data instanceof Array, 'A Merkle tree requires an array of values.')
    if (typeof digestFn === 'string') {
      this.digestFn = MerkleTree.digestFn.bind(null, digestFn)
    } else {
      this.digestFn = digestFn
    }
    this._levels = [data].concat(this._derive(data))
  }

  /**
   * Convenience wrapper around NodeJS' built-in crypto.
   * @param  {String} hashType String value for a hash algorithm known to the platform's version of OpenSSL.
   * @param  {String} data     The data to hash. Can be any value; it will be converted to a string.
   * @return {String}          The hash of the given data using the given function.
   * @example
   *
   * const digestFn = MerkleTree.digestFn('sha256', 'hello world')
   * > b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
   */
  static digestFn (hashType, data) {
    if (typeof data !== 'string') data = JSON.stringify(data)
    const hash = crypto.createHash(hashType)
    hash.update(data)
    return hash.digest('hex')
  }

  /**
   * Retrieve the proof path for a given leaf node index.
   * @param  {Number} index Index of a leaf node to verify.
   * @return {Array}        Array of arrays of nodes associated with the given leaf node.
   * @example
   *
   * const tree = new MerkleTree('sha256', [1, 2, 3, 4, 5, 6])
   * const proof = tree.proof(3)
   * console.log(tree.leaves[3] === proof[0][0])
   * > true
   */
  proof (index) {
    let proof = []

    for (let i = 0; i < this.depth; i++) {
      let level = this.levels[i]
      let width = level.length
      if (!(index === width - 1 && width % 2 === 1)) {
        const left = (index % 2) ? level[index - 1] : level[index]
        const right = (index % 2) ? level[index] : level[index + 1]
        proof.push([left, right])
      }
      index = Math.floor(index / 2)
    }

    return proof
  }

  _derive (data) {
    let level = []
    // successively hash arbitrary elements
    for (let i = 0; i < data.length; i += 2) {
      const left = data[i]
      const right = (i + 1 === data.length)
        ? left
        : data[i + 1]
      const node = JSON.stringify([left, right])
      level.push(this.digestFn(node))
    }
    // derink and derive
    if (level.length > 1) {
      // keep deriving
      return [level].concat(this._derive(level))
    } else {
      // found root node
      return [level]
    }
  }

  /**
   * Getter for the root node.
   * @return {String} Value of the root node.
   * @example
   *
   * console.log(tree.root)
   * > b0f83986db9ecaa36bd08d732a99fc461f113b78e75612bade03892cd7bb8d25
   */
  get root () {
    return this.levels[this.levels.length - 1][0]
  }

  /**
   * Getter for the tree's depth.
   * @return {Number} Depth of the tree.
   * @example
   *
   * console.log(tree.depth)
   * > 4
   */
  get depth () {
    return this.levels.length
  }

  /**
   * Getter for the levels in the tree
   * @return {Array<Array>} Array of arrays of each node by level
   * @example
   *
   * console.log(tree.levels)
   * > [ [ 1, 2, 3, 4, 5, 6 ],
   * >   [ '49a64717d5d4cb19952e6eac2946415cf6879adacf9908e7d872332d32c6e684',
   * >     '8be6d66e9099c68d8feb52ce42478d2153cac2763b784174ae6ae96cd636b596',
   * >     '2f9cf80b937f44b41379ae3765c65668e5e96241d19d2088e76d72d18ea324b2' ],
   * >   [ '2450f5c346c26103f2bf4ba7052954556e58a1d577b78e17faa7d54c29cf6741',
   * >     '340c611ef9c540adf73ee22e41b148f9549c5bd88dfdf1a0792a23d564380dde' ],
   * >   [ 'b0f83986db9ecaa36bd08d732a99fc461f113b78e75612bade03892cd7bb8d25' ] ]
   */
  get levels () {
    return this._levels
  }

  /**
   * Getter for the tree's leaf nodes AKA its initial values.
   * @return {Array} Array of leaf nodes.
   * @example
   *
   * console.log(tree.leaves)
   * > [1, 2, 3, 4, 5, 6]
   */
  get leaves () {
    return this.levels[0]
  }
}
