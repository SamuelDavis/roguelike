class Screen {
    constructor(elem, map) {
        this.elem = elem;
        this.game = map;
        this.fontSize = 25;
        this.ctx = this.elem.getContext('2d');
        this.ctx.font = `normal normal ${this.fontSize}px Monospace`;
        this.tileSize = this.ctx.measureText('.').width;
        this.halfSize = this.tileSize / 2;
        this.elem.setAttribute('width', (this.tileSize * this.game.tiles[0].length) + 'px');
        this.elem.setAttribute('height', (this.tileSize * this.game.tiles.length) + 'px');
        window.requestAnimationFrame(this.render.bind(this));
    }

    render() {
        const {tileSize, halfSize, fontSize} = this;
        const {width, height} = this.elem;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // clear
        this.ctx.clearRect(0, 0, width, height);
        // background
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, width, height);
        // foreground
        this.game.tiles.forEach((row, y) => row.forEach((entity, x) => {
            if (x === 0 || y === 0) {
                this.ctx.fillStyle = '#4b150e';
                this.ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                entity = {symbol: ` ${Math.max(x, y)} `};
            }

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = `normal normal ${fontSize / entity.symbol.length}px Monospace`;
            this.ctx.fillText(
                entity.symbol,
                x * tileSize + halfSize,
                y * tileSize + halfSize
            );
        }));

        window.requestAnimationFrame(this.render.bind(this));
    }
}
