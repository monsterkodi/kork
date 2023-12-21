// monsterkodi/kode 0.245.0

var _k_ = {min: function () { m = Infinity; for (a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var Tile


Tile = (function ()
{
    function Tile (x, y, size, type)
    {
        this.x = x
        this.y = y
        this.size = size
        this.type = type
    
        switch (this.type)
        {
            case 1:
            case 2:
                this.hill()
                break
            default:
                this.flat()
        }

        this.geom.translate(this.x,this.y,0)
    }

    Tile.prototype["contains"] = function (x, y)
    {
        var sh

        sh = this.size / 2
        return ((this.x - sh) < x && x < (this.x + sh)) && ((this.y - sh) < y && y < (this.y + sh))
    }

    Tile.prototype["heightAt"] = function (x, y)
    {
        var cos, mr, px, py, vr

        px = x - this.x
        py = y - this.y
        vr = Math.sqrt(px * px + py * py)
        mr = _k_.min(vr,this.size * 0.5)
        cos = Math.cos(2 * Math.PI * mr / this.size)
        switch (this.type)
        {
            case 1:
                return -this.size / 8 * (1 + cos)

            case 2:
                return this.size / 8 * (1 + cos)

            default:
                return 0
        }

    }

    Tile.prototype["normalAt"] = function (x, y)
    {
        var d, h0, v0, vx, vy, xn, xp, yn, yp

        d = 0.1
        h0 = this.heightAt(x,y)
        v0 = Vector.tmp.set(x,y,h0)
        xp = this.heightAt(x + d,y)
        xn = this.heightAt(x - d,y)
        yp = this.heightAt(x,y + d)
        yn = this.heightAt(x,y - d)
        vx = Vector.tmp1.set(x + d,y,xp).sub(v0)
        vy = Vector.tmp2.set(x,y + d,yp).sub(v0)
        return vx.cross(vy).normalize()
    }

    Tile.prototype["flat"] = function ()
    {
        return this.geom = new PlaneGeometry(this.size,this.size,1,1)
    }

    Tile.prototype["hill"] = function ()
    {
        var px, py, vertex, vertices

        this.geom = new PlaneGeometry(this.size,this.size,30,30)
        vertices = this.geom.attributes.position
        for (var _61_22_ = vertex = 0, _61_26_ = vertices.count; (_61_22_ <= _61_26_ ? vertex < vertices.count : vertex > vertices.count); (_61_22_ <= _61_26_ ? ++vertex : --vertex))
        {
            px = vertices.array[vertex * 3 + 0]
            py = vertices.array[vertex * 3 + 1]
            vertices.array[vertex * 3 + 2] = this.heightAt(this.x + px,this.y + py)
        }
    }

    return Tile
})()

module.exports = Tile