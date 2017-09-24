class Entity {
    constructor(symbol = '?', health = 0, str = 0) {
        this.name = this.constructor.name;
        this.maxHealth = this.health = health;
        this.strength = str;
        this.symbol = symbol;
        this.sight = 0;
        this.facing = Entity.FACING.N;
    }
}

Entity.FACING = {
    N: 1,
    E: 2,
    S: 3,
    W: 4,
};

class Floor extends Entity {
    constructor() {
        super('.');
    }
}

class Wall extends Entity {
    constructor() {
        super('[]');
    }
}

class Player extends Entity {
    constructor() {
        super('@');
        this.sight = 5;
    }
}

class Exit extends Entity {
    constructor() {
        super('#');
    }
}
