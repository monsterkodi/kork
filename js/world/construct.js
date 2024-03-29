// monsterkodi/kode 0.243.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var Landscape


Landscape = (function ()
{
    function Landscape ()
    {
        this.tiles = []
    }

    Landscape.prototype["landscapeHeight"] = function (pos)
    {
        return this.heightAt(pos.x,pos.y)
    }

    Landscape.prototype["heightAt"] = function (x, y)
    {
        return 0
    }

    Landscape.prototype["init"] = function ()
    {
        return this.initLandscape()
    }

    Landscape.prototype["initLandscape"] = function ()
    {
        var geom, geoms, size, so, tile, x, xo, y, yo

        size = 100
        for (x = -1; x <= 1; x++)
        {
            for (y = -1; y <= 1; y++)
            {
                if ((x === y && y === 0))
                {
                    tiles.push(new Tile(0,0,size,0))
                    continue
                }
                tiles.push(x * size,y * size,size,randInt(3))
            }
        }
        size = 150
        so = 300
        for (xo = -1; xo <= 1; xo++)
        {
            for (yo = -1; yo <= 1; yo++)
            {
                if ((xo === yo && yo === 0))
                {
                    continue
                }
                for (x = 0; x <= 1; x++)
                {
                    for (y = 0; y <= 1; y++)
                    {
                        tiles.push((x - 0.5) * size + xo * so,(y - 0.5) * size + yo * so,size,randInt(3))
                    }
                }
            }
        }
        size = 300
        for (x = -2; x <= 2; x++)
        {
            for (y = -2; y <= 2; y++)
            {
                if (abs(y) < 2 && abs(x) < 2)
                {
                    continue
                }
                tiles.push(x * size,y * size,size,randInt(3))
            }
        }
        size = 750
        so = 1500
        for (xo = -1; xo <= 1; xo++)
        {
            for (yo = -1; yo <= 1; yo++)
            {
                if ((xo === yo && yo === 0))
                {
                    continue
                }
                for (x = 0; x <= 1; x++)
                {
                    for (y = 0; y <= 1; y++)
                    {
                        tiles.push((x - 0.5) * size + xo * so,(y - 0.5) * size + yo * so,size,randInt(3))
                    }
                }
            }
        }
        geoms = []
        var list = _k_.list(this.tiles)
        for (var _77_17_ = 0; _77_17_ < list.length; _77_17_++)
        {
            tile = list[_77_17_]
            geoms.push(tile.geom)
        }
        geom = Geom.merge(geoms)
        geom.computeVertexNormals()
        geom.computeBoundingSphere()
        this.landscape = new Mesh(geom,Materials.landscape)
        this.landscape.setShadow()
        return this.landscape.name = 'landscape'
    }

    return Landscape
})()

module.exports = Landscape