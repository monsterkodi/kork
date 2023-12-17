// monsterkodi/kode 0.245.0

var _k_

var Enemies


Enemies = (function ()
{
    function Enemies (world)
    {
        this.world = world
    
        this.matrix = new Matrix4
        this.scaleVec = vec()
        this.maxCount = 1000
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

    return Enemies
})()

module.exports = Enemies