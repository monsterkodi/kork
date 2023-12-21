// monsterkodi/kode 0.245.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var CANNON, CannonDebugger, Physics

CANNON = require('cannon-es')
CannonDebugger = require('cannon-es-debugger')

Physics = (function ()
{
    function Physics ()
    {
        var constraint, groundBody

        this.cannon = new CANNON.World({gravity:new CANNON.Vec3(0,0,-9)})
        this.cannonDebugger = new CannonDebugger(world.scene,this.cannon)
        groundBody = new CANNON.Body({type:CANNON.Body.STATIC,shape:new CANNON.Plane()})
        groundBody.position.z = -0.5
        this.cannon.addBody(groundBody)
        if (false)
        {
            this.cylinderBody1 = new CANNON.Body({mass:0.1,shape:new CANNON.Cylinder(0.8,1,4,16)})
            this.cylinderBody1.position.set(-5,0,5)
            this.cylinderBody1.shapeOrientations[0].setFromVectors(new CANNON.Vec3(0,1,0),new CANNON.Vec3(0,0,1))
            this.cannon.addBody(this.cylinderBody1)
            this.cylinderBody2 = new CANNON.Body({mass:0.1,shape:new CANNON.Cylinder(0.5,1,4,16)})
            this.cylinderBody2.position.set(5,0,5)
            this.cylinderBody2.shapeOrientations[0].setFromVectors(new CANNON.Vec3(0,1,0),new CANNON.Vec3(0,0,1))
            this.cannon.addBody(this.cylinderBody2)
            constraint = new CANNON.ConeTwistConstraint(this.cylinderBody1,this.cylinderBody2,{collideConnected:true,wakeUpBodies:true,axisA:new CANNON.Vec3(0,0,1),pivotA:new CANNON.Vec3(0,0,3),axisB:new CANNON.Vec3(0,0,-1),pivotB:new CANNON.Vec3(0,0,3),maxForce:10,twistAngle:deg2rad(180)})
            this.cannon.addConstraint(constraint)
        }
    }

    Physics.prototype["clear"] = function ()
    {
        var body, meshBodies

        meshBodies = this.cannon.bodies.filter(function (b)
        {
            return b.mesh && !b.keep
        })
        var list = _k_.list(meshBodies)
        for (var _55_17_ = 0; _55_17_ < list.length; _55_17_++)
        {
            body = list[_55_17_]
            this.removeBody(body)
        }
    }

    Physics.prototype["addBody"] = function (body)
    {
        return this.cannon.addBody(body)
    }

    Physics.prototype["removeBody"] = function (body)
    {
        body.mesh.removeFromParent()
        delete body.obj.body
        delete body.obj
        delete body.mesh
        return this.cannon.removeBody(body)
    }

    Physics.prototype["simulate"] = function (scaledDelta, timeSum)
    {
        var b, cnt, p, q

        console.log('physics')
        p = vec()
        q = new Quaternion
        cnt = 0
        var list = _k_.list(this.cannon.bodies)
        for (var _78_14_ = 0; _78_14_ < list.length; _78_14_++)
        {
            b = list[_78_14_]
            if (b.kinematic)
            {
                cnt++
                b.kinematic.getWorldPosition(p)
                b.kinematic.getWorldQuaternion(q)
                b.position.copy(p)
                b.quaternion.copy(q)
            }
        }
        this.cannon.step(1 / 60,scaledDelta,10)
        if (prefs.get('cannon'))
        {
            this.cannonDebugger.update()
        }
        var list1 = _k_.list(this.cannon.bodies)
        for (var _90_14_ = 0; _90_14_ < list1.length; _90_14_++)
        {
            b = list1[_90_14_]
            if (b.mesh)
            {
                b.mesh.position.copy(b.position)
                b.mesh.quaternion.copy(b.quaternion)
            }
        }
    }

    return Physics
})()

module.exports = Physics