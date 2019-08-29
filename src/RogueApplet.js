import DrawPanel from './DrawPanel.js'
import Array2D from './Array2D.js'
import Character from './Character.js'
import Room from './Room.js'
import Monster from './Monster.js'

export default class RogueApplet {
  static Font = '"Courier New", monospaced'
  static wallChar = '#'
  static floorChar = '.'
  static moneyChar = '$'
  static potionChar = '!'
  static stairChar = '>'
  static carnageChars = ['`', ',', '\\']
  drawPanel
  width = 50
  height = 50
  map = new Array2D(this.width, this.height)
  monsters = []
  player
  level = 0
  mTypes = [
    Monster.Ant,
    Monster.Dog,
    Monster.Kobol,
    Monster.Goblin,
    Monster.Hobbit,
    Monster.Xan,
    Monster.Dragon,
  ]

  constructor () {
    this.drawPanel = new DrawPanel(this)
    this.drawPanel.setPreferredSize(this.map.width, this.map.height)
    this.drawPanel.addTo(document.body)

    this.genMap()

    this.player = new Character(this)
    this.monsters.push(this.player)
    this.player.reset()
    this.drawPanel.repaint()
  }

  tick () {
    this.monsters.forEach((m) => m.ai())
  }

  genMap () {
    this.map.forEach((col) => col.fill(RogueApplet.wallChar))
    let previousRoom, nRooms = 5 + Math.floorRand(4)
    for (let i = 0; i < nRooms; i++) {
      try {
        const room = new Room(this)
        if (previousRoom) room.createPathTo(previousRoom)
        previousRoom = room
      } catch (e) {}
    }

    for (let i = 0; i < this.level + 10; i++) {
      let x = Math.floorRand(this.map.width)
      let y = Math.floorRand(this.map.height)
      this.map[y][x] = RogueApplet.moneyChar
    }

    for (let i = 0; i < 10; i++) {
      let x = Math.floorRand(this.map.width)
      let y = Math.floorRand(this.map.height)
      this.map[y][x] = RogueApplet.potionChar
    }

    while (true) {
      let x = Math.floorRand(this.map.width)
      let y = Math.floorRand(this.map.height)
      if (this.map[y][x] === RogueApplet.floorChar) {
        this.map[y][x] = RogueApplet.stairChar
        break
      }
    }

    for (let nMonsters = Math.floorRand(nRooms + this.level / 4); nMonsters > 0; nMonsters--) {
      const mTypeIndex = Math.floor((Math.abs((Math.random() + Math.random() - 1)) * (this.level + 2)))
      const m = new Monster(this, ...this.mTypes[Math.min(this.mTypes.length - 1, mTypeIndex)])
      this.monsters.push(m)
      m.place()
    }
    this.level++
  }
}
