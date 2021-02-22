//________________________________
//ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ


let Application = PIXI.Application,
    loader = PIXI.Loader,
    resources = PIXI.Loader.resources,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics,
    Container = PIXI.Container,
    Text = PIXI.Text


let app = new Application({
    width: 512,
    height: 512,
    antialias: true,
    transparent: false,
    resolution: 1,
    backgroundColor: 0x1099bb
})

document.body.appendChild(app.view)

const img = document.getElementById('canvas_image')
const mainColors = getMainColors(img)
const tenColors = getMainPalette(img)
const mainPalette = {}
for (let i = 0; i < tenColors.length; i++) {
    mainPalette[rgb2hex(tenColors[i][0], tenColors[i][1], tenColors[i][2])] = i
}
const finalColors = []
for (let color of mainColors) {
    let closest = closestColor(color, tenColors)
    finalColors.push(rgb2hex(closest[0], closest[1], closest[2]))
}
let pointerDown = false,
    mouseposition = app.renderer.plugins.interaction.mouse.global,
    selectedColor,
    colorSelected = false,
    circles = [],
    sqrs = [],
    scaleCount = 0


//__________________________________
//СПРАЙТЫ И ВЫЗОВ КОЛЛБЭКОВ


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


//кнопка перезагрузка игры
const reset = Sprite.from('images/reset.png')
reset.anchor.set(.5)
reset.x = app.screen.width - 30
reset.y = 30
reset.scale.set(.05)
reset.interactive = true
reset.buttonMode = true

//    прослушивание клика и функция обработчик
reset.on('pointerdown', resetClick)

app.stage.addChild(reset)

//кнопка увеличения контейнера
const resizeBig = Sprite.from('images/resizeBig.png')
resizeBig.anchor.set(.5)
resizeBig.x = app.screen.width - 30
resizeBig.y = app.screen.height - 60
resizeBig.scale.set(.045)
resizeBig.interactive = true
resizeBig.buttonMode = true

//    прослушивание клика и функция обработчик
resizeBig.on('pointerdown', resizeBigClick)

app.stage.addChild(resizeBig)

//кнопка уменьшения контейнера
const resizeSm = Sprite.from('images/resizeSmall.png')
resizeSm.anchor.set(.5)
resizeSm.x = app.screen.width - 30
resizeSm.y = app.screen.height - 30
resizeSm.scale.set(.05)
resizeSm.interactive = true
resizeSm.buttonMode = true

//    прослушивание клика и функция обработчик
resizeSm.on('pointerdown', resizeSmClick)

app.stage.addChild(resizeSm)

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

//ПРОВЕРКА ПРОХОЖДЕНИЯ ИГРЫ
const checkStatus = Sprite.from('images/checked.png')
checkStatus.anchor.set(.5)
checkStatus.x = app.screen.width / 2
checkStatus.y = app.screen.height - 30
checkStatus.scale.set(.06)
checkStatus.interactive = true
checkStatus.buttonMode = true

checkStatus.on('pointerdown', checkWin)
app.stage.addChild(checkStatus)

// создаю контейнер для группировки прямоуг.(k = 32)
//и добавляю его дочерним элеметом в stage
const container = new Container()
app.stage.addChild(container)


//_______________________________
//ВСЕ НЕОБХОДИМЫЕ ЦИКЛЫ


//создаю сетку из прямоугольников 7х7 со сплошной черной рамкой вокруг каждого для визуального разделения
for (let i = 0; i < 100; i++) {
    let sqr = new Graphics()
    sqr.lineStyle(1, 0x000000, 1);
    sqr.beginFill(0xFFFFFF)
    sqr.drawRect(0, 0, 32, 32)
    sqr.endFill()
    sqr.interactive = true;
    sqr.buttonMode = true;
    sqr.color = '0xFFFFFF'
    sqr.x = (i % 10) * 32
    sqr.y = Math.floor(i / 10) * 32
    sqrs.push(sqr)

    //    прослушивание клика и функция обработчик
    sqr
        .on('pointerdown', sqrClickStart)
        .on('pointerup', sqrClickEnd)
        .on('mouseover', sqrClickMove)
        .on('mouseout', sqrClickMove)

    container.addChild(sqr)
}


//перемещаю контейнер в центр
container.x = app.screen.width / 2
container.y = app.screen.height / 2

//центрирование сетки в контейнере
container.pivot.x = container.width / 2
container.pivot.y = container.height / 2

// СОЗДАНИЕ ПАЛИТРЫ С ВЫБОРОМ ЦВЕТА ИЗ 10 ГЛАВНЫХ ЦВЕТОВ
for(let i = 0; i < 10; i++) {
    let circle = new Graphics()
//    let color = Math.random() * 0xFFFFFF
    circle.beginFill(getKeyByValue(mainPalette, i))
    circle.color = getKeyByValue(mainPalette, i)
    circle.drawCircle(20, 20, 16)
    circle.endFill()
    circle.interactive = true;
    circle.buttonMode = true;
    circle.y = i * 45
    let colorNum = new Text(mainPalette[circle.color] + 1, {fontSize: 20})
    colorNum.x = 50
    colorNum.y = circle.y + 10
    app.stage.addChild(colorNum)

//    прослушивание клика и функция обработчик
    circle.on('pointerdown', circleClick)

    app.stage.addChild(circle)
    circles.push(circle)
}


//ЕСЛИ ИЗОБРАЖЕНИЕ ЗАГРУЖЕНО КАНВАС ПЕРЕЗАПУСКАЕТСЯ
for (let i = 0; i < sqrs.length; i++) {
    sqrs[i].clear()
    sqrs[i].beginFill(0xFFFFFF)
    sqrs[i].neededColor = finalColors[i]
    sqrs[i].lineStyle(1, 0x000000, 1)
    sqrs[i].drawRect(0, 0, 32, 32)
    sqrs[i].endFill()
    let text = new Text(mainPalette[finalColors[i]] + 1, {fontSize: 20})
    text.x = sqrs[i].x
    text.y = sqrs[i].y
    container.addChild(text)
}


//______________________________________
//FUNCTIONS


//ПОЛУЧЕНИЕ 10 ДОМНИРУЮЩИХ ЦВЕТОВ
function getMainPalette(img) {
    const colorThief = new ColorThief();
    if (img.complete) {
        colorThief.getColor(img);
    }
    else {
        img.addEventListener('load', function () {
            colorThief.getColor(img);
        });
    }
    return colorThief.getPalette(img)
}


//меняю значение colorSelected на false
//отрисовываю сетку
function resetClick() {
    container.scale.set(1)
    scaleCount = 0
    colorSelected = false
    circles.forEach(circle => circle.scale.set(1))
    sqrs.forEach(sqr => {
        sqr.clear()
        sqr.beginFill(0xFFFFFF)
        sqr.color = '0xFFFFFF'
        sqr.lineStyle(1, 0x000000, 1)
        sqr.drawRect(0, 0, 32, 32)
        sqr.endFill()
    })
}

// сохраняю выбранный цвет в глобальую переменную
//увеличиваю размер выбранного кружка для визуала
//если цвет уже был выбран, циклом возвращаю всем элементам исходный размер
function circleClick() {
    colorSelected = true
    selectedColor = this.color
    circles.forEach(circle => circle.scale.set(1))
    this.scale.set(1.2)
}

//ПОЛУЧЕНИЕ ПИКСЕЛЕЙ И ЦВЕТОВ
function getMainColors(img) {
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    canvas.setAttribute('id', 'imageCanvas')
    document.body.appendChild(canvas)
//    canvas.style.display = 'none'
//    ЕСЛИ НУЖНО СКРЫТЬ КАНВАС
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, 100, 100)
    const imageData = ctx.getImageData(0, 0, 100, 100)
    const data = imageData.data
    const main100colors = []
    for (let row = 4; row < 100; row += 10) {
        for (let col = 4; col < 100; col += 10) {
            main100colors.push([data[((row * (100 * 4)) + (col * 4))], data[((row * (100 * 4)) + (col * 4)) + 1], data[((row * (100 * 4)) + (col * 4)) + 2]])
        }
    }
    return main100colors
}

//ПЕРЕВОД RGB В HEX
function rgb2hex(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}



//НАХОЖДЕНИЕ НУЖНОГО ЦВЕТА
 function closestColor(color, palette) {
        let fi = 0
        let colorIndex = 0
        for (let i = 0; i < palette.length; i++) {
            const fiTemp = 30 * (palette[i][0] - color[0])**2 + 59 * (palette[i][1] - color[1])**2 + 11 * (palette[i][2] - color[2])**2
            if (fi) {
                if (fiTemp < fi) {
                    fi = fiTemp
                    colorIndex = i
                }
            } else {
                fi = fiTemp
            }
        }
    return palette[colorIndex]
}

//заменяю отрисованный квадрат другим с выбранным цветом
function sqrClickStart() {
    if(colorSelected) {
        pointerDown = true
        this.clear()
        this.beginFill(selectedColor)
        this.color = selectedColor
        this.lineStyle(1, 0x000000, 1)
        this.drawRect(0, 0, 32, 32)
        this.endFill()
    }
}

//КНОПКА МЫШИ ОТЖАТА НА КВАДРАТЕ
function sqrClickEnd() {
    pointerDown = false
}


//МЫШЬ ПЕРЕМЕЩАЕТСЯ ОТ КВАДРАТА К КВАДРАТУ
function sqrClickMove() {
    if (mouseposition.x < 96 || mouseposition.x > (94 + container.width) || mouseposition.y < 96 || mouseposition.y > (94 + container.height)) {
        pointerDown = false
    }
    if (pointerDown){
        this.clear()
        this.beginFill(selectedColor)
        this.color = selectedColor
        this.lineStyle(1, 0x000000, 1)
        this.drawRect(0, 0, 32, 32)
        this.endFill()
    }
}

//УВЕЛИЧЕНИЕ ДО 8 РАЗ
function resizeBigClick() {
    if (scaleCount !== 8){
        scaleCount++
        container.scale.set(1 + (0.1 * scaleCount))
    }
}

//УМЕНЬШЕНИЕ КАРТИНКИ ДО ИСХОДНЫХ РАЗМЕРОВ
function resizeSmClick() {
    scaleCount = 0
    container.scale.set(1)
}

//СОХРАНЕНИЕ ИГРЫ
function saveGame() {
    const colList = []
    container.children.forEach(child => colList.push(child.color))
    localStorage.setItem('colors', colList)
    colList.length = 0
}

//ПРОВЕРКА ВЫИГРЫША (НУЖНОГО ЦВЕТА И НАСТОЯЩЕГО)
function checkWin() {
    let text = new Text()
    app.stage.addChild(text)
    let win = true
    sqrs.forEach(sqr => {
        if (sqr.color != sqr.neededColor) {
            win = false
        }
    })
    if (win) {
        text.text = 'You win'
        text.style = {fontSize: 30, fill: '0x00FF00'}
        text.anchor.set(.5)
        text.x = app.screen.width / 2
        text.y = 40
    }else{
        text.text = 'Try again'
        text.style = {fontSize: 30, fill: 0xFF0000}
        text.anchor.set(.5)
        text.x = app.screen.width / 2
        text.y = 40
    }
    function textDestroy(text) {
        text.destroy()
    }

    setTimeout(textDestroy, 2000, text)
}

//ЗАГРУЗКА ПРОГРЕССА
function loadGame() {
    const loaded = localStorage.getItem('colors').split(',')
    for (let i = 0; i < sqrs.length; i++) {
        sqrs[i].clear()
        sqrs[i].beginFill(loaded[i])
        sqrs[i].color = loaded[i]
        sqrs[i].lineStyle(1, 0x000000, 1)
        sqrs[i].drawRect(0, 0, 32, 32)
        sqrs[i].endFill()
    }
}

//ПОЛУЧЕНИЕ КЛЮЧА ПО ЗНАЧЕНИЮ
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
