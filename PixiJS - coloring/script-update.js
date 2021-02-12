//кнопка сохранения в localStorage
const save = Sprite.from('images/save.png')
save.anchor.set(.5)
save.x = app.screen.width - 30
save.y = 70
save.scale.set(.05)
save.interactive = true
save.buttonMode = true

save.on('pointerdown', saveGame)
app.stage.addChild(save)


function saveGame() {
    const colList = []
    container.children.forEach(child => colList.push(child.color))
    localStorage.setItem('colors', colList)
    colList.length = 0
}

//кнопка сохранения в localStorage
const load = Sprite.from('images/load.png')
load.anchor.set(.5)
load.x = app.screen.width - 30
load.y = 110
load.scale.set(.05)
load.interactive = true
load.buttonMode = true

load.on('pointerdown', loadGame)
app.stage.addChild(load)

function loadGame() {
    const loaded = localStorage.getItem('colors').split(',')
//    console.log(loaded)/
//    console.log(sqrs)
    for (let i = 0; i < sqrs.length; i++) {
        sqrs[i].clear()
        sqrs[i].beginFill(loaded[i])
        sqrs[i].lineStyle(1, 0x000000, 1)
        sqrs[i].drawRect(0, 0, 32, 32)
        sqrs[i].endFill()
    }
}
//    container.children.forEach(child => container.removeChild(child))
//
//
//    for (let i = 0; i < 49; i++) {
//    let sqr = new Graphics()
//    sqr.lineStyle(1, 0x000000, 1);
//    sqr.beginFill(loaded[i])
//    sqr.drawRect(0, 0, 32, 32)
//    sqr.endFill()
//    sqr.interactive = true;
//    sqr.buttonMode = true;
//    sqr.color = loaded[i]
//    sqr.x = (i % 7) * 32
//    sqr.y = Math.floor(i / 7) * 32
//    sqr.on('pointerdown', sqrClick)
//    container.addChild(sqr)
//    }
//}
