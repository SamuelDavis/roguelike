import RogueApplet from './src/RogueApplet.js'

Math.floorRand = (max) => Math.floor(Math.random() * max)
Math.randBool = () => Math.random() >= 0.5

document.addEventListener('DOMContentLoaded', () => new RogueApplet())
