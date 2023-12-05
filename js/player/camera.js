// monsterkodi/kode 0.243.0

var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var PerspectiveCamera, post, prefs, Quaternion, reduce, THREE

clamp = require('kxk').clamp
post = require('kxk').post
prefs = require('kxk').prefs
reduce = require('kxk').reduce

THREE = require('three')
Quaternion = require('../lib/quaternion')
PerspectiveCamera = THREE.PerspectiveCamera
class PlayerCamera extends PerspectiveCamera
{
    constructor (opt)
    {
        super(70,width / height,1,10000)
    
        var height, width

        this.setDistFactor = this.setDistFactor.bind(this)
        this.inertZoom = this.inertZoom.bind(this)
        this.onMouseWheel = this.onMouseWheel.bind(this)
        this.pivotCenter = this.pivotCenter.bind(this)
        this.del = this.del.bind(this)
        width = opt.view.clientWidth
        height = opt.view.clientHeight
        this.fov = 70
        this.size = vec(width,height)
        this.elem = opt.view
        this.dist = 30
        this.maxDist = this.far / 2
        this.minDist = this.near * 2
        this.center = vec()
        this.degree = -10
        this.rotate = 0
        this.wheelInert = 0
        this.pivotX = 0
        this.pivotY = 0
        this.mouse = vec()
        this.downPos = vec()
        this.centerTarget = vec()
        this.quat = quat()
        this.elem.addEventListener('mousewheel',this.onMouseWheel)
    }

    setPlayer (player)
    {
        this.player = player
    
        return this.update(1)
    }

    getPosition ()
    {
        return vec(this.position)
    }

    getDir ()
    {
        return quat(this.quaternion).rotate(Vector.minusZ)
    }

    getUp ()
    {
        return quat(this.quaternion).rotate(Vector.unitY)
    }

    getRight ()
    {
        return quat(this.quaternion).rotate(Vector.unitX)
    }

    del ()
    {
        return this.elem.removeEventListener('mousewheel',this.onMouseWheel)
    }

    onKeyDown (combo)
    {
        switch (combo)
        {
            case 'r':
                return this.startPivotDown()

            case 'v':
                return this.startPivotUp()

        }

        return 'unhandled'
    }

    onKeyUp (combo)
    {
        switch (combo)
        {
            case 'r':
            case 'v':
                return this.stopPivot()

        }

        return 'unhandled'
    }

    pivot (y)
    {
        return this.degree += y
    }

    startPivotUp ()
    {
        this.pivotY = 1
        return this.startPivot()
    }

    startPivotDown ()
    {
        this.pivotY = -1
        return this.startPivot()
    }

    stopPivot ()
    {
        this.pivoting = false
        return this.pivotY = 0
    }

    startPivot ()
    {
        if (!this.pivoting)
        {
            rts.animate(this.pivotCenter)
            return this.pivoting = true
        }
    }

    pivotCenter (deltaSeconds)
    {
        if (!this.pivoting)
        {
            return
        }
        this.pivot(this.pivotY)
        return rts.animate(this.pivotCenter)
    }

    onMouseWheel (event)
    {
        if (this.wheelInert > 0 && event.wheelDelta < 0)
        {
            this.wheelInert = 0
            return
        }
        if (this.wheelInert < 0 && event.wheelDelta > 0)
        {
            this.wheelInert = 0
            return
        }
        if (Math.abs(this.wheelInert) < 0.0001)
        {
            this.wheelInert += event.wheelDelta * (1 + (this.dist / this.maxDist) * 3) * 0.00005
        }
        else
        {
            this.wheelInert += event.wheelDelta * (1 + (this.dist / this.maxDist) * 3) * 0.0002
        }
        if (Math.abs(this.wheelInert) > 0.00003)
        {
            return this.startZoom()
        }
    }

    startZoomIn ()
    {
        this.wheelInert = (1 + (this.dist / this.maxDist) * 3) * 10
        return this.startZoom()
    }

    startZoomOut ()
    {
        this.wheelInert = -(1 + (this.dist / this.maxDist) * 3) * 10
        return this.startZoom()
    }

    startZoom ()
    {
        if (!this.zooming)
        {
            rts.animate(this.inertZoom)
            return this.zooming = true
        }
    }

    stopZoom ()
    {
        this.wheelInert = 0
        return this.zooming = false
    }

    inertZoom (deltaSeconds)
    {
        this.setDistFactor(1 - _k_.clamp(-0.02,0.02,this.wheelInert))
        this.wheelInert = reduce(this.wheelInert,deltaSeconds * 0.3)
        if (Math.abs(this.wheelInert) > 0.00000001)
        {
            return rts.animate(this.inertZoom)
        }
        else
        {
            delete this.zooming
            return this.wheelInert = 0
        }
    }

    setDistFactor (factor)
    {
        return this.dist = _k_.clamp(this.minDist,this.maxDist,this.dist * factor)
    }

    setFov (fov)
    {
        return this.fov = _k_.clamp(2.0,175.0,fov)
    }

    storePrefs ()
    {
        return prefs.set('playerCamera',{degree:this.degree,rotate:this.rotate,dist:this.dist,center:{x:this.centerTarget.x,y:this.centerTarget.y,z:this.centerTarget.z}})
    }

    update (delta)
    {
        var cameraForward, playerForward, rotquat, smoothForward, smoothRight, _203_18_, _220_27_

        this.degree = _k_.clamp(-25,-70,this.degree)
        if ((this.player != null ? this.player.mesh.position : undefined))
        {
            playerForward = this.player.getForward().projectOnPlane(Vector.unitZ)
            cameraForward = this.getDir().projectOnPlane(Vector.unitZ)
            smoothForward = cameraForward.lerp(playerForward,delta * 1.2)
            smoothRight = smoothForward.crossed(Vector.unitZ)
            rotquat = Quaternion.axisAngle(smoothRight,this.degree)
            Vector.tmp.copy(smoothForward.negate().scale(this.dist))
            Vector.tmp.applyQuaternion(rotquat)
            Vector.tmp.add(this.player.mesh.position)
            this.position.lerp(Vector.tmp,1)
            this.up.set(0,0,1)
            return this.lookAt((this.player != null ? this.player.mesh.position : undefined))
        }
    }
}

module.exports = PlayerCamera