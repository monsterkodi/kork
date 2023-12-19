// monsterkodi/kode 0.245.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var Enemies


Enemies = (function ()
{
    function Enemies (world)
    {
        this.world = world
    
        this.enemies = []
        this.matrix = new Matrix4
        this.scaleVec = vec()
        this.repulsionVec = vec()
        this.maxCount = 1500
        this.mesh = new InstancedMesh(Geom.sphere({radius:1}),Materials.enemy,this.maxCount)
        this.mesh.count = 0
        this.mesh.setShadow()
    }

    Enemies.prototype["num"] = function ()
    {
        return this.mesh.count
    }

    Enemies.prototype["add"] = function (enemy)
    {
        if (this.mesh.count < this.maxCount)
        {
            this.enemies.push(enemy)
            enemy.index = this.num()
            this.mesh.count++
            this.mesh.getMatrixAt(enemy.index,this.matrix)
            this.scaleVec.set(enemy.scale,enemy.scale,enemy.scale)
            this.matrix.scale(this.scaleVec)
            this.mesh.setMatrixAt(enemy.index,this.matrix)
            return this.mesh.instanceMatrix.needsUpdate = true
        }
    }

    Enemies.prototype["setPosition"] = function (index, x, y, z)
    {
        this.mesh.getMatrixAt(index,this.matrix)
        this.matrix.setPosition(x,y,z)
        this.mesh.setMatrixAt(index,this.matrix)
        return this.mesh.instanceMatrix.needsUpdate = true
    }

    Enemies.prototype["setColor"] = function (index, color)
    {
        this.mesh.setColorAt(index,color)
        return this.mesh.instanceColor.needsUpdate = true
    }

    Enemies.prototype["clonePosition"] = function (index, position)
    {
        this.mesh.getMatrixAt(index,this.matrix)
        return position.setFromMatrixPosition(this.matrix)
    }

    Enemies.prototype["rasterize"] = function (raster = 10)
    {
        var enemies, enemy, key, _68_29_

        this.rasterized = {}
        var list = _k_.list(this.enemies)
        for (var _66_18_ = 0; _66_18_ < list.length; _66_18_++)
        {
            enemy = list[_66_18_]
            key = this.rasterKeyForEnemy(enemy,raster)
            this.rasterized[key] = ((_68_29_=this.rasterized[key]) != null ? _68_29_ : [])
            this.rasterized[key].push(enemy.index)
        }
        for (key in this.rasterized)
        {
            enemies = this.rasterized[key]
            if (enemies.length > 100)
            {
                console.log(key,enemies.length)
            }
        }
    }

    Enemies.prototype["rasterKeyForEnemy"] = function (enemy, raster = 10)
    {
        return `${floor(enemy.position.x / raster)} ${floor(enemy.position.y / raster)}`
    }

    Enemies.prototype["distanceBetween"] = function (enemyA, enemyB)
    {
        return enemyA.position.distanceTo(enemyB.position)
    }

    Enemies.prototype["repulsionVector"] = function (enemyA, enemyB)
    {
        this.repulsionVec.copy(enemyA.position)
        this.repulsionVec.sub(enemyB.position)
        this.repulsionVec.normalize()
        this.repulsionVec.scale(0.1 * (enemyA.scale + enemyB.scale))
        return this.repulsionVec
    }

    Enemies.prototype["getClosestEnemy"] = function (enemy)
    {
        var closest, dist, key, minDist, other, otherIndex

        minDist = Infinity
        key = this.rasterKeyForEnemy(enemy)
        var list = _k_.list(this.rasterized[key])
        for (var _102_23_ = 0; _102_23_ < list.length; _102_23_++)
        {
            otherIndex = list[_102_23_]
            if (otherIndex === enemy.index)
            {
                continue
            }
            other = this.enemies[otherIndex]
            dist = this.distanceBetween(enemy,other)
            if (dist < minDist)
            {
                minDist = dist
                closest = other
            }
        }
        return closest
    }

    Enemies.prototype["animate"] = function (scaledDelta, delta)
    {
        var enemy

        this.rasterize()
        var list = _k_.list(this.enemies)
        for (var _121_18_ = 0; _121_18_ < list.length; _121_18_++)
        {
            enemy = list[_121_18_]
            enemy.calcPosition()
        }
        var list1 = _k_.list(this.enemies)
        for (var _124_18_ = 0; _124_18_ < list1.length; _124_18_++)
        {
            enemy = list1[_124_18_]
            enemy.calcPlayerAttraction(scaledDelta)
        }
        var list2 = _k_.list(this.enemies)
        for (var _127_18_ = 0; _127_18_ < list2.length; _127_18_++)
        {
            enemy = list2[_127_18_]
            enemy.calcRepulsion()
        }
        var list3 = _k_.list(this.enemies)
        for (var _130_18_ = 0; _130_18_ < list3.length; _130_18_++)
        {
            enemy = list3[_130_18_]
            enemy.animate(scaledDelta,delta)
        }
    }

    return Enemies
})()

module.exports = Enemies