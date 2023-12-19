// monsterkodi/kode 0.245.0

var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var Enemy


Enemy = (function ()
{
    function Enemy (world)
    {
        this.world = world
    
        this.scale = randRange(1,4)
        this.position = vec()
        this.world.enemies.add(this)
        this.playerDist = 0
        this.wobbleAccum = 0
        this.color = new Color(1,0,0)
    }

    Enemy.prototype["setPosition"] = function (x, y)
    {
        var z

        z = this.world.heightAt(x,y)
        return this.world.enemies.setPosition(this.index,x,y,z + this.scale)
    }

    Enemy.prototype["calcPosition"] = function ()
    {
        this.world.enemies.clonePosition(this.index,this.position)
        this.playerDist = this.world.player.getPosition().distanceTo(this.position)
        this.l1 = _k_.clamp(0,1,this.playerDist / 400)
        this.l2 = _k_.clamp(0,1,this.playerDist / 150)
        return this.position
    }

    Enemy.prototype["calcPlayerAttraction"] = function (scaledDelta)
    {
        this.wobbleAccum += (1 - this.l2) * scaledDelta
        return this.position.lerp(this.world.player.getPosition(),0.01 * (1 - this.l2))
    }

    Enemy.prototype["calcRepulsion"] = function ()
    {
        var closest, dist

        if (this.l2 > 0.99)
        {
            return
        }
        if (closest = this.world.enemies.getClosestEnemy(this))
        {
            dist = this.world.enemies.distanceBetween(this,closest)
            if (dist < 1.0 * (this.scale + closest.scale))
            {
                return this.position.add(this.world.enemies.repulsionVector(this,closest))
            }
        }
    }

    Enemy.prototype["animate"] = function (scaledDelta)
    {
        var o, upDownWobble, z

        this.color.copy(Colors.enemy)
        this.color.lerp(Colors.landscape,this.l2)
        this.world.enemies.setColor(this.index,this.color)
        z = this.world.heightAt(this.position.x,this.position.y)
        z -= this.scale
        o = (3 * this.scale) * (1 - this.l1)
        o = _k_.clamp(0,2 * this.scale,o)
        upDownWobble = 0.4 * this.scale * abs(sin(1 * this.wobbleAccum))
        return this.world.enemies.setPosition(this.index,this.position.x,this.position.y,z + o + upDownWobble)
    }

    return Enemy
})()

module.exports = Enemy