// monsterkodi/kode 0.243.0

var _k_

var Toggle


Toggle = (function ()
{
    Toggle["toggles"] = {}
    function Toggle (name, cfg = {})
    {
        var _15_21_

        this.name = name
        this.cfg = cfg
    
        this.cfg.default = ((_15_21_=this.cfg.default) != null ? _15_21_ : false)
        this.value = prefs.get(this.name,this.cfg.default)
        Toggle.toggles[this.name] = this
    }

    Toggle["resetAll"] = function ()
    {
        var name, toggle

        for (name in this.toggles)
        {
            toggle = this.toggles[name]
            this.reset(name)
        }
    }

    Toggle["applyAll"] = function ()
    {
        var name, toggle

        for (name in this.toggles)
        {
            toggle = this.toggles[name]
            this.set(name,toggle.value)
        }
    }

    Toggle["reset"] = function (name)
    {
        return this.set(name,this.toggles[name].cfg.default)
    }

    Toggle["set"] = function (name, value)
    {
        var toggle, _29_25_

        toggle = this.toggles[name]
        toggle.value = value
        prefs.set(toggle.name,toggle.value)
        post.emit('toggleChange',toggle)
        return (typeof toggle.cfg.change === "function" ? toggle.cfg.change(toggle.value) : undefined)
    }

    Toggle["get"] = function (name)
    {
        return this.toggles[name].value
    }

    return Toggle
})()

module.exports = Toggle