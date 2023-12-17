// monsterkodi/kode 0.245.0

var _k_

var Enemy, World

World = require('./world')
Enemy = require('../enemy/enemy')
class Map extends World
{
    create ()
    {
        var enemy, enemyRadius, n

        enemyRadius = 500
        for (var _17_17_ = n = 0, _17_21_ = world.enemies.maxCount; (_17_17_ <= _17_21_ ? n < world.enemies.maxCount : n > world.enemies.maxCount); (_17_17_ <= _17_21_ ? ++n : --n))
        {
            enemy = new Enemy(this)
            enemy.setPosition(randInt(enemyRadius * 2) - enemyRadius,randInt(enemyRadius * 2) - enemyRadius)
        }
    }
}

module.exports = Map