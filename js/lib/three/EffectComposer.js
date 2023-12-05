// monsterkodi/kode 0.243.0

var _k_

var ClearMaskPass, Clock, CopyShader, HalfFloatType, MaskPass, NoBlending, ShaderPass, Vector2, WebGLRenderTarget

Clock = require('three').Clock
HalfFloatType = require('three').HalfFloatType
NoBlending = require('three').NoBlending
Vector2 = require('three').Vector2
WebGLRenderTarget = require('three').WebGLRenderTarget

CopyShader = require('./CopyShader')
ShaderPass = require('./ShaderPass')
MaskPass = require('./MaskPass').MaskPass
ClearMaskPass = require('./MaskPass').ClearMaskPass

class EffectComposer
{
    constructor (renderer, renderTarget)
    {
        var size

        this.renderer = renderer
        this._pixelRatio = renderer.getPixelRatio()
        if (renderTarget === undefined)
        {
            size = renderer.getSize(new Vector2())
            this._width = size.width
            this._height = size.height
            renderTarget = new WebGLRenderTarget(this._width * this._pixelRatio,this._height * this._pixelRatio,{type:HalfFloatType})
            renderTarget.texture.name = 'EffectComposer.rt1'
        }
        else
        {
            this._width = renderTarget.width
            this._height = renderTarget.height
        }
        this.renderTarget1 = renderTarget
        this.renderTarget2 = renderTarget.clone()
        this.renderTarget2.texture.name = 'EffectComposer.rt2'
        this.writeBuffer = this.renderTarget1
        this.readBuffer = this.renderTarget2
        this.renderToScreen = true
        this.passes = []
        this.copyPass = new ShaderPass(CopyShader)
        this.copyPass.material.blending = NoBlending
        this.clock = new Clock()
    }

    swapBuffers ()
    {
        var tmp

        tmp = this.readBuffer
        this.readBuffer = this.writeBuffer
        return this.writeBuffer = tmp
    }

    addPass (pass)
    {
        this.passes.push(pass)
        return pass.setSize(this._width * this._pixelRatio,this._height * this._pixelRatio)
    }

    insertPass (pass, index)
    {
        this.passes.splice(index,0,pass)
        return pass.setSize(this._width * this._pixelRatio,this._height * this._pixelRatio)
    }

    removePass (pass)
    {
        var index

        index = this.passes.indexOf(pass)
        if (index !== -1)
        {
            return this.passes.splice(index,1)
        }
    }

    isLastEnabledPass (passIndex)
    {
        var i

        for (var _70_17_ = i = passIndex + 1, _70_33_ = this.passes.length; (_70_17_ <= _70_33_ ? i < this.passes.length : i > this.passes.length); (_70_17_ <= _70_33_ ? ++i : --i))
        {
            if (this.passes[i].enabled)
            {
                return false
            }
        }
        return true
    }

    render (deltaTime)
    {
        var context, currentRenderTarget, i, maskActive, pass, stencil

        if (deltaTime === undefined)
        {
            deltaTime = this.clock.getDelta()
        }
        currentRenderTarget = this.renderer.getRenderTarget()
        maskActive = false
        for (var _87_17_ = i = 0, _87_21_ = this.passes.length; (_87_17_ <= _87_21_ ? i < this.passes.length : i > this.passes.length); (_87_17_ <= _87_21_ ? ++i : --i))
        {
            pass = this.passes[i]
            if (pass.enabled === false)
            {
                continue
            }
            pass.renderToScreen = this.renderToScreen && this.isLastEnabledPass(i)
            pass.render(this.renderer,this.writeBuffer,this.readBuffer,deltaTime,maskActive)
            if (pass.needsSwap)
            {
                if (maskActive)
                {
                    context = this.renderer.getContext()
                    stencil = this.renderer.state.buffers.stencil
                    stencil.setFunc(context.NOTEQUAL,1,0xffffffff)
                    this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,deltaTime)
                    stencil.setFunc(context.EQUAL,1,0xffffffff)
                }
                this.swapBuffers()
            }
            if (MaskPass !== undefined)
            {
                if (pass instanceof MaskPass)
                {
                    maskActive = true
                }
                else if (pass instanceof ClearMaskPass)
                {
                    maskActive = false
                }
            }
        }
        return this.renderer.setRenderTarget(currentRenderTarget)
    }

    reset (renderTarget)
    {
        var size

        if (renderTarget === undefined)
        {
            size = this.renderer.getSize(new Vector2())
            this._pixelRatio = this.renderer.getPixelRatio()
            this._width = size.width
            this._height = size.height
            renderTarget = this.renderTarget1.clone()
            renderTarget.setSize(this._width * this._pixelRatio,this._height * this._pixelRatio)
        }
        this.renderTarget1.dispose()
        this.renderTarget2.dispose()
        this.renderTarget1 = renderTarget
        this.renderTarget2 = renderTarget.clone()
        this.writeBuffer = this.renderTarget1
        return this.readBuffer = this.renderTarget2
    }

    setSize (width, height)
    {
        var effectiveHeight, effectiveWidth, i

        this._width = width
        this._height = height
        effectiveWidth = this._width * this._pixelRatio
        effectiveHeight = this._height * this._pixelRatio
        this.renderTarget1.setSize(effectiveWidth,effectiveHeight)
        this.renderTarget2.setSize(effectiveWidth,effectiveHeight)
        for (var _156_17_ = i = 0, _156_21_ = this.passes.length; (_156_17_ <= _156_21_ ? i < this.passes.length : i > this.passes.length); (_156_17_ <= _156_21_ ? ++i : --i))
        {
            this.passes[i].setSize(effectiveWidth,effectiveHeight)
        }
    }

    setPixelRatio (pixelRatio)
    {
        this._pixelRatio = pixelRatio
        return this.setSize(this._width,this._height)
    }

    dispose ()
    {
        this.renderTarget1.dispose()
        this.renderTarget2.dispose()
        return this.copyPass.dispose()
    }
}

module.exports = EffectComposer