// monsterkodi/kode 0.243.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var GUI

GUI = require('lil-gui').GUI

class Debug
{
    constructor (view)
    {
        var name, param, toggle

        this.update = this.update.bind(this)
        this.toggle = this.toggle.bind(this)
        this.gui = new GUI({container:view,title:''})
        this.gui.open(true)
        this.show(prefs.get('debug'))
        this.gui.add(this,'resetToggles').name('toggles')
        for (name in Toggle.toggles)
        {
            toggle = Toggle.toggles[name]
            this.addToggle(toggle)
        }
        this.gui.add(this,'resetParams').name('params')
        for (name in Param.params)
        {
            param = Param.params[name]
            this.addParam(param)
        }
        post.on('paramChange',this.update)
        post.on('toggleChange',this.update)
    }

    toggle ()
    {
        return this.show(!prefs.get('debug'))
    }

    show (show)
    {
        prefs.set('debug',show)
        this.gui.show(show)
        return this.gui.open(true)
    }

    del ()
    {
        return this.elem.remove()
    }

    update ()
    {
        var c

        var list = _k_.list(this.gui.controllers)
        for (var _33_21_ = 0; _33_21_ < list.length; _33_21_++)
        {
            c = list[_33_21_]
            c.updateDisplay()
        }
    }

    addParam (param)
    {
        return this.gui.add(param,'value',param.cfg.min,param.cfg.max,param.cfg.step).name(param.name).onChange(function (value)
        {
            return Param.set(param.name,value)
        })
    }

    resetParams ()
    {
        return Param.resetAll()
    }

    addToggle (toggle)
    {
        return this.gui.add(toggle,'value').name(toggle.name).onChange(function (value)
        {
            return Toggle.set(toggle.name,value)
        })
    }

    resetToggles ()
    {
        return Toggle.resetAll()
    }
}

module.exports = Debug