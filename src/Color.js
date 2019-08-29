export default class Color {
  r
  g
  b
  a

  constructor (r, g, b, a = 1) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }

  setAlpha (a) {
    return new Color(this.r, this.g, this.b, a)
  }

  toString () {
    return `rgba(${[this.r, this.g, this.b].map((n) => n * 255)}, ${this.a})`
  }
}

export const WHITE = new Color(1, 1, 1)
export const BLACK = new Color(0, 0, 0)
export const RED = new Color(1, 0, 0)
export const GREEN = new Color(0, 1, 0)
export const YELLOW = new Color(1, 1, 0)
