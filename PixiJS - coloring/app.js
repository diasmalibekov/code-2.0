const img = document.getElementById('canvas_image')
console.log(getPalette(img))

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
    return palette
}
//__________________________________
//ПОЛУЧЕНИЕ ПИКСЕЛЕЙ И ЦВЕТОВ!
function drawImage(img) {
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
}
//функция перевода ргб в 16-систему
function rgb2hex(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
drawImage(img)
