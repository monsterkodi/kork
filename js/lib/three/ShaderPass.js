// monsterkodi/kode 0.243.0

var _k_

var FullScreenQuad, Pass, ShaderMaterial, UniformsUtils

ShaderMaterial = require('three').ShaderMaterial
UniformsUtils = require('three').UniformsUtils

Pass = require('./Pass').Pass
FullScreenQuad = require('./Pass').FullScreenQuad

class ShaderPass extends Pass
{
    constructor (shader, textureID)
    {
        super()
    
        this.textureID = ((textureID !== undefined) ? textureID : 'tDiffuse')
        if (shader instanceof ShaderMaterial)
        {
            this.uniforms = shader.uniforms
            this.material = shader
        }
        else if (shader)
        {
            this.uniforms = UniformsUtils.clone(shader.uniforms)
            this.material = new ShaderMaterial({name:((shader.name !== undefined) ? shader.name : 'unspecified'),defines:Object.assign({},shader.defines),uniforms:this.uniforms,vertexShader:shader.vertexShader,fragmentShader:shader.fragmentShader})
        }
        this.fsQuad = new FullScreenQuad(this.material)
    }

    render (renderer, writeBuffer, readBuffer)
    {
        if (this.uniforms[this.textureID])
        {
            this.uniforms[this.textureID].value = readBuffer.texture
        }
        this.fsQuad.material = this.material
        if (this.renderToScreen)
        {
            renderer.setRenderTarget(null)
            return this.fsQuad.render(renderer)
        }
        else
        {
            renderer.setRenderTarget(writeBuffer)
            if (this.clear)
            {
                renderer.clear(renderer.autoClearColor,renderer.autoClearDepth,renderer.autoClearStencil)
            }
            return this.fsQuad.render(renderer)
        }
    }

    dispose ()
    {
        this.material.dispose()
        return this.fsQuad.dispose()
    }
}

module.exports = ShaderPass