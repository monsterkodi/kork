// monsterkodi/kode 0.245.0

var _k_

var Enemy, World

World = require('./world')
Enemy = require('../enemy/enemy')
class Map extends World
{
    create ()
    {
        var enemy, n

        for (var _16_17_ = n = 0, _16_21_ = world.enemies.maxCount; (_16_17_ <= _16_21_ ? n < world.enemies.maxCount : n > world.enemies.maxCount); (_16_17_ <= _16_21_ ? ++n : --n))
        {
            enemy = new Enemy(this)
            enemy.setPosition(randInt(2000) - 1000,randInt(2000) - 1000)
        }
    }
}

module.exports = Map