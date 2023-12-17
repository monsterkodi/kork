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

    Enemies.prototype["animate"] = function (scaledDelta, delta)
    {
        var enemy

        var list = _k_.list(this.enemies)
        for (var _58_18_ = 0; _58_18_ < list.length; _58_18_++)
        {
            enemy = list[_58_18_]
            enemy.animate(scaledDelta,delta)
        }
    }

    return Enemies
})()

module.exports = Enemies