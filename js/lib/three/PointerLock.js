// monsterkodi/kode 0.243.0

var _k_

var EventDispatcher

EventDispatcher = require('three').EventDispatcher

class PointerLock extends EventDispatcher
{
    constructor (domElement)
    {
        super()
    
        this.onPointerLockError = this.onPointerLockError.bind(this)
        this.onPointerLockChange = this.onPointerLockChange.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.domElement = domElement
        this.isLocked = false
        this.connect()
    }

    connect ()
    {
        this.domElement.ownerDocument.addEventListener('pointerlockchange',this.onPointerLockChange)
        return this.domElement.ownerDocument.addEventListener('pointerlockerror',this.onPointerLockError)
    }

    disconnect ()
    {
        this.domElement.ownerDocument.removeEventListener('pointerlockchange',this.onPointerLockChange)
        return this.domElement.ownerDocument.removeEventListener('pointerlockerror',this.onPointerLockError)
    }

    dispose ()
    {
        return this.disconnect()
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
        var movementX, movementY

        if (!this.isLocked)
        {
            return
        }
        movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
        movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0
        return world.player.onPointerLock(movementX,movementY,event)
    }

    onPointerLockChange ()
    {
        return this.isLocked = this.domElement.ownerDocument.pointerLockElement === this.domElement
    }

    onPointerLockError ()
    {
        console.error('PointerLock: Unable to use Pointer Lock API')
    }
}

module.exports = PointerLock