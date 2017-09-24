class InputHandler {
    constructor(map, screen) {
        this.map = map;
        screen.elem.addEventListener('click', ({target, offsetX, offsetY}) => {
            const styles = window.getComputedStyle(target);
            const x = parseInt(styles.width.replace('px', '')) / 2;
            const y = parseInt(styles.height.replace('px', '')) / 2;
            const deltaX = x - offsetX;
            const deltaY = y - offsetY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    this.handleEvent(InputHandler.CONTROLS.MOVE_WEST);
                } else {
                    this.handleEvent(InputHandler.CONTROLS.MOVE_EAST);
                }
            } else {
                if (deltaY > 0) {
                    this.handleEvent(InputHandler.CONTROLS.MOVE_NORTH);
                } else {
                    this.handleEvent(InputHandler.CONTROLS.MOVE_SOUTH);
                }
            }
        });
    }

    handleEvent(key) {
        if ([InputHandler.CONTROLS.MOVE_NORTH, InputHandler.CONTROLS.MOVE_EAST, InputHandler.CONTROLS.MOVE_SOUTH, InputHandler.CONTROLS.MOVE_WEST].includes(key)) {
            let x, y, next;
            switch (key) {
                case InputHandler.CONTROLS.MOVE_NORTH:
                    [x, y] = this.map.findTiles(0, 0, null, null, Player.name)[0];
                    this.map.tiles[y][x].facing = Entity.FACING.N;
                    next = this.map.move(x, y, x, y - 1);
                    break;
                case InputHandler.CONTROLS.MOVE_EAST:
                    [x, y] = this.map.findTiles(0, 0, null, null, Player.name)[0];
                    this.map.tiles[y][x].facing = Entity.FACING.E;
                    next = this.map.move(x, y, x + 1, y);
                    break;
                case InputHandler.CONTROLS.MOVE_SOUTH:
                    [x, y] = this.map.findTiles(0, 0, null, null, Player.name)[0];
                    this.map.tiles[y][x].facing = Entity.FACING.S;
                    next = this.map.move(x, y, x, y + 1);
                    break;
                case InputHandler.CONTROLS.MOVE_WEST:
                    [x, y] = this.map.findTiles(0, 0, null, null, Player.name)[0];
                    this.map.tiles[y][x].facing = Entity.FACING.W;
                    next = this.map.move(x, y, x - 1, y);
                    break;
            }

            if (next instanceof Exit) {
                alert('Win!');
                window.location.reload(true);
            }
        }
    }
}

InputHandler.CONTROLS = {
    MOVE_NORTH: 'w',
    MOVE_EAST: 'd',
    MOVE_SOUTH: 's',
    MOVE_WEST: 'a',
};
