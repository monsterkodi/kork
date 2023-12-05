// monsterkodi/kode 0.243.0

var _k_ = {min: function () { m = Infinity; for (a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var Construct


Construct = (function ()
{
    function Construct ()
    {
        this.meshes = {}
    }

    Construct.prototype["init"] = function ()
    {
        return this.initLandscape()
    }

    Construct.prototype["flat"] = function (x, y, size = 200)
    {
        var geom

        geom = new PlaneGeometry(size,size,1,1)
        geom.translate(x,y,0)
        return geom
    }

    Construct.prototype["borderCos"] = function (radius, size)
    {
        var border

        border = 0.94
        if (abs(radius / size) > border * 0.5)
        {
            return -1
        }
        else
        {
            return Math.cos(2 * Math.PI * (radius / size) / border)
        }
    }

    Construct.prototype["hill"] = function (x, y, size = 200, height = 40)
    {
        var geom, mr, px, py, vertex, vr

        geom = new PlaneGeometry(size,size,20,20)
        for (var _44_22_ = vertex = 0, _44_26_ = geom.attributes.position.count; (_44_22_ <= _44_26_ ? vertex < geom.attributes.position.count : vertex > geom.attributes.position.count); (_44_22_ <= _44_26_ ? ++vertex : --vertex))
        {
            px = geom.attributes.position.array[vertex * 3 + 0]
            py = geom.attributes.position.array[vertex * 3 + 1]
            vr = Math.sqrt(px * px + py * py)
            mr = _k_.min(vr,size * 0.5)
            geom.attributes.position.array[vertex * 3 + 2] = height * 0.5 * (1 + this.borderCos(mr,size))
        }
        geom.translate(x,y,0)
        return geom
    }

    Construct.prototype["hole"] = function (x, y, size = 200, depth = 40)
    {
        var geom, mr, px, py, vertex, vr

        geom = new PlaneGeometry(size,size,20,20)
        for (var _58_22_ = vertex = 0, _58_26_ = geom.attributes.position.count; (_58_22_ <= _58_26_ ? vertex < geom.attributes.position.count : vertex > geom.attributes.position.count); (_58_22_ <= _58_26_ ? ++vertex : --vertex))
        {
            px = geom.attributes.position.array[vertex * 3 + 0]
            py = geom.attributes.position.array[vertex * 3 + 1]
            vr = Math.sqrt(px * px + py * py)
            mr = _k_.min(vr,size / 2)
            geom.attributes.position.array[vertex * 3 + 2] = -(depth * 0.5 * (1 + this.borderCos(mr,size)))
        }
        geom.translate(x,y,0)
        return geom
    }

    Construct.prototype["initLandscape"] = function ()
    {
        var geom, geoms, landscape, size, so, x, xo, y, yo

        geoms = []
        size = 100
        for (x = -1; x <= 1; x++)
        {
            for (y = -1; y <= 1; y++)
            {
                if ((x === y && y === 0))
                {
                    geoms.push(this.flat(0,0,size))
                    continue
                }
                geoms.push(((function ()
                {
                    switch (randInt(3))
                    {
                        case 0:
                            return this.hill(x * size,y * size,size,size / 4)

                        case 1:
                            return this.hole(x * size,y * size,size,size / 4)

                        case 2:
                            return this.flat(x * size,y * size,size)

                    }

                }).bind(this))())
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
                        geoms.push(((function ()
                        {
                            switch (randInt(3))
                            {
                                case 0:
                                    return this.hill((x - 0.5) * size + xo * so,(y - 0.5) * size + yo * so,size,size / 4)

                                case 1:
                                    return this.hole((x - 0.5) * size + xo * so,(y - 0.5) * size + yo * so,size,size / 4)

                                case 2:
                                    return this.flat((x - 0.5) * size + xo * so,(y - 0.5) * size + yo * so,size)

                            }

                        }).bind(this))())
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
                geoms.push(((function ()
                {
                    switch (randInt(3))
                    {
                        case 0:
                            return this.hill(x * size,y * size,size,size / 4)

                        case 1:
                            return this.hole(x * size,y * size,size,size / 4)

                        case 2:
                            return this.flat(x * size,y * size,size,size / 4)

                    }

                }).bind(this))())
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
                        geoms.push(((function ()
                        {
                            switch (randInt(3))
                            {
                                case 0:
                                    return this.hill((x - 0.5) * size + xo * so,(y - 0.5) * size + yo * so,size,size / 4)

                                case 1:
                                    return this.hole((x - 0.5) * size + xo * so,(y - 0.5) * size + yo * so,size,size / 4)

                                case 2:
                                    return this.flat((x - 0.5) * size + xo * so,(y - 0.5) * size + yo * so,size)

                            }

                        }).bind(this))())
                    }
                }
            }
        }
        size = 2250
        so = 4500
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
                        geoms.push(((function ()
                        {
                            switch (randInt(3))
                            {
                                case 0:
                                    return this.hill((x - 0.5) * size + xo * so,(y - 0.5) * size + yo * so,size,size / 4)

                                case 1:
                                    return this.hole((x - 0.5) * size + xo * so,(y - 0.5) * size + yo * so,size,size / 4)

                                case 2:
                                    return this.flat((x - 0.5) * size + xo * so,(y - 0.5) * size + yo * so,size)

                            }

                        }).bind(this))())
                    }
                }
            }
        }
        geom = Geom.merge(geoms)
        geom.computeVertexNormals()
        geom.computeBoundingSphere()
        landscape = new Mesh(geom,Materials.landscape)
        landscape.setShadow()
        landscape.name = 'landscape'
        return this.meshes.landscape = landscape
    }

    return Construct
})()

module.exports = Construct