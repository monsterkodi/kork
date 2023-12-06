// monsterkodi/kode 0.243.0

var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var ColorGrid, Player

ColorGrid = require('../lib/ColorGrid')

Player = (function ()
{
    function Player (opt)
    {
        var geom, _15_26_

        this.mesh = ((_15_26_=(opt != null ? opt.mesh : undefined)) != null ? _15_26_ : new Mesh(Geom.roundedBox({size:[6,6,6],pos:[0,0,3],radius:1}),Materials.player))
        this.mesh.setShadow()
        this.grid = new ColorGrid({size:3.5,gridSize:8})
        this.grid.quads.rotateX(deg2rad(90))
        this.grid.quads.position.set(0,-2.1,3)
        this.columns = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]]
        this.mesh.add(this.grid.quads)
        geom = Geom.box({size:4})
        geom.translate(0,0,3)
        this.box = new Mesh(geom,Materials.shinyblack)
        this.box.setShadow(true)
        this.mesh.add(this.box)
        this.left = 0
        this.right = 0
        this.forward = 0
        this.backward = 0
        this.vecs = {up:vec(0,0,1),right:vec(1,0,0),forward:vec(0,1,0)}
    }

    Player.prototype["onPointerLock"] = function (x, y, event)
    {
        if (this.backward > 0)
        {
            this.backward += y * 0.01
        }
        else if (this.forward > 0)
        {
            this.forward -= y * 0.01
        }
        else
        {
            if (y > 0)
            {
                this.backward += y * 0.01
                this.forward = 0
            }
            else
            {
                this.forward -= y * 0.01
                this.backward = 0
            }
        }
        if (this.right > 0)
        {
            this.right += x * 0.005
        }
        else if (this.left > 0)
        {
            this.left -= x * 0.005
        }
        else
        {
            if (x > 0)
            {
                this.right += x * 0.005
                this.left = 0
            }
            else
            {
                this.left -= x * 0.005
                this.right = 0
            }
        }
        this.left = _k_.clamp(0,1,this.left)
        this.right = _k_.clamp(0,1,this.right)
        this.forward = _k_.clamp(0,2,this.forward)
        this.backward = _k_.clamp(0,2,this.backward)
        return 0
    }

    Player.prototype["getForward"] = function ()
    {
        return vec(this.vecs.forward)
    }

    Player.prototype["animate"] = function (scaledDelta, delta)
    {
        var forwardNorm, m, norm, rightNorm

        this.mesh.translateY(2 * (this.forward - this.backward) * scaledDelta)
        this.mesh.position.z = world.landscapeHeight(this.mesh.position)
        this.columns[randInt(8)][randInt(8)] = randInt(5)
        this.grid.setColumns(this.columns)
        this.mesh.rotateZ(deg2rad(50 * (this.left - this.right) * delta))
        this.vecs.right.copy(Vector.unitX)
        this.vecs.right.applyQuaternion(this.mesh.quaternion)
        this.vecs.forward.copy(Vector.unitY)
        this.vecs.forward.applyQuaternion(this.mesh.quaternion)
        norm = world.landscapeNormal(this.mesh.position)
        forwardNorm = this.vecs.forward.projectOnPlane(norm)
        forwardNorm.normalize()
        rightNorm = this.vecs.right.projectOnPlane(norm)
        rightNorm.normalize()
        m = new THREE.Matrix4
        m.makeBasis(rightNorm,forwardNorm,norm)
        return this.mesh.setRotationFromMatrix(m)
    }

    Player.prototype["moveForward"] = function (by = 1)
    {
        return this.forward = by
    }

    Player.prototype["moveBackward"] = function (by = 1)
    {
        return this.backward = by
    }

    Player.prototype["turnLeft"] = function (by = 1)
    {
        return this.left = by
    }

    Player.prototype["turnRight"] = function (by = 1)
    {
        return this.right = by
    }

    Player.prototype["stopForward"] = function ()
    {
        return this.forward = 0
    }

    Player.prototype["stopBackward"] = function ()
    {
        return this.backward = 0
    }

    Player.prototype["stopLeft"] = function ()
    {
        return this.left = 0
    }

    Player.prototype["stopRight"] = function ()
    {
        return this.right = 0
    }

    Player.prototype["onKeyDown"] = function (combo)
    {
        switch (combo)
        {
            case 'w':
            case 'up':
                return this.moveForward()

            case 's':
            case 'down':
                return this.moveBackward()

            case 'a':
            case 'left':
                return this.turnLeft()

            case 'd':
            case 'right':
                return this.turnRight()

        }

        return 'unhandled'
    }

    Player.prototype["onKeyUp"] = function (combo)
    {
        switch (combo)
        {
            case 'w':
            case 'up':
                return this.stopForward()

            case 's':
            case 'down':
                return this.stopBackward()

            case 'a':
            case 'left':
                return this.stopLeft()

            case 'd':
            case 'right':
                return this.stopRight()

        }

        return 'unhandled'
    }

    return Player
})()

module.exports = Player