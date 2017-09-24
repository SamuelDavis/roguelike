class Screen {
    constructor(elem, map, width = 10, height = 10) {
        this.elem = elem;
        this.map = map;
        this.fontSize = 25;
        this.ctx = this.elem.getContext('2d');
        this.ctx.font = `normal normal ${this.fontSize}px Monospace`;
        this.tileSize = this.ctx.measureText('.').width;
        this.halfSize = this.tileSize / 2;
        this.elem.setAttribute('width', (this.tileSize * (width || this.map.tiles[0].length)) + 'px');
        this.elem.setAttribute('height', (this.tileSize * (height || this.map.tiles.length)) + 'px');
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
        const [x, y, player] = this.map.findTiles(0, 0, null, null, Player.name)[0];
        this.map
            .getVisibleFrom(x - player.sight, y - player.sight, player.sight * 2 + 1)
            .forEach(([x, y, entity]) => {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = `normal normal ${fontSize / entity.symbol.length}px Monospace`;
                this.ctx.fillText(
                    entity.symbol,
                    x * tileSize + halfSize,
                    y * tileSize + halfSize
                );
            });

        window.requestAnimationFrame(this.render.bind(this));
    }
}
