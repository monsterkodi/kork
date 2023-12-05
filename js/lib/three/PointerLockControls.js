// monsterkodi/kode 0.243.0

var _k_

var Euler, EventDispatcher, Vector3, _changeEvent, _euler, _lockEvent, _PI_2, _unlockEvent, _vector

Euler = require('three').Euler
EventDispatcher = require('three').EventDispatcher
Vector3 = require('three').Vector3

_euler = new Euler(0,0,0,'YXZ')
_vector = new Vector3()
_changeEvent = {type:'change'}
_lockEvent = {type:'lock'}
_unlockEvent = {type:'unlock'}
_PI_2 = Math.PI / 2
class PointerLockControls extends EventDispatcher
{
    constructor (camera, domElement)
    {
        super()
    
        this.onPointerlockError = this.onPointerlockError.bind(this)
        this.onPointerlockChange = this.onPointerlockChange.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.camera = camera
        this.domElement = domElement
        this.isLocked = false
        this.minPolarAngle = 0
        this.maxPolarAngle = Math.PI
        this.pointerSpeed = 1.0
        this.connect()
    }

    connect ()
    {
        this.domElement.ownerDocument.addEventListener('mousemove',this.onMouseMove)
        this.domElement.ownerDocument.addEventListener('pointerlockchange',this.onPointerlockChange)
        return this.domElement.ownerDocument.addEventListener('pointerlockerror',this.onPointerlockError)
    }

    disconnect ()
    {
        this.domElement.ownerDocument.removeEventListener('mousemove',this.onMouseMove)
        this.domElement.ownerDocument.removeEventListener('pointerlockchange',this.onPointerlockChange)
        return this.domElement.ownerDocument.removeEventListener('pointerlockerror',this.onPointerlockError)
    }

    dispose ()
    {
        return this.disconnect()
    }

    getDirection (v)
    {
        return v.set(0,0,-1).applyQuaternion(this.camera.quaternion)
    }

    moveForward (distance)
    {
        var camera

        camera = this.camera
        _vector.setFromMatrixColumn(camera.matrix,0)
        _vector.crossVectors(camera.up,_vector)
        return camera.position.addScaledVector(_vector,distance)
    }

    moveRight (distance)
    {
        var camera

        camera = this.camera
        _vector.setFromMatrixColumn(camera.matrix,0)
        return camera.position.addScaledVector(_vector,distance)
    }

    lock ()
    {
        return this.domElement.requestPointerLock()
    }

    unlock ()
    {
        return this.domElement.ownerDocument.exitPointerLock()
    }

    onMouseMove (event)
    {
        var camera, movementX, movementY

        if (!this.isLocked)
        {
            return
        }
        movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
        movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0
        camera = this.camera
        _euler.setFromQuaternion(camera.quaternion)
        _euler.y -= movementX * 0.002 * this.pointerSpeed
        _euler.x -= movementY * 0.002 * this.pointerSpeed
        _euler.x = Math.max(_PI_2 - this.maxPolarAngle,Math.min(_PI_2 - this.minPolarAngle,_euler.x))
        camera.quaternion.setFromEuler(_euler)
        return this.dispatchEvent(_changeEvent)
    }

    onPointerlockChange ()
    {
        if (this.domElement.ownerDocument.pointerLockElement === this.domElement)
        {
            this.dispatchEvent(_lockEvent)
            return this.isLocked = true
        }
        else
        {
            this.dispatchEvent(_unlockEvent)
            return this.isLocked = false
        }
    }

    onPointerlockError ()
    {
        console.error('THREE.PointerLockControls: Unable to use Pointer Lock API')
    }
}

module.exports = PointerLockControls