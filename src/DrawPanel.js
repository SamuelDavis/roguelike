import Array2D from './Array2D.js'
import RogueApplet from './RogueApplet.js'
import Color, { BLACK, GREEN, RED, WHITE, YELLOW } from './Color.js'

export default class DrawPanel {
  app
  messages
  health
  level
  score
  canvas
  ctx
  width
  height
  scale = 13
  offset = this.scale / 2

  constructor (app) {
    this.app = app
    this.messages = document.createElement('div')
    this.health = document.createElement('h2')
    this.level = document.createElement('h2')
    this.score = document.createElement('h2')
    this.canvas = document.createElement('canvas')
    window.addEventListener('keypress', window.keypressHandler = ({ key }) => {
      switch (key) {
        case 'w':
          app.player.move(0, -1)
          break
        case 'a':
          app.player.move(-1, 0)
          break
        case 's':
          app.player.move(0, 1)
          break
        case 'd':
          app.player.move(1, 0)
          break
        case ' ':
          const { map, player: { x, y } } = app
          if (map[y][x] === RogueApplet.stairChar) app.player.goDown()
          else app.player.move(0, 0)
      }
    });
    [...document.querySelectorAll('.click-catcher > div')].forEach((catcher, i) => {
      catcher.addEventListener('click', () => {
        switch (i) {
          case 1:
            app.player.move(0, -1)
            break
          case 3:
            app.player.move(-1, 0)
            break
          case 7:
            app.player.move(0, 1)
            break
          case 5:
            app.player.move(1, 0)
            break
          case 4:
            const { map, player: { x, y } } = app
            if (map[y][x] === RogueApplet.stairChar) app.player.goDown()
            else app.player.move(0, 0)
        }
      })
    })
    this.ctx = this.canvas.getContext('2d')
  }

  setPreferredSize (width, height) {
    this.width = width * this.scale
    this.height = height * this.scale
    this.canvas.setAttribute('width', `${this.width}px`)
    this.canvas.setAttribute('height', `${this.height}px`)
  }

  addTo (container) {
    [this.health, this.level, this.score].forEach((item) => {
      item.setAttribute('style', 'display:inline-block;width:33%;text-align:center;')
      this.messages.appendChild(item)
    })
    this.score.style.color = YELLOW.toString()
    container.appendChild(this.messages)
    container.appendChild(this.canvas)
    this.ctx.font = `${this.scale}px ${RogueApplet.Font}`
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
  }

  repaint () {
    const { map, monsters, level, player: { x: playerX, y: playerY, score, health, maxHealth, sees, seen } } = this.app
    let alphaMap = new Array2D(map.width, map.height)
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.fillStyle = BLACK.toString()
    this.ctx.fillRect(0, 0, this.width, this.height)
    map.forEach((col, y) => col.forEach((c, x) => {
      if (!seen[y][x]) return
      let alpha = 1
      if (sees[y][x]) {
        const dx = playerX - x
        const dy = playerY - y
        const rr = Math.pow(dx, 2) + Math.pow(dy, 2)
        alpha = Math.min(1, rr > 1 ? 0.5 + 4 / (rr - 1) : 1)
      } else {
        alpha = 0.25
      }
      alphaMap[y][x] = alpha
      let color
      if (RogueApplet.carnageChars.includes(c))
        color = RED
      else if (c === RogueApplet.potionChar)
        color = GREEN
      else if (c === RogueApplet.moneyChar)
        color = YELLOW
      else
        color = WHITE
      this.ctx.fillStyle = color.setAlpha(alpha).toString()
      this.ctx.fillText(c, x * this.scale + this.offset, y * this.scale + this.offset, this.scale)
    }))
    monsters.forEach(({ x, y, symbol: c }) => {
      if (!sees[y][x]) return
      this.ctx.fillStyle = WHITE.setAlpha(alphaMap[y][x]).toString()
      this.ctx.fillText(c, x * this.scale + this.offset, y * this.scale + this.offset, this.scale)
    })
    this.health.innerText = `Health: ${health} / ${maxHealth}`
    const g = health / maxHealth
    const r = 1 - g
    this.health.style.color = new Color(r, g, 0).toString()
    this.level.innerText = `Floor: ${level}`
    this.score.innerText = `Score: ${score}`
  }
}
