import RogueApplet from './RogueApplet.js'

export default class Room {
  app
  x
  y
  w
  h

  constructor (app) {
    this.app = app
    const { map } = this.app
    let x, y, w, h, clear = true
    for (let hardStop = 1000; true; hardStop--) {
      if (hardStop <= 0) throw new Error('Can\'t place room.')
      x = 2 + Math.floorRand(map.width - 13)
      y = 2 + Math.floorRand(map.height - 13)
      w = 3 + Math.floorRand(10)
      h = 3 + Math.floorRand(10)

      for (let yy = y - 1; clear && yy < y + h + 1; yy++) {
        for (let xx = x - 1; clear && xx < x + w + 1; xx++) {
          clear = yy in map && xx in map[yy]
            && map[yy][xx] === RogueApplet.wallChar
        }
      }
      if (clear) break
    }

    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) {
        map[yy][xx] = RogueApplet.floorChar
      }
    }

    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  createPathTo (b) {
    const { map } = this.app
    let x = this.x + Math.floorRand(this.w)
    let y = this.y + Math.floorRand(this.h)
    let x2 = b.x + Math.floorRand(b.w)
    let y2 = b.y + Math.floorRand(b.h)

    let dx = x2 - x
    let dy = y2 - y
    dx = dx > 0 ? 1 : (dx < 0 ? -1 : 0)
    dy = dy > 0 ? 1 : (dy < 0 ? -1 : 0)
    let horizontal = Math.randBool()

    while (x !== x2 || y !== y2) {
      if (y === y2 || (horizontal && x !== x2))
        x += dx
      else
        y += dy

      if (!(x > 0 && y > 0 && x < map.width && y < map.height)) break
      map[y][x] = RogueApplet.floorChar

      if (Math.random() < 0.1)
        horizontal = !horizontal
    }
  }
}
