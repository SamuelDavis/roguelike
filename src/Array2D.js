export default class Array2D extends Array {
  constructor (width, height) {
    super(height)
    for (let i = 0; i < height; i++) this[i] = new Array(width).fill(undefined)
  }

  get width () {
    return this.length && this[0].length
  }

  get height () {
    return this.length
  }
}
