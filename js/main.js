// monsterkodi/kode 0.245.0

var _k_

var app, main

app = require('kxk').app

class Main extends app
{
    constructor ()
    {
        super({dir:__dirname,dirs:['./const','./lib','./lib/three','./menu','./player','./enemy','./world'],pkg:require('../package.json'),index:'index.html',icon:'../img/app.ico',about:'../img/about.png',minWidth:500,minHeight:320,singleWindow:true})
    }
}

main = new Main()