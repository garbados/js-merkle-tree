/* globals describe it */
'use strict'

const assert = require('assert')
const MerkleTree = require('.')

const DATA = [1, 2, 3, 4, 5, 6]
const ROOT = '34d6926e5b6cde37a92cb1ed95a79fe04eb0c66600beb360d41d822631d83915'

describe('js-merkle-tree', function () {
  it('should hash anything', function () {
    const hash = MerkleTree.digestFn('sha256', DATA)
    assert(hash.length, 64)
  })

  it('should create a tree', function () {
    const tree = new MerkleTree('sha256', DATA)
    assert.equal(typeof tree.depth, 'number')
    assert.equal(tree.leaves.length, DATA.length)
    assert.equal(typeof tree.root, 'string')
    assert.equal(tree.root.length, 64)
    assert.equal(tree.root, ROOT)
  })

  it('should create a tree with a custom digest', function () {
    const digestFn = MerkleTree.digestFn.bind(null, 'sha1')
    const tree = new MerkleTree(digestFn, DATA)
    assert.equal(typeof tree.depth, 'number')
    assert.equal(tree.leaves.length, DATA.length)
    assert.equal(typeof tree.root, 'string')
    assert.equal(tree.root.length, 40)
  })

  it('should prove itself', function () {
    const tree = new MerkleTree('sha256', DATA)
    const proof = tree.proof(3) // arbitrary leaf node
    for (let i = 0; i < proof.length; i++) {
      let [left, right] = proof[i]
      let level = tree.levels[i]
      let index = level.indexOf(left)
      // is this your card?
      assert(index > -1)
      assert.equal(right, level[index + 1])
    }
  })
})
