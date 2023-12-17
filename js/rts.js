// monsterkodi/kode 0.245.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isFunc: function (o) {return typeof o === 'function'}}

var Camera, Config, CopyShader, Debug, deg2rad, e, EffectComposer, elem, expose, FPS, GridHelper, Info, kxk, Map, Menu, PlayerCamera, PointerLock, post, prefs, rad2deg, randInt, randIntRange, randRange, RenderPass, setShadow, Sound, stopEvent, Text, tmpMatrix, UnrealBloomPass, World, _

kxk = require('kxk')
_ = require('kxk')._
deg2rad = require('kxk').deg2rad
elem = require('kxk').elem
first = require('kxk').first
last = require('kxk').last
post = require('kxk').post
prefs = require('kxk').prefs
rad2deg = require('kxk').rad2deg
randInt = require('kxk').randInt
randIntRange = require('kxk').randIntRange
randRange = require('kxk').randRange
stopEvent = require('kxk').stopEvent

window.$ = kxk.$
window._ = _
window.post = post
window.prefs = prefs
window.randInt = randInt
window.randIntRange = randIntRange
window.randRange = randRange
window.deg2rad = deg2rad
window.rad2deg = rad2deg
window.stopEvent = stopEvent
window.first = first
window.last = last
window.elem = elem
window.abs = Math.abs
window.THREE = require('three')
expose = `Ray
Mesh
Line3
Color
Group
Plane
Matrix3
Matrix4
Sphere
CurvePath
BoxGeometry
PlaneGeometry
SphereGeometry
CircleGeometry
CylinderGeometry
LineSegments
QuadraticBezierCurve3
CubicBezierCurve3
BufferGeometry
BufferAttribute
InstancedMesh`
var list = _k_.list(expose.split('\n'))
for (var _54_6_ = 0; _54_6_ < list.length; _54_6_++)
{
    e = list[_54_6_]
    window[e] = THREE[e]
}
CopyShader = require('./lib/three/CopyShader')
EffectComposer = require('./lib/three/EffectComposer')
RenderPass = require('./lib/three/RenderPass')
UnrealBloomPass = require('./lib/three/UnrealBloomPass')
Text = require('troika-three-text').Text

window.Text = Text

setShadow = function ()
{
    return this.castShadow = this.receiveShadow = true
}
setShadow.bind(window.Mesh)
window.Mesh.prototype.setShadow = setShadow
window.Vector = require('./lib/vector')
window.Quaternion = require('./lib/quaternion')
window.Colors = require('./const/colors')
window.Materials = require('./const/materials')
window.Geom = require('./const/geometry')

window.playSound = function (o, n, c)
{
    return rts.sound.play(o,n,c)
}
window.Param = require('./lib/param')
window.Toggle = require('./lib/toggle')
FPS = require('./lib/fps')
Info = require('./lib/info')
Debug = require('./debug')
Sound = require('./lib/sound')
GridHelper = require('./lib/gridhelper')
Config = require('./const/config')
Menu = require('./menu/menu')
World = require('./world/world')
Map = require('./world/map')
Camera = require('./lib/camera')
PlayerCamera = require('./player/camera')
PointerLock = require('./lib/three/PointerLock')
tmpMatrix = new THREE.Matrix3
class RTS
{
    constructor (view)
    {
        var cam, canvas, _151_74_

        this.view = view
    
        this.onDblClick = this.onDblClick.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.animationStep = this.animationStep.bind(this)
        this.setFog = this.setFog.bind(this)
        new Param("speed",6,{max:12,step:1,fixed:0,change:(function (value)
        {
            return world.setSpeed(value)
        }).bind(this)})
        new Param("bloom",1,{max:1.0,step:0.01,fixed:2,change:(function (value)
        {
            return this.bloomPass.strength = value
        }).bind(this)})
        new Param("thresh",0.2,{max:1.0,step:0.01,fixed:2,change:(function (value)
        {
            return this.bloomPass.threshold = value
        }).bind(this)})
        new Param("ambient",0.02,{max:1.0,step:0.02,fixed:2,change:(function (value)
        {
            return this.lightAmbient.intensity = value
        }).bind(this)})
        new Param("point",6,{max:30,step:0.1,fixed:1,change:(function (value)
        {
            return this.lightPlayer.intensity = value
        }).bind(this)})
        new Param("decay",1,{max:2,step:0.1,fixed:1,change:(function (value)
        {
            return this.lightPlayer.decay = value
        }).bind(this)})
        new Param("sun",3,{max:10,step:0.1,fixed:1,change:(function (value)
        {
            return this.lightShadow.intensity = value
        }).bind(this)})
        new Param("far",3000,{min:500,max:5000,step:1,fixed:0,change:(function (value)
        {
            var _104_123_

            this.playerCamera.far = value
            if ((this.scene.fog != null)) { this.scene.fog.far = value }
            return this.playerCamera.updateProjectionMatrix()
        }).bind(this)})
        new Toggle('wire',{change:function (value)
        {
            return Materials.setWire(value)
        }})
        new Toggle('axes',{change:function (value)
        {
            return rts.axesHelper.visible = value
        }})
        new Toggle('arrow',{change:function (value)
        {
            return rts.arrowHelper.visible = value
        }})
        new Toggle('shadow',{change:function (value)
        {
            return rts.shadowCameraHelper.visible = value
        }})
        new Toggle('light',{change:function (value)
        {
            return rts.lightShadowHelper.visible = value
        }})
        new Toggle('grid',{change:function (value)
        {
            return rts.gridHelper.visible = value
        }})
        new Toggle('label',{change:function (value)
        {
            return world.setLabels(value)
        }})
        new Toggle('glow',{default:true,change:function (value)
        {
            return rts.setBloom(value)
        }})
        new Toggle('fog',{default:true,change:function (value)
        {
            return rts.setFog(value)
        }})
        window.rts = this
        window.config = Config.default
        this.sound = new Sound
        this.fps = new FPS
        this.paused = false
        this.animations = []
        this.worldAnimations = []
        this.renderer = new THREE.WebGLRenderer({antialias:false})
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.view.clientWidth,this.view.clientHeight)
        this.renderer.setClearColor(Colors.clear)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.info.autoReset = false
        this.playerCamera = new PlayerCamera({view:this.view})
        this.debugCamera = new Camera({view:this.view})
        this.camera = this.playerCamera
        this.scene = new THREE.Scene()
        canvas = this.renderer.domElement
        this.initComposer()
        this.view.appendChild(this.renderer.domElement)
        this.lightAmbient = new THREE.AmbientLight(0xffffff,Param.get('ambient'))
        this.scene.add(this.lightAmbient)
        this.lightPlayer = new THREE.PointLight(0xffffff,Param.get('point'),0,Param.get('decay'))
        if ((this.player != null))
        {
            this.lightPlayer.position.copy(this.player.camera.getPosition())
        }
        this.lightPlayer.position.copy(this.camera.position)
        this.scene.add(this.lightPlayer)
        this.lightAngle = 0
        this.lightShadow = new THREE.DirectionalLight(0xffffff,Param.get('sun'))
        this.lightShadow.castShadow = true
        this.lightShadow.position.set(-50,-100,100)
        this.lightShadow.target.position.set(0,0,0)
        this.lightShadow.shadow.mapSize.width = 2 * 2048
        this.lightShadow.shadow.mapSize.height = 2 * 2048
        this.lightShadow.shadow.camera.near = 0.5
        this.lightShadow.shadow.camera.far = 1000
        this.lightShadow.shadow.camera.left = -200
        this.lightShadow.shadow.camera.right = 200
        this.lightShadow.shadow.camera.top = 200
        this.lightShadow.shadow.camera.bottom = -200
        this.scene.add(this.lightShadow)
        this.initHelpers()
        this.mouse = vec()
        this.downPos = vec()
        this.raycaster = new THREE.Raycaster()
        new Map(this.scene)
        if (cam = prefs.get('camera'))
        {
            this.setCamera(cam)
        }
        this.pointerLock = new PointerLock(this.view)
        this.menu = new Menu
        document.addEventListener('mousemove',this.onMouseMove)
        document.addEventListener('mousedown',this.onMouseDown)
        document.addEventListener('mouseup',this.onMouseUp)
        document.addEventListener('dblclick',this.onDblClick)
        this.lastAnimationTime = window.performance.now()
        this.lastTimeStamp = this.lastAnimationTime
        if (!prefs.get('save'))
        {
            world.create()
        }
        else
        {
            post.emit('load')
        }
        this.animationStep()
        this.paused = prefs.get('paused',false)
        this.debug = new Debug(this.view)
        Toggle.applyAll()
        Param.applyAll()
    }

    setFog (fog)
    {
        if (fog)
        {
            return this.scene.fog = new THREE.Fog(Colors.fog,100,1000)
        }
        else
        {
            return delete this.scene.fog
        }
    }

    initHelpers ()
    {
        this.lightShadowHelper = new THREE.DirectionalLightHelper(this.lightShadow,5,new THREE.Color(0xffff00))
        this.scene.add(this.lightShadowHelper)
        this.shadowCameraHelper = new THREE.CameraHelper(this.lightShadow.shadow.camera)
        this.scene.add(this.shadowCameraHelper)
        this.gridHelper = new GridHelper()
        this.gridHelper.position.z += 1
        this.scene.add(this.gridHelper)
        this.axesHelper = new THREE.AxesHelper(5)
        this.axesHelper.position.copy(this.camera.center)
        this.axesHelper.material.depthWrite = false
        this.axesHelper.material.depthTest = false
        this.axesHelper.material.depthFunc = THREE.NeverDepth
        this.scene.add(this.axesHelper)
        this.arrowHelper = new THREE.ArrowHelper(vec(0,0,1),this.camera.center,5,0x8888ff)
        return this.scene.add(this.arrowHelper)
    }

    setCamera (cfg = {dist:10,rotate:45,degree:45})
    {
        var _257_36_, _258_36_, _259_36_, _261_18_

        if (this.camera !== this.debugCamera)
        {
            return
        }
        this.camera.dist = ((_257_36_=cfg.dist) != null ? _257_36_ : 10)
        this.camera.rotate = ((_258_36_=cfg.rotate) != null ? _258_36_ : 45)
        this.camera.degree = ((_259_36_=cfg.degree) != null ? _259_36_ : 45)
        if ((cfg.pos != null))
        {
            this.camera.focusOnPoint(vec(cfg.pos))
        }
        else if (cfg.center)
        {
            this.camera.focusOnPoint(vec(cfg.center))
        }
        return this.camera.update()
    }

    resetCamera (mode = 'free')
    {
        if (this.camera !== this.debugCamera)
        {
            return
        }
        this.camera.focusOnPoint(vec(0,0,0))
        switch (mode)
        {
            case 'top':
                this.camera.rotate = this.camera.degree = 0
                break
            case 'front':
                this.camera.rotate = 0
                this.camera.degree = 90
                break
            case 'side':
                this.camera.rotate = -90
                this.camera.degree = 90
                break
            default:
                this.camera.rotate = -15
                this.camera.degree = 45
        }

        return this.axesHelper.position.copy(vec(0,0,0))
    }

    initComposer ()
    {
        var radius, renderTarget, resolution, size, strength, threshold, vh, vw

        size = this.renderer.getDrawingBufferSize(new THREE.Vector2())
        renderTarget = new THREE.WebGLRenderTarget(size.width,size.height,{samples:1})
        vw = this.view.clientWidth
        vh = this.view.clientHeight
        this.composer = new EffectComposer(this.renderer,renderTarget)
        this.composer.setPixelRatio(window.devicePixelRatio)
        this.composer.setSize(vw,vh)
        this.composer.addPass(new RenderPass(this.scene,this.camera))
        resolution = new THREE.Vector2(vw * 0.125,vh * 0.125)
        strength = Param.get('bloom')
        threshold = Param.get('thresh')
        radius = 0.1
        return this.bloomPass = new UnrealBloomPass(resolution,strength,radius,threshold,5)
    }

    setBloom (bloom)
    {
        this.composer.removePass(this.bloomPass)
        if (bloom)
        {
            return this.composer.addPass(this.bloomPass)
        }
    }

    toggleDebug ()
    {
        return this.debug.toggle()
    }

    animate (func)
    {
        return this.animations.push(func)
    }

    deanimate (func)
    {
        var index

        if ((index = this.animations.indexOf(func)) >= 0)
        {
            return this.animations.splice(index,1)
        }
    }

    animateWorld (func)
    {
        return this.worldAnimations.push(func)
    }

    togglePause ()
    {
        this.paused = !this.paused
        prefs.set('paused',this.paused)
        return post.emit('pause',this.paused)
    }

    animationStep (timeStamp)
    {
        var animation, delta, lightOffset, now, oldAnimations, oldWorldAnimations

        now = window.performance.now()
        delta = (timeStamp - this.lastTimeStamp) * 0.001
        window.requestAnimationFrame(this.animationStep)
        if (!timeStamp)
        {
            return
        }
        this.lastAnimationTime = now
        this.lastTimeStamp = timeStamp
        oldAnimations = this.animations.clone()
        this.animations = []
        var list1 = _k_.list(oldAnimations)
        for (var _358_22_ = 0; _358_22_ < list1.length; _358_22_++)
        {
            animation = list1[_358_22_]
            animation(delta)
        }
        this.menu.animate(delta)
        if (!this.paused)
        {
            world.animate(delta)
            this.lightShadow.target.position.copy(world.player.mesh.position)
            this.lightShadow.position.copy(world.player.mesh.position)
            lightOffset = vec(-50,-100,100)
            lightOffset.applyQuaternion(Quaternion.axisAngle(Vector.unitZ,this.lightAngle))
            this.lightShadow.position.add(lightOffset)
            this.lightShadowHelper.update()
            oldWorldAnimations = this.worldAnimations.clone()
            this.worldAnimations = []
            var list2 = _k_.list(oldWorldAnimations)
            for (var _378_26_ = 0; _378_26_ < list2.length; _378_26_++)
            {
                animation = list2[_378_26_]
                animation(delta * world.speed)
            }
            this.camera.update(delta)
        }
        return this.render(delta)
    }

    onMouseDown (event)
    {
        var _404_32_, _404_41_

        this.calcMouse(event)
        this.downPos.copy(this.mouse)
        this.camMove = event.button !== 1
        if (this.downHit = this.castRay())
        {
            if (event.buttons === 1)
            {
                if (_k_.isFunc(((_404_32_=this.downHit.mesh) != null ? (_404_41_=_404_32_.handler) != null ? _404_41_.onMouseDown : undefined : undefined)))
                {
                    this.downHit.mesh.handler.onMouseDown(this.downHit,event)
                }
            }
        }
        return post.emit('mouseDown',this.downHit,event)
    }

    onMouseUp (event)
    {
        var hit, moved, _415_19_, _415_25_, _417_24_, _417_30_, _417_39_, _420_19_, _420_25_, _420_34_

        this.calcMouse(event)
        hit = this.castRay()
        if (_k_.isFunc(((_415_19_=this.downHit) != null ? (_415_25_=_415_19_.mesh) != null ? _415_25_.onDragDone : undefined : undefined)))
        {
            this.downHit.mesh.onDragDone(hit,this.downHit)
        }
        else if (_k_.isFunc(((_417_24_=this.downHit) != null ? (_417_30_=_417_24_.mesh) != null ? (_417_39_=_417_30_.handler) != null ? _417_39_.onDragDone : undefined : undefined : undefined)))
        {
            this.downHit.mesh.handler.onDragDone(hit,this.downHit)
        }
        if (_k_.isFunc(((_420_19_=this.downHit) != null ? (_420_25_=_420_19_.mesh) != null ? (_420_34_=_420_25_.handler) != null ? _420_34_.onMouseUp : undefined : undefined : undefined)))
        {
            this.downHit.mesh.handler.onMouseUp(hit,this.downHit)
        }
        post.emit('mouseUp',hit,this.downHit)
        moved = this.downPos.dist(this.mouse)
        if (moved < 0.001)
        {
            this.onClick(event)
        }
        if (moved < 0.01)
        {
            this.focusOnHit()
        }
        Node.skipCenter = false
        return delete this.camMove
    }

    onMouseMove (event)
    {
        var hit, _447_27_, _447_33_, _449_32_, _449_38_, _449_47_, _454_23_, _455_27_, _455_33_, _457_32_, _457_38_, _457_47_, _459_27_, _461_32_, _461_41_

        this.pointerLock.onMouseMove(event)
        this.calcMouse(event)
        if (!Toggle.get('arrow'))
        {
            return
        }
        if (hit = this.castRay())
        {
            if (event.buttons === 1)
            {
                if (_k_.isFunc(((_447_27_=this.downHit) != null ? (_447_33_=_447_27_.mesh) != null ? _447_33_.onDrag : undefined : undefined)))
                {
                    this.downHit.mesh.onDrag(hit,this.downHit,this.lastHit)
                }
                else if (_k_.isFunc(((_449_32_=this.downHit) != null ? (_449_38_=_449_32_.mesh) != null ? (_449_47_=_449_38_.handler) != null ? _449_47_.onDrag : undefined : undefined : undefined)))
                {
                    this.downHit.mesh.handler.onDrag(hit,this.downHit,this.lastHit)
                }
            }
            post.emit('mouseMove',hit,this.downHit,this.lastHit)
            if ((this.lastHit != null ? this.lastHit.mesh : undefined) !== hit.mesh)
            {
                if (_k_.isFunc(((_455_27_=this.lastHit) != null ? (_455_33_=_455_27_.mesh) != null ? _455_33_.onLeave : undefined : undefined)))
                {
                    this.lastHit.mesh.onLeave(this.lastHit,hit,event)
                }
                else if (_k_.isFunc(((_457_32_=this.lastHit) != null ? (_457_38_=_457_32_.mesh) != null ? (_457_47_=_457_38_.handler) != null ? _457_47_.onLeave : undefined : undefined : undefined)))
                {
                    this.lastHit.mesh.handler.onLeave(this.lastHit,hit,event)
                }
                if (_k_.isFunc((hit.mesh != null ? hit.mesh.onEnter : undefined)))
                {
                    hit.mesh.onEnter(hit,this.lastHit,event)
                }
                else if (_k_.isFunc(((_461_32_=hit.mesh) != null ? (_461_41_=_461_32_.handler) != null ? _461_41_.onEnter : undefined : undefined)))
                {
                    hit.mesh.handler.onEnter(hit,this.lastHit,event)
                }
            }
            return this.lastHit = hit
        }
    }

    onClick (event)
    {
        var hit, _469_23_, _472_28_, _472_37_

        if (hit = this.castRay())
        {
            if (_k_.isFunc((hit.mesh != null ? hit.mesh.onClick : undefined)))
            {
                if (this.downHit.mesh === hit.mesh)
                {
                    return hit.mesh.onClick(hit,event)
                }
            }
            else if (_k_.isFunc(((_472_28_=hit.mesh) != null ? (_472_37_=_472_28_.handler) != null ? _472_37_.onClick : undefined : undefined)))
            {
                if (this.downHit.mesh === hit.mesh)
                {
                    return hit.mesh.handler.onClick(hit,event)
                }
            }
        }
    }

    onDblClick (event)
    {
        var hit, _480_23_, _482_28_, _482_37_

        if (hit = this.castRay())
        {
            if (_k_.isFunc((hit.mesh != null ? hit.mesh.onDoubleClick : undefined)))
            {
                return hit.mesh.onDoubleClick(hit)
            }
            else if (_k_.isFunc(((_482_28_=hit.mesh) != null ? (_482_37_=_482_28_.handler) != null ? _482_37_.onDoubleClick : undefined : undefined)))
            {
                return hit.mesh.handler.onDoubleClick(hit)
            }
        }
    }

    calcMouse (event)
    {
        var br

        br = this.view.getBoundingClientRect()
        this.mouse.x = ((event.clientX - 6) / br.width) * 2 - 1
        this.mouse.y = -((event.clientY - br.top) / br.height) * 2 + 1
        return this.mouse
    }

    focusOnHit ()
    {
        var hit, _495_31_

        if (hit = this.castRay())
        {
            ;(typeof this.camera.fadeToPoint === "function" ? this.camera.fadeToPoint(hit.point) : undefined)
            return this.axesHelper.position.copy(hit.point)
        }
    }

    castRay ()
    {
        var info, intersect, intersects, norm, point, ray

        this.raycaster.setFromCamera(this.mouse,this.camera)
        intersects = this.raycaster.intersectObjects(world.pickables,true)
        intersects = intersects.filter(function (i)
        {
            return i.object.noHitTest !== true
        })
        intersect = intersects[0]
        if (!intersect)
        {
            return
        }
        point = intersect.point
        norm = intersect.face.normal.clone()
        tmpMatrix.getNormalMatrix(intersect.object.matrixWorld)
        norm.applyMatrix3(tmpMatrix)
        this.arrowHelper.setDirection(norm)
        this.arrowHelper.position.copy(point)
        ray = new Ray(this.camera.position,vec(this.camera.position).to(point).normalize())
        info = {name:intersect.object.name,point:point,norm:norm,dist:intersect.distance,mesh:intersect.object,ray:ray}
        return info
    }

    render (delta)
    {
        var info, _567_18_, _569_21_

        this.lightPlayer.position.copy(this.camera.position)
        this.renderer.render(world.scene,this.camera)
        info = {vecs:Vector.counter,quats:Quaternion.counter,frame:this.renderer.info.render.frame,calls:this.renderer.info.render.calls,lines:this.renderer.info.render.lines,points:this.renderer.info.render.points,textures:this.renderer.info.memory.textures,programs:this.renderer.info.programs.length,geometries:this.renderer.info.memory.geometries,triangles:this.renderer.info.render.triangles}
        this.composer.render()
        this.renderer.info.reset()
        this.fps.draw(delta)
        if (prefs.get('info'))
        {
            this.info = ((_567_18_=this.info) != null ? _567_18_ : new Info)
            return this.info.draw(info)
        }
        else if ((this.info != null))
        {
            this.info.del()
            return delete this.info
        }
    }

    setPlayerCamera (usePlayerCam)
    {
        if (usePlayerCam)
        {
            return this.camera = this.playerCamera
        }
        else
        {
            return this.camera = this.debugCamera
        }
    }

    hasPlayerCamera ()
    {
        return this.camera === this.playerCamera
    }

    resized (w, h)
    {
        this.renderer.setSize(w,h)
        this.composer.setSize(w,h)
        this.camera.aspect = w / h
        this.camera.size.set(w,h)
        return this.camera.updateProjectionMatrix()
    }

    onKeyDown (combo)
    {
        if (world.onKeyDown(combo) !== 'unhandled')
        {
            return
        }
        if (this.camera.onKeyDown(combo) !== 'unhandled')
        {
            return
        }
        return 'unhandled'
    }

    onKeyUp (combo)
    {
        if (world.onKeyUp(combo) !== 'unhandled')
        {
            return
        }
        if (this.camera.onKeyUp(combo) !== 'unhandled')
        {
            return
        }
        return 'unhandled'
    }
}

module.exports = RTS