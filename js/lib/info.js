// monsterkodi/kode 0.243.0

var _k_

class Info
{
    constructor ()
    {
        this.draw = this.draw.bind(this)
        this.info = elem({class:'info',style:'bottom:10px; right:20px;'})
        document.body.appendChild(this.info)
    }

    del ()
    {
        return this.info.remove()
    }

    draw (info)
    {
        var add, k, v

        this.info.innerHTML = ''
        add = (function (text)
        {
            return elem({class:'infoText',parent:this.info,text:text})
        }).bind(this)
        for (k in info)
        {
            v = info[k]
            add(`${k} ${v}`)
        }
    }
}

module.exports = Info