// monsterkodi/kode 0.243.0

var _k_

var color, Colors


color = function (v)
{
    return new THREE.Color(v)
}
Colors = {clear:color(0x000000),fog:color(0x000000),black:color(0x000000),white:color(0xffffff),mining:{water:color(0x2222ff),blood:color(0x4444ff),stuff:color(0x6666ff),chalk:color(0x8888ff)},menu:{background:color(0x181818),backgroundHover:color(0x202020),progress:color(0x8888ff),disconnected:color(0x000000),active:color(0x333333),inactive:color(0x333333),activeHigh:color(0xffffff),inactiveHigh:color(0x555555)}}
module.exports = Colors