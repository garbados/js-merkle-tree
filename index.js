'use strict'

const assert = require('assert')
const crypto = require('crypto')

module.exports =
class MerkleTree {
  static digestFn (hashType, string) {
    const hash = crypto.createHash(hashType)
    hash.update(string)
    return hash.digest('hex')
  }

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

  get root () {
    return this.levels[this.levels.length - 1][0]
  }

  get depth () {
    return this.levels.length
  }

  get levels () {
    return this._levels
  }

  get leaves () {
    return this.levels[0]
  }
}
