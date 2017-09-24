class InputHandler {
    constructor(map, controls) {
        this.map = map;
        for (let key in InputHandler.CONTROLS) {
            if (!InputHandler.CONTROLS.hasOwnProperty(key)) {
                continue;
            }
            const label = document.createElement('label');
            label.setAttribute('for', `#${key}`);
            label.innerText = key.replace('_', ' ');
            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('id', key);
            input.setAttribute('label', key);
            input.setAttribute('value', InputHandler.CONTROLS[key]);
            input.addEventListener('keyup', ({target, key}) => {
                if (Object.values(InputHandler.CONTROLS).includes(key)) {
                    target.value = target.getAttribute('value');
                } else {
                    target.setAttribute('value', key);
                    target.value = key;
                    InputHandler.CONTROLS[target.getAttribute('id')] = key;
                }
            });
            controls.appendChild(input);
            controls.appendChild(label);
        }

        this.bindKeyboard();
        this.bindMobile();
    }

    bindMobile() {
        let swipeStartX = 0;
        let swipeStartY = 0;
        document.addEventListener('touchstart', ({changedTouches}) => {
            const touch = changedTouches[0];
            swipeStartX = touch.clientX;
            swipeStartY = touch.clientY;
        });
        document.addEventListener('touchend', ({changedTouches}) => {
            const touch = changedTouches[0];
            const swipeEndX = touch.clientX;
            const swipeEndY = touch.clientY;
            const deltaX = Math.abs(swipeEndX - swipeStartX);
            const deltaY = Math.abs(swipeEndY - swipeStartY);
            if (deltaX > deltaY) {
                if (swipeStartX > swipeEndX) {
                    this.handleEvent(InputHandler.CONTROLS.MOVE_WEST);
                } else {
                    this.handleEvent(InputHandler.CONTROLS.MOVE_EAST);
                }
            } else {
                if (swipeStartY > swipeEndY) {
                    this.handleEvent(InputHandler.CONTROLS.MOVE_NORTH);
                } else {
                    this.handleEvent(InputHandler.CONTROLS.MOVE_SOUTH);
                }
            }
            swipeStartX = 0;
            swipeStartY = 0;
        });
    }

    bindKeyboard() {
        document.addEventListener('keyup', ({target, key}) => {
            if (!Object.keys(InputHandler.CONTROLS).includes(target.getAttribute('id'))) {
                this.handleEvent(key);
            }
        });
    }

    handleEvent(key) {
        if ([InputHandler.CONTROLS.MOVE_NORTH, InputHandler.CONTROLS.MOVE_EAST, InputHandler.CONTROLS.MOVE_SOUTH, InputHandler.CONTROLS.MOVE_WEST].includes(key)) {
            let x, y, next;
            switch (key) {
                case InputHandler.CONTROLS.MOVE_NORTH:
                    [x, y] = this.map.findTiles(0, 0, null, null, Player.name)[0];
                    next = this.map.move(x, y, x, y - 1);
                    break;
                case InputHandler.CONTROLS.MOVE_EAST:
                    [x, y] = this.map.findTiles(0, 0, null, null, Player.name)[0];
                    next = this.map.move(x, y, x + 1, y);
                    break;
                case InputHandler.CONTROLS.MOVE_SOUTH:
                    [x, y] = this.map.findTiles(0, 0, null, null, Player.name)[0];
                    next = this.map.move(x, y, x, y + 1);
                    break;
                case InputHandler.CONTROLS.MOVE_WEST:
                    [x, y] = this.map.findTiles(0, 0, null, null, Player.name)[0];
                    next = this.map.move(x, y, x - 1, y);
                    break;
            }

            if (next instanceof Exit) {
                alert('Win!');
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
