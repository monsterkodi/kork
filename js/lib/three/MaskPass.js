// monsterkodi/kode 0.243.0

var _k_

var Pass

Pass = require('./Pass').Pass

class MaskPass extends Pass
{
    constructor (scene, camera)
    {
        super()
    
        this.scene = scene
        this.camera = camera
        this.clear = true
        this.needsSwap = false
        this.inverse = false
    }

    render (renderer, writeBuffer, readBuffer)
    {
        var clearValue, context, state, writeValue

        context = renderer.getContext()
        state = renderer.state
        state.buffers.color.setMask(false)
        state.buffers.depth.setMask(false)
        state.buffers.color.setLocked(true)
        state.buffers.depth.setLocked(true)
        if (this.inverse)
        {
            writeValue = 0
            clearValue = 1
        }
        else
        {
            writeValue = 1
            clearValue = 0
        }
        state.buffers.stencil.setTest(true)
        state.buffers.stencil.setOp(context.REPLACE,context.REPLACE,context.REPLACE)
        state.buffers.stencil.setFunc(context.ALWAYS,writeValue,0xffffffff)
        state.buffers.stencil.setClear(clearValue)
        state.buffers.stencil.setLocked(true)
        renderer.setRenderTarget(readBuffer)
        if (this.clear)
        {
            renderer.clear()
        }
        renderer.render(this.scene,this.camera)
        renderer.setRenderTarget(writeBuffer)
        if (this.clear)
        {
            renderer.clear()
        }
        renderer.render(this.scene,this.camera)
        state.buffers.color.setLocked(false)
        state.buffers.depth.setLocked(false)
        state.buffers.color.setMask(true)
        state.buffers.depth.setMask(true)
        state.buffers.stencil.setLocked(false)
        state.buffers.stencil.setFunc(context.EQUAL,1,0xffffffff)
        state.buffers.stencil.setOp(context.KEEP,context.KEEP,context.KEEP)
        return state.buffers.stencil.setLocked(true)
    }
}

class ClearMaskPass extends Pass
{
    constructor ()
    {
        super()
    
        this.needsSwap = false
    }

    render (renderer)
    {
        renderer.state.buffers.stencil.setLocked(false)
        return renderer.state.buffers.stencil.setTest(false)
    }
}

module.exports = {MaskPass:MaskPass,ClearMaskPass:ClearMaskPass}