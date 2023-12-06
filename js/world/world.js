// monsterkodi/kode 0.243.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var Landscape, Physics, Player, Save, World

Landscape = require('./landscape')
Physics = require('./physics')
Player = require('../player/player')
Save = require('./save')

World = (function ()
{
    _k_.extend(World, Landscape)
    function World (scene)
    {
        this.scene = scene
    
        this["tidyUp"] = this["tidyUp"].bind(this)
        this["setLabels"] = this["setLabels"].bind(this)
        this["getLabels"] = this["getLabels"].bind(this)
        this["toggleLabels"] = this["toggleLabels"].bind(this)
        World.__super__.constructor.call(this)
        this.init()
        window.world = this
        this.animations = []
        this.labels = []
        this.pickables = []
        this.timeSum = 0
        this.save = new Save
        this.physics = new Physics
        this.player = new Player
        this.setSpeed(Param.get('speed'))
        this.addLabel({text:"Hello",size:100,mono:true,position:[0,0,5]})
        this.setLabels(true)
        this.addObject(this.player.mesh)
        this.addMesh(this.landscape)
        rts.playerCamera.setPlayer(this.player)
    }

    World.prototype["addLabel"] = function (cfg)
    {
        var label, _50_34_, _52_45_, _53_32_

        label = new Text()
        label.text = cfg.text
        label.fontSize = ((_50_34_=cfg.size) != null ? _50_34_ : 1)
        label.font = '../pug/' + ((cfg.mono ? 'Meslo.woff' : 'Bahnschrift.woff'))
        label.position.copy(vec(((_52_45_=cfg.position) != null ? _52_45_ : 0)))
        label.color = ((_53_32_=cfg.color) != null ? _53_32_ : 0x9966FF)
        label.anchorX = 'center'
        label.anchorY = 'middle'
        label.noHitTest = true
        label.depthOffset = -0.1
        label.visible = this.getLabels()
        label.sync()
        this.labels.push(label)
        return label
    }

    World.prototype["toggleLabels"] = function ()
    {
        return this.setLabels(!this.getLabels())
    }

    World.prototype["getLabels"] = function ()
    {
        return prefs.get('labels')
    }

    World.prototype["setLabels"] = function (on = true)
    {
        var label

        prefs.set('labels',on)
        var list = _k_.list(this.labels)
        for (var _67_18_ = 0; _67_18_ < list.length; _67_18_++)
        {
            label = list[_67_18_]
            label.visible = on
        }
    }

    World.prototype["addAnimation"] = function (func)
    {
        return this.animations.push(func)
    }

    World.prototype["removeAnimation"] = function (func)
    {
        var index

        if ((index = this.animations.indexOf(func)) >= 0)
        {
            return this.animations.splice(index,1)
        }
    }

    World.prototype["animate"] = function (delta)
    {
        var animation, oldAnimations, scaledDelta

        if (!delta)
        {
            return
        }
        scaledDelta = delta * this.speed
        this.timeSum += scaledDelta
        oldAnimations = this.animations.clone()
        this.animations = []
        var list = _k_.list(oldAnimations)
        for (var _93_22_ = 0; _93_22_ < list.length; _93_22_++)
        {
            animation = list[_93_22_]
            animation(scaledDelta,this.timeSum)
        }
        this.physics.simulate(scaledDelta,this.timeSum)
        return this.player.animate(scaledDelta,delta)
    }

    World.prototype["create"] = function ()
    {}

    World.prototype["clear"] = function ()
    {
        return this.physics.clear()
    }

    World.prototype["setSpeed"] = function (speedIndex)
    {
        this.speedIndex = _k_.clamp(0,config.world.speed.length - 1,speedIndex)
        this.speed = config.world.speed[this.speedIndex]
        prefs.set('speed',this.speedIndex)
        return post.emit('worldSpeed',this.speed,this.speedIndex)
    }

    World.prototype["resetSpeed"] = function ()
    {
        return this.setSpeed(2)
    }

    World.prototype["incrSpeed"] = function ()
    {
        return this.setSpeed(this.speedIndex + 1)
    }

    World.prototype["decrSpeed"] = function ()
    {
        return this.setSpeed(this.speedIndex - 1)
    }

    World.prototype["addFloor"] = function ()
    {
        var geom

        geom = new PlaneGeometry(15000,15000)
        this.floor = new Mesh(geom,Materials.floor)
        this.floor.name = 'floor'
        this.scene.add(this.floor)
        this.pickables.push(this.floor)
        this.floor.material.depthWrite = false
        this.floor.receiveShadow = true
        geom = new PlaneGeometry(1500,1500)
        this.shadowFloor = new Mesh(geom,Materials.shadow)
        this.shadowFloor.receiveShadow = true
        this.shadowFloor.name = 'shadow'
        return this.scene.add(this.shadowFloor)
    }

    World.prototype["indexToPos"] = function (index, pos)
    {
        pos.x = (index & 0b11111111) - 128
        pos.y = ((index >> 8) & 0b11111111) - 128
        pos.z = ((index >> 16) & 0b11111111) - 128
        return pos
    }

    World.prototype["invalidPos"] = function (pos)
    {
        return !this.validPos(pos)
    }

    World.prototype["validPos"] = function (pos)
    {
        if (pos.x > 127 || pos.x < -127)
        {
            return false
        }
        if (pos.y > 127 || pos.y < -127)
        {
            return false
        }
        if (pos.z > 127 || pos.z < -127)
        {
            return false
        }
        return true
    }

    World.prototype["roundPos"] = function (v)
    {
        Vector.tmp.copy(v)
        return Vector.tmp.rounded()
    }

    World.prototype["addPickable"] = function (mesh)
    {
        if (!(_k_.in(mesh,this.pickables)))
        {
            return this.pickables.push(mesh)
        }
    }

    World.prototype["removePickable"] = function (mesh)
    {
        if (_k_.in(mesh,this.pickables))
        {
            return this.pickables.splice(this.pickables.indexOf(mesh),1)
        }
    }

    World.prototype["addObject"] = function (mesh)
    {
        return this.scene.add(mesh)
    }

    World.prototype["removeObject"] = function (mesh)
    {
        return mesh.removeFromParent()
    }

    World.prototype["addMesh"] = function (mesh)
    {
        this.addObject(mesh)
        return this.addPickable(mesh)
    }

    World.prototype["removeMesh"] = function (mesh)
    {
        this.removeObject(mesh)
        return this.removePickable(mesh)
    }

    World.prototype["addBody"] = function (body)
    {
        return this.physics.addBody(body)
    }

    World.prototype["removeBody"] = function (body)
    {
        if (body)
        {
            return this.physics.removeBody(body)
        }
    }

    World.prototype["tidyUp"] = function ()
    {
        return this.physics.clear()
    }

    World.prototype["onKeyDown"] = function (combo)
    {
        if (this.player.onKeyDown(combo) !== 'unhandled')
        {
            return
        }
        return 'unhandled'
    }

    World.prototype["onKeyUp"] = function (combo)
    {
        if (this.player.onKeyUp(combo) !== 'unhandled')
        {
            return
        }
        return 'unhandled'
    }

    return World
})()

module.exports = World