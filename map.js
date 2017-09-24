class Map {
    constructor(tiles) {
        this.tiles = tiles;
        this.wall = new Wall();
        this.floor = new Floor();
    }

    static generate(width = 40, height = 40) {
        const placeHolder = new Floor();
        const mapPadding = 2;
        const roomMin = 5;
        const roomMax = 10;
        const tiles = new Array(height).fill(undefined);
        iterate2d(0, 0, width, height, (x, y) => {
            tiles[y] = tiles[y] || [];
            tiles[y][x] = placeHolder;
        });
        const map = new Map(tiles);
        map.findTiles().forEach(([x, y]) => map.spawn(map.wall, x, y));
        const rooms = [];

        const roomCount = Math.floor(Math.random() * 4) + 10;
        let iterations = 1000;
        while (--iterations >= 0 && rooms.length < roomCount) {
            const x1 = Math.max(mapPadding, Math.floor(Math.random() * width - roomMin - mapPadding));
            const y1 = Math.max(mapPadding, Math.floor(Math.random() * height - roomMin - mapPadding));
            const x2 = Math.min(width - mapPadding, x1 + Math.floor(Math.random() * roomMax));
            const y2 = Math.min(height - mapPadding, y1 + Math.floor(Math.random() * roomMax));
            const w = x2 - x1;
            const h = y2 - y1;
            const roomTiles = map.findTiles(x1, y1, x2, y2);
            const intersecting = rooms.reduce((intersecting, [i1, j1, i2, j2]) => {
                return intersecting || (i1 - 1 < x2 && i2 + 1 > x1 && j1 - 1 < y2 && j2 + 1 > y1);
            }, false);
            if (w > roomMin && h > roomMin && roomTiles.length === 0 && !intersecting) {
                rooms.push([x1, y1, x2, y2]);
                iterate2d(x1, y1, x2, y2, map.spawn.bind(map, map.floor));
            }
        }

        const [x1, y1] = [
            Math.floor(width / 2),
            Math.floor(height / 2),
        ];
        rooms.forEach(([i1, j1, i2, j2]) => {
            const [x2, y2] = [
                Math.round((i2 - i1) / 2) + i1,
                Math.round((j2 - j1) / 2) + j1,
            ];
            for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
                map.spawn(map.floor, x, Math.min(y1, y2));
                map.spawn(map.floor, x, Math.max(y1, y2));
            }
            for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                map.spawn(map.floor, Math.min(x1, x2), y);
                map.spawn(map.floor, Math.max(x1, x2), y);
            }
        });

        map.spawn(new Player());
        map.spawn(new Exit());

        return map;
    }

    findTiles(x1 = 0, y1 = 0, x2 = null, y2 = null, type = Floor.name) {
        x2 = Math.min(x2 || this.tiles[0].length, this.tiles[0].length);
        y2 = Math.min(y2 || this.tiles.length, this.tiles.length);
        x1 = Math.min(Math.max(x1, 0), x2);
        y1 = Math.min(Math.max(y1, 0), y2);
        return this.tiles.slice(y1, y2).reduce((acc, row, y) => {
            return row.slice(x1, x2).reduce((acc, entity, x) => {
                return entity.constructor.name === type ? acc.concat([[x, y]]) : acc;
            }, acc);
        }, []);
    }

    spawn(entity, x, y) {
        if (x === undefined && y === undefined) {
            const floorSpace = this.findTiles();
            const [i, j] = floorSpace[Math.floor(Math.random() * floorSpace.length)];
            x = i;
            y = j;
        }

        this.tiles[y][x] = entity;

        return entity;
    }

    move(x1, y1, x2, y2) {
        const entity = this.tiles[y1][x1];
        if (this.tiles[y2][x2] instanceof Floor) {
            this.tiles[y2][x2] = entity;
            this.tiles[y1][x1] = this.floor;
        }
       
        return this.tiles[y2][x2];
    }
}
