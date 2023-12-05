// monsterkodi/kode 0.243.0

var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var Param


Param = (function ()
{
    Param["params"] = {}
    function Param (name, def, cfg)
    {
        var _16_19_, _17_17_

        this.name = name
        this.def = def
        this.cfg = cfg
    
        this.value = prefs.get(this.name,this.def)
        this.cfg.fixed = ((_16_19_=this.cfg.fixed) != null ? _16_19_ : 1)
        this.cfg.min = ((_17_17_=this.cfg.min) != null ? _17_17_ : 0)
        Param.params[this.name] = this
    }

    Param["resetAll"] = function ()
    {
        var name, param

        for (name in this.params)
        {
            param = this.params[name]
            this.reset(name)
        }
    }

    Param["applyAll"] = function ()
    {
        var name, param

        for (name in this.params)
        {
            param = this.params[name]
            this.set(name,param.value)
        }
    }

    Param["reset"] = function (name)
    {
        return this.set(name,this.params[name].def)
    }

    Param["incr"] = function (name)
    {
        return this.set(name,this.get(name) + this.params[name].cfg.step)
    }

    Param["decr"] = function (name)
    {
        return this.set(name,this.get(name) - this.params[name].cfg.step)
    }

    Param["set"] = function (name, value)
    {
        var param, _33_24_

        param = this.params[name]
        param.value = _k_.clamp(param.cfg.min,param.cfg.max,value)
        prefs.set(param.name,param.value)
        post.emit('paramChange',param)
        return (typeof param.cfg.change === "function" ? param.cfg.change(param.value) : undefined)
    }

    Param["get"] = function (name)
    {
        return this.params[name].value
    }

    return Param
})()

module.exports = Param