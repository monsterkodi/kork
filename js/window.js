// monsterkodi/kode 0.245.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var args, electron, keyinfo, onClose, onMove, post, prefs, Quaternion, reloadWin, RTS, saveBounds, Vector, w, win, Window

args = require('kxk').args
keyinfo = require('kxk').keyinfo
post = require('kxk').post
prefs = require('kxk').prefs
win = require('kxk').win

RTS = require('./rts')
Vector = require('./lib/vector')
Quaternion = require('./lib/quaternion')
electron = require('electron')
post.setMaxListeners(20)

window.vec = function (x, y, z)
{
    return new Vector(x,y,z)
}

window.quat = function (x, y, z, w)
{
    console.log('quat')
    return new Quaternion(x,y,z,w)
}

Window = (function ()
{
    _k_.extend(Window, win)
    function Window ()
    {
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        return Window.__super__.constructor.apply(this, arguments)
    }

    Window.prototype["onMenuAction"] = function (action, args)
    {
        return Window.__super__.onMenuAction.call(this,action,args)
    }

    return Window
})()

w = new Window({dir:__dirname,pkg:require('../package.json'),menu:'../kode/menu/menu.noon',icon:'../img/menu@2x.png',context:function (items)
{},onLoad:function ()
{
    return window.rts = new RTS($('#main'))
}})

onMove = function ()
{
    return saveBounds()
}

saveBounds = function ()
{
    return prefs.set('bounds',window.win.getBounds())
}

onClose = function ()
{}

window.onload = function ()
{
    var _56_15_

    window.rts = ((_56_15_=window.rts) != null ? _56_15_ : new RTS($('#main')))
    return window.onresize()
}

reloadWin = function ()
{
    var _69_38_

    prefs.save()
    clearListeners()
    return (electron.remote.getCurrentWindow() != null ? electron.remote.getCurrentWindow().webContents.reloadIgnoringCache() : undefined)
}

window.onresize = function (event)
{
    var br, main

    saveBounds()
    main = $("#main")
    br = main.getBoundingClientRect()
    return (rts != null ? rts.resized(br.width,br.height) : undefined)
}

window.onkeydown = function (event)
{
    if (this.rts.onKeyDown(keyinfo.comboForEvent(event)) !== 'unhandled')
    {
        return
    }
    switch (keyinfo.comboForEvent(event))
    {
        case 'esc':
            return post.emit('cancel')

        case 'g':
            return post.emit('toggle','grid')

        case 'f':
            return post.emit('toggle','flat')

        case 'm':
            return post.emit('toggle','wire')

        case 'i':
            return post.emit('toggle','info')

        case 'l':
            return post.emit('toggle','lable')

        case 't':
            return post.emit('addTrain')

        case 'ctrl+s':
            return post.emit('save')

        case 'ctrl+r':
            return post.emit('reload')

        case 'command+s':
            return post.emit('save')

        case 'command+r':
            return post.emit('reload')

        case 'backspace':
        case 'delete':
            return post.emit('delete')

        case '.':
            return rts.toggleDebug()

        case 'space':
            return rts.togglePause()

        case '=':
            world.incrSpeed()
            return world.incrSpeed()

        case '-':
            world.decrSpeed()
            return world.decrSpeed()

        case '0':
            return world.resetSpeed()

    }

}

window.onkeyup = function (event)
{
    if (this.rts.onKeyUp(keyinfo.comboForEvent(event)) !== 'unhandled')
    {
        return
    }
}
post.on('menuAction',function (action)
{})