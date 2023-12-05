// monsterkodi/kode 0.243.0

var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var Player


Player = (function ()
{
    function Player (opt)
    {
        var _13_26_

        this.mesh = ((_13_26_=(opt != null ? opt.mesh : undefined)) != null ? _13_26_ : new Mesh(Geom.roundedBox({size:[6,6,6],pos:[0,0,3],radius:1}),Materials.player))
        this.mesh.setShadow()
        this.left = 0
        this.right = 0
        this.forward = 0
        this.backward = 0
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
        return Vector.unitY.clone().applyQuaternion(this.mesh.quaternion)
    }

    Player.prototype["getLandscapeIntersection"] = function ()
    {
        var direction, info, intersect, intersects, origin

        origin = this.mesh.position.clone()
        origin.z += 1000
        direction = vec(0,0,-1)
        rts.raycaster.set(origin,direction)
        intersects = rts.raycaster.intersectObjects(world.pickables,true)
        intersects = intersects.filter(function (i)
        {
            return i.object.noHitTest !== true
        })
        intersect = intersects[0]
        if (!intersect)
        {
            direction.negate()
            rts.raycaster.set(origin,direction)
            intersects = rts.raycaster.intersectObjects(world.pickables,true)
            intersects = intersects.filter(function (i)
            {
                return i.object.noHitTest !== true
            })
            intersect = intersects[0]
        }
        if (!intersect)
        {
            return {name:'none',point:origin,norm:direction.negated(),dist:0}
        }
        info = {name:intersect.object.name,point:vec(intersect.point),norm:vec(intersect.normal),dist:intersect.distance}
        return info
    }

    Player.prototype["animate"] = function (scaledDelta, delta)
    {
        var forward, forwardNorm, info, m, right, rightNorm, up

        this.mesh.translateY(2 * (this.forward - this.backward) * scaledDelta)
        info = this.getLandscapeIntersection()
        this.mesh.position.copy(info.point)
        this.mesh.rotateZ(deg2rad(50 * (this.left - this.right) * delta))
        up = Vector.unitZ.clone().applyQuaternion(this.mesh.quaternion)
        right = Vector.unitX.clone().applyQuaternion(this.mesh.quaternion)
        forward = Vector.unitY.clone().applyQuaternion(this.mesh.quaternion)
        forwardNorm = forward.projectOnPlane(info.norm)
        forwardNorm.normalize()
        rightNorm = right.projectOnPlane(info.norm)
        rightNorm.normalize()
        m = new THREE.Matrix4
        m.makeBasis(rightNorm,forwardNorm,info.norm)
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