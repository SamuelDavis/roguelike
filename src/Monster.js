import RogueApplet from './RogueApplet.js'

export default class Monster {
  static Ant = [3, 2, 'a', 'ant']
  static Dog = [5, 3, 'd', 'dog']
  static Kobol = [7, 4, 'k', 'kobol']
  static Goblin = [3, 6, 'g', 'goblin']
  static Hobbit = [10, 3, 'h', 'hobbit']
  static Xan = [7, 7, 'x', 'xan']
  static Dragon = [15, 15, 'D', 'dragon']

  app
  maxHealth
  health
  strength
  symbol
  name
  x
  y
  tx
  ty
  experience = 0
  ai_interest = 0.3
  memory = false

  constructor (app, maxHealth, strength, symbol, name) {
    this.app = app
    this.health = this.maxHealth = maxHealth
    this.strength = strength
    this.symbol = symbol
    this.name = name
  }

  ai () {
    const { x, y, app: { map, player: { x: playerX, y: playerY } } } = this
    const see = this.lineOfSight(playerX, playerY)
    if ((see || this.memory) && Math.random() > this.ai_interest) {
      if (see) {
        this.memory = true
        this.tx = playerX
        this.ty = playerY
      } else if (this.tx === x && this.ty === y) {
        this.memory = false
      }

      const dx = this.tx - x
      const dy = this.ty - y
      let ddx = dx > 0 ? 1 : dx < 0 ? -1 : 0
      let ddy = dy > 0 ? 1 : dy < 0 ? -1 : 0

      let attempt = new Array(3).fill(undefined).map(() => [ddx, ddy])
      if (dx * dx > dy * dy) {
        attempt[1][1] = 0
        attempt[2][0] = 0
      } else {
        attempt[1][0] = 0
        attempt[2][1] = 0
      }

      attempt.some(([ddx, ddy]) => {
        return map[y + ddy][x + ddx] !== RogueApplet.wallChar
      })

      for (let c = 0; c < 3; c++) {
        ddx = attempt[c][0]
        ddy = attempt[c][1]
        if (map[y + ddy][x + ddx] !== RogueApplet.wallChar) break
      }

      this.move(ddx, ddy)
    } else {
      this.move(Math.floorRand(3) - 1, Math.floorRand(3) - 1)
    }
  }

  place () {
    const map = this.app.map
    while (true) {
      this.x = Math.floorRand(map.width)
      this.y = Math.floorRand(map.height)
      if (map[this.y][this.x] === RogueApplet.floorChar) break
    }
  }

  move (dx, dy) {
    if (dx === 0 && dy === 0) return
    const { map, monsters } = this.app
    const tx = this.x + dx
    const ty = this.y + dy
    if (!(ty in map && tx in map[ty])) return
    if (map[ty][tx] === RogueApplet.wallChar) return
    const attacking = monsters.some((m) => {
      if (m !== this && m.x === tx && m.y === ty) {
        m.damage(Math.floorRand(this.strength + this.experience / 20), this)
        return true
      }
    })
    if (attacking) return

    this.x += dx
    this.y += dy
  }

  damage (dmg, src) {
    const { x, y, app: { map, monsters } } = this
    this.health -= dmg

    if (this.health < 0) {
      alert(`Killed ${this.name}!`)
      monsters.splice(monsters.indexOf(this), 1)
      src.gainExperience(Math.floorRand(this.strength))
      map[y][x] = RogueApplet.carnageChars[Math.floorRand(RogueApplet.carnageChars.length)]
    }
  }

  gainExperience (xp) {
    this.experience += xp
  }

  lineOfSight (x2, y2) {
    const { x, y, app: { map } } = this
    if (x2 < x) x2 += 0.5
    else if (x2 > x) x2 -= 0.5
    if (y2 < y) y2 += 0.5
    else if (y2 > y) y2 -= 0.5

    let dx = x2 - x
    let dy = y2 - y

    let l = Math.max(Math.abs(dx), Math.abs(dy))
    dx /= l
    dy /= l

    let xx = x
    let yy = y

    while (l > 0) {
      const ix = Math.floor(xx + 0.5)
      const iy = Math.floor(yy + 0.5)

      if (x2 === ix && y2 === iy) break
      if (!(x === ix && y === iy) && map[iy][ix] === RogueApplet.wallChar)
        return false

      xx += dx
      yy += dy
      l--
    }
    return true
  }
}
