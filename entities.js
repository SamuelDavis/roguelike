class Entity {
    constructor(symbol = '?', health = 0, str = 0) {
        this.name = this.constructor.name;
        this.maxHealth = this.health = health;
        this.strength = str;
        this.symbol = symbol;
    }
}

class Floor extends Entity {
    constructor() {
        super(' ');
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
    }
}

class Exit extends Entity {
    constructor() {
        super('#');
    }
}
