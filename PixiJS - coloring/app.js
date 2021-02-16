const img = document.getElementById('canvas_image')

function getPalette(img) {
    const colorThief = new ColorThief();
    if (img.complete) {
        colorThief.getColor(img);
    }
    else {
        img.addEventListener('load', function () {
            colorThief.getColor(img);
        });
    }
    const thiefPalette = colorThief.getPalette(img)
        //ПАЛЕТКА
    const palette = {}
    for (let i = 0; i < thiefPalette.length; i++) {
        palette[rgb2hex(thiefPalette[i][0], thiefPalette[i][1], thiefPalette[i][2])] = (i + 1)
    }
    return thiefPalette
}
//__________________________________
//ПОЛУЧЕНИЕ ПИКСЕЛЕЙ И ЦВЕТОВ!
function getColorsRGB(img) {
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    canvas.setAttribute('id', 'imageCanvas')
    document.body.appendChild(canvas)
        //    canvas.style.display = 'none'
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
    const main100colorsRGB = []
    for (let color of main100colors) {
        main100colorsRGB.push(rgb2hex(color[0], color[1], color[2]))
    }
    return main100colors
}
//функция перевода ргб в 16-систему
function rgb2hex(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const mainColors = getColorsRGB(img)
const tenColors = getPalette(img)
console.log(tenColors)

//функция нахождения ближайшего цвета из палитры
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

const finalColors = []
for (let color of mainColors) {
    let closest = closestColor(color, tenColors)
    finalColors.push(rgb2hex(closest[0], closest[1], closest[2]))
}
for (let i = 0; i < sqrs.length; i++) {
    sqrs[i].clear()
    sqrs[i].beginFill(finalColors[i])
    sqrs[i].lineStyle(1, 0x000000, 1)
    sqrs[i].drawRect(0, 0, 32, 32)
    sqrs[i].endFill()
}
console.log(finalColors)

