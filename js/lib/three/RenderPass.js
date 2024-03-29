// monsterkodi/kode 0.243.0

var _k_

var Color, Pass

Color = require('three').Color

Pass = require('./Pass').Pass

class RenderPass extends Pass
{
    constructor (scene, camera, overrideMaterial = null, clearColor = null, clearAlpha = null)
    {
        super()
    
        this.scene = scene
        this.camera = camera
        this.overrideMaterial = overrideMaterial
        this.clearColor = clearColor
        this.clearAlpha = clearAlpha
        this.clear = true
        this.clearDepth = false
        this.needsSwap = false
        this._oldClearColor = new Color()
    }

    render (renderer, writeBuffer, readBuffer)
    {
        var oldAutoClear, oldClearAlpha, oldOverrideMaterial

        oldAutoClear = renderer.autoClear
        renderer.autoClear = false
        if ((this.overrideMaterial !== null))
        {
            oldOverrideMaterial = this.scene.overrideMaterial
            this.scene.overrideMaterial = this.overrideMaterial
        }
        if ((this.clearColor !== null))
        {
            renderer.getClearColor(this._oldClearColor)
            renderer.setClearColor(this.clearColor)
        }
        if ((this.clearAlpha !== null))
        {
            oldClearAlpha = renderer.getClearAlpha()
            renderer.setClearAlpha(this.clearAlpha)
        }
        if ((this.clearDepth === true))
        {
            renderer.clearDepth()
        }
        renderer.setRenderTarget((this.renderToScreen ? null : readBuffer))
        if ((this.clear === true))
        {
            renderer.clear(renderer.autoClearColor,renderer.autoClearDepth,renderer.autoClearStencil)
        }
        renderer.render(this.scene,this.camera)
        if ((this.clearColor !== null))
        {
            renderer.setClearColor(this._oldClearColor)
        }
        if ((this.clearAlpha !== null))
        {
            renderer.setClearAlpha(oldClearAlpha)
        }
        if ((this.overrideMaterial !== null))
        {
            this.scene.overrideMaterial = oldOverrideMaterial
        }
        return renderer.autoClear = oldAutoClear
    }
}

module.exports = RenderPass