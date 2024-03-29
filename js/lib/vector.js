// monsterkodi/kode 0.245.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var rad2deg, randRange, ThreeVector

rad2deg = require('kxk').rad2deg
randRange = require('kxk').randRange

ThreeVector = THREE.Vector3
class Vector extends ThreeVector
{
    static counter = 0

    static tmp = new Vector

    static tmp1 = new Vector

    static tmp2 = new Vector

    static tmp3 = new Vector

    constructor (x = 0, y = 0, z = 0)
    {
        var _25_14_, _25_23_, _26_67_, _28_70_

        Vector.counter += 1
        if ((x.x != null) && (x.y != null))
        {
            super(parseFloat(x.x),parseFloat(x.y),parseFloat(((_26_67_=x.z) != null ? _26_67_ : 0)))
        }
        else if (Array.isArray(x))
        {
            super(parseFloat(x[0]),parseFloat(x[1]),parseFloat(((_28_70_=x[2]) != null ? _28_70_ : 0)))
        }
        else
        {
            super(parseFloat(x),parseFloat(y),parseFloat((z != null ? z : 0)))
        }
        if (Number.isNaN(this.x))
        {
            throw new Error
        }
    }

    copy (v)
    {
        var _39_17_

        this.x = v.x
        this.y = v.y
        this.z = ((_39_17_=v.z) != null ? _39_17_ : 0)
        return this
    }

    rotate (axis, angle)
    {
        var Quaternion

        Quaternion = require('./quaternion')
        this.applyQuaternion(Quaternion.axisAngle(axis,angle))
        return this
    }

    crossed (v)
    {
        Vector.tmp.copy(this)
        return Vector.tmp.cross(v)
    }

    cross (v)
    {
        return this.crossVectors(this,v)
    }

    normalize ()
    {
        var l

        l = this.length()
        if (l)
        {
            l = 1.0 / l
            this.x *= l
            this.y *= l
            this.z *= l
        }
        return this
    }

    round ()
    {
        this.x = Math.round(this.x)
        this.y = Math.round(this.y)
        this.z = Math.round(this.z)
        return this
    }

    equals (o)
    {
        return this.manhattan(o) < 0.001
    }

    same (o)
    {
        var z

        return this.x === o.x && this.y === o.y && (z = o.z)
    }

    faded (o, val)
    {
        return this.clone().fade(o,val)
    }

    fade (o, val)
    {
        this.x = this.x * (1 - val) + o.x * val
        this.y = this.y * (1 - val) + o.y * val
        this.z = this.z * (1 - val) + o.z * val
        return this
    }

    paris (o)
    {
        var m

        m = [Math.abs(o.x - this.x),Math.abs(o.y - this.y),Math.abs(o.z - this.z)]
        m.sort(function (a, b)
        {
            return b - a
        })
        return m[0] + 0.2 * m[1] + 0.1 * m[2]
    }

    manhattan (o)
    {
        return Math.abs(o.x - this.x) + Math.abs(o.y - this.y) + Math.abs(o.z - this.z)
    }

    length ()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    dot (v)
    {
        return this.x * v.x + this.y * v.y + this.z * v.z
    }

    dist (o)
    {
        Vector.tmp.copy(this)
        return Vector.tmp.sub(o).length()
    }

    angle (v)
    {
        var l, o, p, q, r, x, y, z

        if (l = this.length())
        {
            if (o = v.length())
            {
                x = this.x / l
                y = this.y / l
                z = this.z / l
                p = v.x / o
                q = v.y / o
                r = v.z / o
                return rad2deg(Math.acos(x * p + y * q + z * r))
            }
        }
        return 0
    }

    negate ()
    {
        return this.multiplyScalar(-1)
    }

    negated ()
    {
        return this.clone().multiplyScalar(-1)
    }

    times (f)
    {
        return this.multiplyScalar(f)
    }

    scale (f)
    {
        return this.multiplyScalar(f)
    }

    scaled (f)
    {
        return this.clone().scale(f)
    }

    reset ()
    {
        this.x = this.y = this.z = 0
        return this
    }

    isZero ()
    {
        return (this.x === this.y && (this.y === this.z && this.z === 0))
    }

    randomize ()
    {
        this.set(randRange(-1,1),randRange(-1,1),randRange(-1,1))
        this.normalize()
        return this
    }

    static rayPlaneIntersection (rayPos, rayDirection, planePos, planeNormal)
    {
        var x

        x = planePos.minus(rayPos).dot(planeNormal) / rayDirection.dot(planeNormal)
        return rayPos.plus(rayDirection.mul(x))
    }

    static pointMappedToPlane (point, planePos, planeNormal)
    {
        return point.minus(planeNormal).dot(point.minus(planePos).dot(planeNormal))
    }

    static PX = 0

    static PY = 1

    static PZ = 2

    static NX = 3

    static NY = 4

    static NZ = 5

    static unitX = new Vector(1,0,0)

    static unitY = new Vector(0,1,0)

    static unitZ = new Vector(0,0,1)

    static minusX = new Vector(-1,0,0)

    static minusY = new Vector(0,-1,0)

    static minusZ = new Vector(0,0,-1)

    static normals = [Vector.unitX,Vector.unitY,Vector.unitZ,Vector.minusX,Vector.minusY,Vector.minusZ]

    static perpNormals (v)
    {
        var i

        i = this.normalIndex(v)
        switch (i)
        {
            case this.PX:
                return [this.unitY,this.unitZ,this.minusY,this.minusZ]

            case this.PY:
                return [this.minusX,this.unitZ,this.unitX,this.minusZ]

            case this.PZ:
                return [this.unitY,this.minusX,this.minusY,this.unitX]

            case this.NX:
                return [this.unitY,this.minusZ,this.minusY,this.unitZ]

            case this.NY:
                return [this.minusX,this.minusZ,this.unitX,this.unitZ]

            case this.NZ:
                return [this.unitY,this.unitX,this.minusY,this.minusX]

        }

    }

    static normalIndex (v)
    {
        var cn, i

        cn = this.closestNormal(v)
        for (i = 0; i < 6; i++)
        {
            if (Vector.normals[i].equals(cn))
            {
                return i
            }
        }
        return -1
    }

    static closestNormal (v)
    {
        var angles, n

        Vector.tmp.copy(v)
        Vector.tmp.normalize()
        angles = []
        var list = _k_.list(Vector.normals)
        for (var _219_14_ = 0; _219_14_ < list.length; _219_14_++)
        {
            n = list[_219_14_]
            if (n.equals(Vector.tmp))
            {
                return n
            }
            angles.push([n.angle(Vector.tmp),n])
        }
        angles.sort(function (a, b)
        {
            return a[0] - b[0]
        })
        return angles[0][1]
    }

    static midPoint (a, b, f = 0.5)
    {
        var m

        m = b.minus(a)
        m.scale(f)
        return m.add(a)
    }
}

module.exports = Vector