//const img = document.getElementById('canvas_image')
//const mainColors = getMainColors(img)
//const tenColors = getMainPalette(img)
//const mainPalette = {}
//for (let i = 0; i < tenColors.length; i++) {
//    mainPalette[rgb2hex(tenColors[i][0], tenColors[i][1], tenColors[i][2])] = i
//}
//const finalColors = []
//for (let color of mainColors) {
//    let closest = closestColor(color, tenColors)
//    finalColors.push(rgb2hex(closest[0], closest[1], closest[2]))
//}
//for (let i = 0; i < sqrs.length; i++) {
//    sqrs[i].clear()
//    sqrs[i].beginFill(0xFFFFFF)
//    sqrs[i].neededColor = finalColors[i]
//    sqrs[i].lineStyle(1, 0x000000, 1)
//    sqrs[i].drawRect(0, 0, 32, 32)
//    sqrs[i].endFill()
//    let text = new Text(mainPalette[finalColors[i]])
//    text.x = sqrs[i].x
//    text.y = sqrs[i].y
//    container.addChild(text)
//}
//
////ПОЛУЧЕНИЕ 10 ДОМНИРУЮЩИХ ЦВЕТОВ
//function getMainPalette(img) {
//    const colorThief = new ColorThief();
//    if (img.complete) {
//        colorThief.getColor(img);
//    }
//    else {
//        img.addEventListener('load', function () {
//            colorThief.getColor(img);
//        });
//    }
//    return colorThief.getPalette(img)
//}
//
//
////ПОЛУЧЕНИЕ ПИКСЕЛЕЙ И ЦВЕТОВ
//function getMainColors(img) {
//    const canvas = document.createElement('canvas')
//    canvas.width = 100
//    canvas.height = 100
//    canvas.setAttribute('id', 'imageCanvas')
//    document.body.appendChild(canvas)
////    canvas.style.display = 'none'
////    --если нужно скрыть канвас
//    const ctx = canvas.getContext('2d')
//    ctx.drawImage(img, 0, 0, 100, 100)
//    const imageData = ctx.getImageData(0, 0, 100, 100)
//    const data = imageData.data
//    const main100colors = []
//    for (let row = 4; row < 100; row += 10) {
//        for (let col = 4; col < 100; col += 10) {
//            main100colors.push([data[((row * (100 * 4)) + (col * 4))], data[((row * (100 * 4)) + (col * 4)) + 1], data[((row * (100 * 4)) + (col * 4)) + 2]])
//        }
//    }
//    return main100colors
//}
//
////функция перевода RGB в 16-систему
//function rgb2hex(r, g, b) {
//    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
//}
//
//
//
////функция нахождения ближайшего цвета из палитры
// function closestColor(color, palette) {
//        let fi = 0
//        let colorIndex = 0
//        for (let i = 0; i < palette.length; i++) {
//            const fiTemp = 30 * (palette[i][0] - color[0])**2 + 59 * (palette[i][1] - color[1])**2 + 11 * (palette[i][2] - color[2])**2
//            if (fi) {
//                if (fiTemp < fi) {
//                    fi = fiTemp
//                    colorIndex = i
//                }
//            } else {
//                fi = fiTemp
//            }
//        }
//    return palette[colorIndex]
//}
