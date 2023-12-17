// monsterkodi/kode 0.245.0

var _k_

var Enemy


Enemy = (function ()
{
    function Enemy (world)
    {
        this.world = world
    
        this.scale = randRange(1,3)
        this.world.enemies.add(this)
    }

    Enemy.prototype["setPosition"] = function (x, y)
    {
        var z

        z = this.world.heightAt(x,y)
        return this.world.enemies.setPosition(this.index,x,y,z + this.scale)
    }

    return Enemy
})()

module.exports = Enemy