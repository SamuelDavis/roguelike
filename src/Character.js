import Monster from './Monster.js'
import RogueApplet from './RogueApplet.js'
import Array2D from './Array2D.js'

export default class Character extends Monster {
  seen
  sees
  score = 0
  rest = 0
  seeRadius = 7

  constructor (app) {
    super(app, 20, 5, '@', 'player')
    this.seen = new Array2D(this.app.map.width, this.app.map.height)
    this.sees = new Array2D(this.app.map.width, this.app.map.height)
  }

  reset () {
    this.place()
    this.seen.forEach((col) => col.fill(false))
    this.see()
  }

  move (dx, dy) {
    super.move(dx, dy)
    const { x, y, app: { map } } = this

    if (map[y][x] === RogueApplet.moneyChar) {
      map[y][x] = RogueApplet.floorChar
      const points = 2 + Math.floorRand(20)
      alert(`Picked up ${points} gold.`)
      this.score += points
    }
    if (map[y][x] === RogueApplet.potionChar) {
      map[y][x] = RogueApplet.floorChar
      const heal = 5 + Math.floorRand(5)
      alert(`Healed for ${heal}.`)
      this.health = Math.min(this.maxHealth, this.health + heal)
    }

    if (this.health < this.maxHealth) this.rest++
    if (this.rest > 20) {
      this.rest = 0
      this.health++
      alert('With time, you feel slightly better.')
    }

    this.see()
    this.app.tick()
    this.app.drawPanel.repaint()
  }

  see () {
    const { x, y, seeRadius, app: { map: { width, height } } } = this
    this.sees.forEach((col) => col.fill(false))
    for (let yy = -seeRadius; yy < seeRadius; yy++) {
      const ty = y + yy
      if (ty < 0 || ty >= height) continue
      for (let xx = -seeRadius; xx < seeRadius; xx++) {
        const tx = x + xx
        if (xx * xx + yy * yy > seeRadius * seeRadius) continue
        if (tx < 0 || tx >= width) continue
        if (ty < 0 || ty >= height) continue
        if (this.lineOfSight(tx, ty))
          this.sees[ty][tx] = this.seen[ty][tx] = true
      }
    }
  }

  damage (dmg, src) {
    super.damage(dmg, src)
    if (this.health > 0) {
      alert(`Hurt by ${src.name}.`)
    } else {
      alert(`Killed by ${src.name}.`)
      confirm('Game Over. Restart?')
        ? window.location.reload()
        : window.removeEventListener('keypress', window.keypressHandler)
    }
  }

  gainExperience (exp) {
    if (this.experience / 20 < (this.experience + exp) / 20) {
      alert('Gained a new level')
      this.maxHealth += 2
    }
    super.gainExperience(exp)
  }

  goDown () {
    const { monsters } = this.app
    monsters.splice(0, monsters.length)
    monsters.push(this)
    this.app.genMap()
    this.reset()
    alert('Went downstairs.')
    this.app.drawPanel.repaint()
  }

  ai () {}
}
