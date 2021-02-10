let Application = PIXI.Application,
    loader = PIXI.Loader,
    resources = PIXI.Loader.resources,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics,
    Container = PIXI.Container

let app = new Application({
    width: 512,
    height: 512,
    antialias: true,
    transparent: false,
    resolution: 1,
    backgroundColor: 0x1099bb
})

document.body.appendChild(app.view)

//объявляю:
//.количество цветов и глобалную переменную для хранения цвета
//.список для хранения кружков с цветом
//.список с прямоугольниками

const colors = 5
let selectedColor,
    colorSelected = false,
    circles = [],
    sqrs = [],
    scaleCount = 0

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

// создаю палитру с выбором цвета
for(let i = 0; i < colors; i++) {
    let circle = new Graphics()
    let randomColor = Math.random() * 0xFFFFFF
    circle.beginFill(randomColor)
    circle.color = randomColor
    circle.drawCircle(20, 20, 16)
    circle.endFill()
    circle.interactive = true;
    circle.buttonMode = true;
    circle.y = i * 45

//    прослушивание клика и функция обработчик
    circle.on('pointerdown', circleClick)

    app.stage.addChild(circle)
    circles.push(circle)
}


// создаю контейнер для группировки прямоуг.(k = 32)
//и добавляю его дочерним элеметом в stage
const container = new Container()
app.stage.addChild(container)

//создаю сетку из прямоугольников 7х7 со сплошной черной рамкой вокруг каждого для визуального разделения
for (let i = 0; i < 49; i++) {
    let sqr = new Graphics()
    sqr.lineStyle(1, 0x000000, 1);
    sqr.beginFill(0xFFFFFF)
    sqr.drawRect(0, 0, 32, 32)
    sqr.endFill()
    sqr.interactive = true;
    sqr.buttonMode = true;
    sqr.x = (i % 7) * 32
    sqr.y = Math.floor(i / 7) * 32
    sqrs.push(sqr)

    //    прослушивание клика и функция обработчик
    sqr.on('pointerdown', sqrClick)

    container.addChild(sqr)
}


//перемещаю контейнер в центр
container.x = app.screen.width / 2
container.y = app.screen.height / 2

//центрирование сетки в контейнере
container.pivot.x = container.width / 2
container.pivot.y = container.height / 2

//______________________________________
//FUNCTIONS

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


//заменяю отрисованный квадрат другим с выбранным цветом
function sqrClick() {
    if(colorSelected) {
        this.clear()
        this.beginFill(selectedColor)
        this.lineStyle(1, 0x000000, 1)
        this.drawRect(0, 0, 32, 32)
        this.endFill()
    }
}

//увеличение до 8 раз, чтобы контейнер не перекрывал кнопки
function resizeBigClick() {
    if (scaleCount !== 8){
        scaleCount++
        container.scale.set(1 + (0.1 * scaleCount))
    }
}

//уменьшение картинки до начальных размеров
function resizeSmClick() {
    scaleCount = 0
    container.scale.set(1)
}
