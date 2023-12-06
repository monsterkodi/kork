// monsterkodi/kode 0.243.0

var _k_

var material, Materials


material = function (color, cfg)
{
    var clss

    cfg.color = color
    clss = THREE.MeshStandardMaterial
    switch (cfg.typ)
    {
        case 'lambert':
            clss = THREE.MeshLambertMaterial
            break
        case 'basic':
            clss = THREE.MeshBasicMaterial
            break
        case 'shadow':
            clss = THREE.ShadowMaterial
            break
        case 'toon':
            clss = THREE.MeshToonMaterial
            break
    }

    delete cfg.typ
    return new clss(cfg)
}
Materials = {misc:{transparent:material(0x888888,{typ:'lambert',depthWrite:false,transparent:true,opacity:0.1}),flat:material(0xffffff,{metalness:0.5,roughness:0.7,flatShading:true,dithering:true}),toon:material(0xffffff,{typ:'toon'})},shinyblack:material(0x000000,{metalness:0.6,roughness:0.1,flatShading:true}),landscape:material(0x555555,{metalness:1.0,roughness:1.0,dithering:true}),player:material(0x8888ff,{metalness:0.0,roughness:0.15,dithering:true}),wireframe:material(0x888888,{typ:'basic',wireframe:true}),floor:material(0x020202,{metalness:0.2,roughness:0.8,dithering:true}),shadow:material(0x000000,{typ:'shadow',opacity:0.2,depthWrite:false}),station:{side:material(0x000000,{metalness:0.5,roughness:0.2,dithering:true,side:THREE.DoubleSide})},menu:{active:material(Colors.menu.active,{metalness:0.2,roughness:0.5,emissive:Colors.menu.active}),inactive:material(Colors.menu.inactive,{metalness:0.9,roughness:0.75}),activeHigh:material(Colors.menu.activeHigh,{metalness:0.9,roughness:0.75}),inactiveHigh:material(Colors.menu.inactiveHigh,{metalness:0.9,roughness:0.75})},mining:{water:material(Colors.mining.water,{metalness:0.6,roughness:0.01,emissive:Colors.mining.water}),blood:material(Colors.mining.blood,{metalness:0.6,roughness:0.01,emissive:Colors.mining.blood}),stuff:material(Colors.mining.stuff,{metalness:0.6,roughness:0.01,emissive:Colors.mining.stuff}),chalk:material(Colors.mining.chalk,{metalness:0.6,roughness:0.01,emissive:Colors.mining.chalk})},setWire:function (wire)
{
    var t

    prefs.set('wire',wire)
    var list = ['floor','landscape']
    for (var _48_14_ = 0; _48_14_ < list.length; _48_14_++)
    {
        t = list[_48_14_]
        Materials[t].wireframe = wire
    }
},getWire:function ()
{
    return prefs.get('wire')
},toggleWire:function ()
{
    return Materials.setWire(!Materials.getWire())
},setFlat:function (flat)
{
    var t

    prefs.set('flat',flat)
    var list = ['floor','landscape']
    for (var _57_14_ = 0; _57_14_ < list.length; _57_14_++)
    {
        t = list[_57_14_]
        Materials[t].flatShading = flat
        Materials[t].needsUpdate = true
    }
},getFlat:function ()
{
    return prefs.get('flat')
},toggleFlat:function ()
{
    return Materials.setFlat(!Materials.getFlat())
}}
module.exports = Materials