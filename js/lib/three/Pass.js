// monsterkodi/kode 0.243.0

var _k_

var BufferGeometry, Float32BufferAttribute, Mesh, OrthographicCamera, _camera, _geometry

BufferGeometry = require('three').BufferGeometry
Float32BufferAttribute = require('three').Float32BufferAttribute
OrthographicCamera = require('three').OrthographicCamera
Mesh = require('three').Mesh

class Pass
{
    constructor ()
    {
        this.isPass = true
        this.enabled = true
        this.needsSwap = true
        this.clear = false
        this.renderToScreen = false
    }

    setSize ()
    {}

    render ()
    {
        return console.error('THREE.Pass: .render() must be implemented in derived pass.')
    }

    dispose ()
    {}
}

_camera = new OrthographicCamera(-1,1,1,-1,0,1)
class FullscreenTriangleGeometry extends BufferGeometry
{
    constructor ()
    {
        super()
    
        this.setAttribute('position',new Float32BufferAttribute([-1,3,0,-1,-1,0,3,-1,0],3))
        this.setAttribute('uv',new Float32BufferAttribute([0,2,0,0,2,0],2))
    }
}

_geometry = new FullscreenTriangleGeometry()
class FullScreenQuad
{
    constructor (material)
    {
        this._mesh = new Mesh(_geometry,material)
    }

    dispose ()
    {
        return this._mesh.geometry.dispose()
    }

    render (renderer)
    {
        return renderer.render(this._mesh,_camera)
    }

    getMaterial ()
    {
        return this._mesh.material
    }

    setMaterial (value)
    {
        return this._mesh.material = value
    }
}

module.exports = {Pass:Pass,FullScreenQuad:FullScreenQuad}