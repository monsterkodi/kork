// monsterkodi/kode 0.243.0

var _k_

var AdditiveBlending, Color, CopyShader, FullScreenQuad, HalfFloatType, LuminosityHighPassShader, MeshBasicMaterial, Pass, ShaderMaterial, UniformsUtils, Vector2, Vector3, WebGLRenderTarget

AdditiveBlending = require('three').AdditiveBlending
Color = require('three').Color
HalfFloatType = require('three').HalfFloatType
MeshBasicMaterial = require('three').MeshBasicMaterial
ShaderMaterial = require('three').ShaderMaterial
UniformsUtils = require('three').UniformsUtils
Vector2 = require('three').Vector2
Vector3 = require('three').Vector3
WebGLRenderTarget = require('three').WebGLRenderTarget

Pass = require('./Pass').Pass
FullScreenQuad = require('./Pass').FullScreenQuad

CopyShader = require('./CopyShader')
LuminosityHighPassShader = require('./LuminosityHighPassShader')
class UnrealBloomPass extends Pass
{
    constructor (resolution, strength, radius, threshold)
    {
        super()
    
        var bloomFactors, copyShader, highPassShader, i, kernelSizeArray, renderTargetHorizonal, renderTargetVertical, resx, resy

        this.strength = ((strength !== undefined) ? strength : 1)
        this.radius = radius
        this.threshold = threshold
        this.resolution = ((resolution !== undefined) ? new Vector2(resolution.x,resolution.y) : new Vector2(256,256))
        this.clearColor = new Color(0,0,0)
        this.renderTargetsHorizontal = []
        this.renderTargetsVertical = []
        this.nMips = 5
        resx = Math.round(this.resolution.x / 2)
        resy = Math.round(this.resolution.y / 2)
        this.renderTargetBright = new WebGLRenderTarget(resx,resy,{type:HalfFloatType})
        this.renderTargetBright.texture.name = 'UnrealBloomPass.bright'
        this.renderTargetBright.texture.generateMipmaps = false
        for (var _39_17_ = i = 0, _39_21_ = this.nMips; (_39_17_ <= _39_21_ ? i < this.nMips : i > this.nMips); (_39_17_ <= _39_21_ ? ++i : --i))
        {
            renderTargetHorizonal = new WebGLRenderTarget(resx,resy,{type:HalfFloatType})
            renderTargetHorizonal.texture.name = 'UnrealBloomPass.h' + i
            renderTargetHorizonal.texture.generateMipmaps = false
            this.renderTargetsHorizontal.push(renderTargetHorizonal)
            renderTargetVertical = new WebGLRenderTarget(resx,resy,{type:HalfFloatType})
            renderTargetVertical.texture.name = 'UnrealBloomPass.v' + i
            renderTargetVertical.texture.generateMipmaps = false
            this.renderTargetsVertical.push(renderTargetVertical)
            resx = Math.round(resx / 2)
            resy = Math.round(resy / 2)
        }
        highPassShader = LuminosityHighPassShader
        this.highPassUniforms = UniformsUtils.clone(highPassShader.uniforms)
        this.highPassUniforms['luminosityThreshold'].value = threshold
        this.highPassUniforms['smoothWidth'].value = 0.01
        this.materialHighPassFilter = new ShaderMaterial({uniforms:this.highPassUniforms,vertexShader:highPassShader.vertexShader,fragmentShader:highPassShader.fragmentShader})
        this.separableBlurMaterials = []
        kernelSizeArray = [3,5,7,9,11]
        resx = Math.round(this.resolution.x / 2)
        resy = Math.round(this.resolution.y / 2)
        for (var _79_17_ = i = 0, _79_21_ = this.nMips; (_79_17_ <= _79_21_ ? i < this.nMips : i > this.nMips); (_79_17_ <= _79_21_ ? ++i : --i))
        {
            this.separableBlurMaterials.push(this.getSeperableBlurMaterial(kernelSizeArray[i]))
            this.separableBlurMaterials[i].uniforms['invSize'].value = new Vector2(1 / resx,1 / resy)
            resx = Math.round(resx / 2)
            resy = Math.round(resy / 2)
        }
        this.compositeMaterial = this.getCompositeMaterial(this.nMips)
        this.compositeMaterial.uniforms['blurTexture1'].value = this.renderTargetsVertical[0].texture
        this.compositeMaterial.uniforms['blurTexture2'].value = this.renderTargetsVertical[1].texture
        this.compositeMaterial.uniforms['blurTexture3'].value = this.renderTargetsVertical[2].texture
        this.compositeMaterial.uniforms['blurTexture4'].value = this.renderTargetsVertical[3].texture
        this.compositeMaterial.uniforms['blurTexture5'].value = this.renderTargetsVertical[4].texture
        this.compositeMaterial.uniforms['bloomStrength'].value = strength
        this.compositeMaterial.uniforms['bloomRadius'].value = 0.1
        bloomFactors = [1.0,0.8,0.6,0.4,0.2]
        this.compositeMaterial.uniforms['bloomFactors'].value = bloomFactors
        this.bloomTintColors = [new Vector3(1,1,1),new Vector3(1,1,1),new Vector3(1,1,1),new Vector3(1,1,1),new Vector3(1,1,1)]
        this.compositeMaterial.uniforms['bloomTintColors'].value = this.bloomTintColors
        copyShader = CopyShader
        this.copyUniforms = UniformsUtils.clone(copyShader.uniforms)
        this.blendMaterial = new ShaderMaterial({uniforms:this.copyUniforms,vertexShader:copyShader.vertexShader,fragmentShader:copyShader.fragmentShader,blending:AdditiveBlending,depthTest:false,depthWrite:false,transparent:true})
        this.enabled = true
        this.needsSwap = false
        this._oldClearColor = new Color()
        this.oldClearAlpha = 1
        this.basic = new MeshBasicMaterial()
        this.fsQuad = new FullScreenQuad(this.basic)
    }

    dispose ()
    {
        var i

        for (var _131_17_ = i = 0, _131_21_ = this.renderTargetsHorizontal.length; (_131_17_ <= _131_21_ ? i < this.renderTargetsHorizontal.length : i > this.renderTargetsHorizontal.length); (_131_17_ <= _131_21_ ? ++i : --i))
        {
            this.renderTargetsHorizontal[i].dispose()
        }
        for (var _135_17_ = i = 0, _135_21_ = this.renderTargetsVertical.length; (_135_17_ <= _135_21_ ? i < this.renderTargetsVertical.length : i > this.renderTargetsVertical.length); (_135_17_ <= _135_21_ ? ++i : --i))
        {
            this.renderTargetsVertical[i].dispose()
        }
        this.renderTargetBright.dispose()
        for (var _141_17_ = i = 0, _141_21_ = this.separableBlurMaterials.length; (_141_17_ <= _141_21_ ? i < this.separableBlurMaterials.length : i > this.separableBlurMaterials.length); (_141_17_ <= _141_21_ ? ++i : --i))
        {
            this.separableBlurMaterials[i].dispose()
        }
        this.compositeMaterial.dispose()
        this.blendMaterial.dispose()
        this.basic.dispose()
        return this.fsQuad.dispose()
    }

    setSize (width, height)
    {
        var i, resx, resy

        resx = Math.round(width / 2)
        resy = Math.round(height / 2)
        this.renderTargetBright.setSize(resx,resy)
        for (var _157_17_ = i = 0, _157_21_ = this.nMips; (_157_17_ <= _157_21_ ? i < this.nMips : i > this.nMips); (_157_17_ <= _157_21_ ? ++i : --i))
        {
            this.renderTargetsHorizontal[i].setSize(resx,resy)
            this.renderTargetsVertical[i].setSize(resx,resy)
            this.separableBlurMaterials[i].uniforms['invSize'].value = new Vector2(1 / resx,1 / resy)
            resx = Math.round(resx / 2)
            resy = Math.round(resy / 2)
        }
    }

    render (renderer, writeBuffer, readBuffer, deltaTime, maskActive)
    {
        var i, inputRenderTarget, oldAutoClear

        renderer.getClearColor(this._oldClearColor)
        this.oldClearAlpha = renderer.getClearAlpha()
        oldAutoClear = renderer.autoClear
        renderer.autoClear = false
        renderer.setClearColor(this.clearColor,0)
        if (maskActive)
        {
            renderer.state.buffers.stencil.setTest(false)
        }
        if (this.renderToScreen)
        {
            this.fsQuad.setMaterial(this.basic)
            this.basic.map = readBuffer.texture
            renderer.setRenderTarget(null)
            renderer.clear()
            this.fsQuad.render(renderer)
        }
        this.highPassUniforms['tDiffuse'].value = readBuffer.texture
        this.highPassUniforms['luminosityThreshold'].value = this.threshold
        this.fsQuad.setMaterial(this.materialHighPassFilter)
        renderer.setRenderTarget(this.renderTargetBright)
        renderer.clear()
        this.fsQuad.render(renderer)
        inputRenderTarget = this.renderTargetBright
        for (var _204_17_ = i = 0, _204_21_ = this.nMips; (_204_17_ <= _204_21_ ? i < this.nMips : i > this.nMips); (_204_17_ <= _204_21_ ? ++i : --i))
        {
            this.fsQuad.setMaterial(this.separableBlurMaterials[i])
            this.separableBlurMaterials[i].uniforms['colorTexture'].value = inputRenderTarget.texture
            this.separableBlurMaterials[i].uniforms['direction'].value = UnrealBloomPass.BlurDirectionX
            renderer.setRenderTarget(this.renderTargetsHorizontal[i])
            renderer.clear()
            this.fsQuad.render(renderer)
            this.separableBlurMaterials[i].uniforms['colorTexture'].value = this.renderTargetsHorizontal[i].texture
            this.separableBlurMaterials[i].uniforms['direction'].value = UnrealBloomPass.BlurDirectionY
            renderer.setRenderTarget(this.renderTargetsVertical[i])
            renderer.clear()
            this.fsQuad.render(renderer)
            inputRenderTarget = this.renderTargetsVertical[i]
        }
        this.fsQuad.setMaterial(this.compositeMaterial)
        this.compositeMaterial.uniforms['bloomStrength'].value = this.strength
        this.compositeMaterial.uniforms['bloomRadius'].value = this.radius
        this.compositeMaterial.uniforms['bloomTintColors'].value = this.bloomTintColors
        renderer.setRenderTarget(this.renderTargetsHorizontal[0])
        renderer.clear()
        this.fsQuad.render(renderer)
        this.fsQuad.setMaterial(this.blendMaterial)
        this.copyUniforms['tDiffuse'].value = this.renderTargetsHorizontal[0].texture
        if (maskActive)
        {
            renderer.state.buffers.stencil.setTest(true)
        }
        if (this.renderToScreen)
        {
            renderer.setRenderTarget(null)
            this.fsQuad.render(renderer)
        }
        else
        {
            renderer.setRenderTarget(readBuffer)
            this.fsQuad.render(renderer)
        }
        renderer.setClearColor(this._oldClearColor,this.oldClearAlpha)
        return renderer.autoClear = oldAutoClear
    }

    getSeperableBlurMaterial (kernelRadius)
    {
        var coefficients, i

        coefficients = []
        for (var _260_17_ = i = 0, _260_21_ = kernelRadius; (_260_17_ <= _260_21_ ? i < kernelRadius : i > kernelRadius); (_260_17_ <= _260_21_ ? ++i : --i))
        {
            coefficients.push(0.39894 * Math.exp(-0.5 * i * i / (kernelRadius * kernelRadius)) / kernelRadius)
        }
        return new ShaderMaterial({defines:{KERNEL_RADIUS:kernelRadius},uniforms:{colorTexture:{value:null},invSize:{value:new Vector2(0.5,0.5)},direction:{value:new Vector2(0.5,0.5)},gaussianCoefficients:{value:coefficients}},vertexShader:`varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,fragmentShader:`#include <common>
varying vec2 vUv;
uniform sampler2D colorTexture;
uniform vec2 invSize;
uniform vec2 direction;
uniform float gaussianCoefficients[KERNEL_RADIUS];

void main() {
    float weightSum = gaussianCoefficients[0];
    vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
    for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
        float x = float(i);
        float w = gaussianCoefficients[i];
        vec2 uvOffset = direction * invSize * x;
        vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
        vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
        diffuseSum += (sample1 + sample2) * w;
        weightSum += 2.0 * w;
    }
    gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
}`})
    }

    getCompositeMaterial (nMips)
    {
        return new ShaderMaterial({defines:{NUM_MIPS:nMips},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1.0},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0.0}},vertexShader:`varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,fragmentShader:`varying vec2 vUv;
uniform sampler2D blurTexture1;
uniform sampler2D blurTexture2;
uniform sampler2D blurTexture3;
uniform sampler2D blurTexture4;
uniform sampler2D blurTexture5;
uniform float bloomStrength;
uniform float bloomRadius;
uniform float bloomFactors[NUM_MIPS];
uniform vec3 bloomTintColors[NUM_MIPS];

float lerpBloomFactor(in float factor) {
    float mirrorFactor = 1.2 - factor;
    return mix(factor, mirrorFactor, bloomRadius);
}

void main() {
    gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
        lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
        lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
        lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
        lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
}`})
    }
}

UnrealBloomPass.BlurDirectionX = new Vector2(1.0,0.0)
UnrealBloomPass.BlurDirectionY = new Vector2(0.0,1.0)
module.exports = UnrealBloomPass