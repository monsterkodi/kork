// monsterkodi/kode 0.245.0

var _k_

var Immutable, Save

Immutable = require('seamless-immutable')

Save = (function ()
{
    function Save ()
    {
        this["onLoad"] = this["onLoad"].bind(this)
        this["onSave"] = this["onSave"].bind(this)
        this.s = Immutable({})
        post.on('save',this.onSave)
        post.on('load',this.onLoad)
        post.on('reload',this.onLoad)
    }

    Save.prototype["onSave"] = function ()
    {
        return prefs.set('save',this.currentState())
    }

    Save.prototype["toNoon"] = function ()
    {
        return noon.stringify(this.currentState(),{circular:true})
    }

    Save.prototype["currentState"] = function ()
    {
        var state

        state = {}
        return {}
    }

    Save.prototype["onLoad"] = function ()
    {
        var newNoon, oldNoon, save

        save = prefs.get('save')
        if (!save)
        {
            return
        }
        oldNoon = noon.stringify(save,{circular:true})
        world.clear()
        newNoon = this.toNoon()
        if (newNoon !== oldNoon)
        {
            console.log('DAFUK?')
        }
    }

    return Save
})()

module.exports = Save