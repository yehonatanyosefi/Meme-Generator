'use strict'
//consts
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
const PADDING_MULT = 1.05 //multiplier for padding
//vars
var gElCanvas = null
var gCtx = null
var gChangeSizeInterval = null
var gPreviousTouch = null
var gIsFocused = false
var gIsMouseDown = false
var gIsResizing = false

function onInit() {
     gElCanvas = document.querySelector('.canvas')
     gCtx = gElCanvas.getContext('2d')
     const lang = getValByQSParams('lang') || 'en'
     if (lang === 'he') document.body.classList.add('rtl')
     setLang(lang)
     renderGallery()
     doTrans()
}

function renderMeme() {
     const meme = getMeme()
     const img = new Image() // Create a new html img element
     img.src = `${meme.url}` // Send a network req to get that image, define the img src
     // When the image ready draw it on the canvas
     img.onload = () => {
          gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
          if (!meme.lines) return
          meme.lines.forEach((line, idx) => {
               let lineHeight = gElCanvas.height / 8
               if (idx > 1) lineHeight = gElCanvas.height / 2
               else if (idx > 0) lineHeight = gElCanvas.height - gElCanvas.height / 8
               drawText(line, gElCanvas.width / 2, lineHeight, meme.selectedLineIdx === idx, idx)
          })
     }
}

function getEvPos(ev) {
     // Gets the offset pos , the default pos
     let pos = {
          x: ev.offsetX,
          y: ev.offsetY,
     }
     // Check if its a touch ev
     if (TOUCH_EVS.includes(ev.type)) {
          //soo we will not trigger the mouse ev
          ev.preventDefault()
          //Gets the first touch point
          ev = ev.changedTouches[0]
          //Calc the right pos according to the touch screen
          pos = {
               x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
               y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
          }
     }
     return pos
}

function addListeners() {
     addMouseListeners()
     addTouchListeners()
     addKeyboardListeners()
}

function addKeyboardListeners() {
     addEventListener('keydown', onKeyDown)
}

function addMouseListeners() {
     gElCanvas.addEventListener('mousedown', onMouseDown)
     gElCanvas.addEventListener('mousemove', onMouseHold)
     gElCanvas.addEventListener('mouseup', onMouseUp)
     gElCanvas.addEventListener('mouseout', onMouseUp)
}

function addTouchListeners() {
     gElCanvas.addEventListener('touchstart', onTouchStart)
     gElCanvas.addEventListener('touchmove', onTouchMove)
     gElCanvas.addEventListener('touchend', onTouchEnd)
}

function prepareDownload() {
     const meme = getMeme()
     const elLink = document.querySelector('.canvas-downloader')
     if (meme.selectedLineIdx !== -1) {
          meme.selectedLineIdx = -1
          renderMeme()
          setTimeout(() => elLink.click(), 100)
     } else {
          elLink.click()
     }
}

function downloadCanvas(elLink) {
     const data = gElCanvas.toDataURL() // Method returns a data URL containing a representation of the image in the format specified by the type parameter.
     elLink.href = data // Put it on the link
     elLink.download = 'my-img' // Can change the name of the file
}

function onSelectImg(imgId) {
     resetCanvas()
     if (imgId === 'rnd') {
          randomizeLine()
          imgId = getRandomIntInclusive(1, getImages().length)
     }
     setImg(imgId)
     renderNewCanvas()
}

function onSelectMeme(memeIdx) {
     setMeme(memeIdx)
     renderNewCanvas()
}

function renderNewCanvas() {
     onOpenEditor()
     renderMeme()
}

function drawText(line, x, y, isSelected, idx, ctx = gCtx) {
     const { txt, size, font, color, stroke, align, posX, posY, isEmoji } = line
     ctx.lineWidth = 1.5
     if (ctx === gCtx) {
          if (posX) x = posX
          else setLinePos(idx, 'posX', x)
          if (posY) y = posY
          else setLinePos(idx, 'posY', y)
     } else {
          ctx.lineWidth *= 0.4
     }
     ctx.shadowColor = "black"
     ctx.shadowBlur = 1
     ctx.font = `${size}px ${font || 'secular'}`
     ctx.fillStyle = color
     ctx.strokeStyle = stroke
     ctx.textAlign = align
     ctx.textBaseline = 'middle'
     if (isSelected) {
          drawSelection(x, y, size, txt, align, isEmoji)
     }
     ctx.fillText(txt, x, y) // Draws (fills) a given text at the given (x, y) position.
     ctx.strokeText(txt, x, y) // Draws (strokes) a given text at the given (x, y) position.
}

function drawSelection(x, y, size, text, align, isEmoji) {
     const width = gCtx.measureText(text).width
     const sizePadding = (!isEmoji) ? PADDING_MULT : PADDING_MULT * 1.3
     switch (align) {
          case 'right':
               x -= width / 2
               break
          case 'left':
               x += width / 2
               break
     }
     drawRect(x, y, size, sizePadding, width,)
     drawSizeAdjust(x, y, size, sizePadding, width)
}

function drawRect(x, y, size, sizePadding, width) {
     const oldColor = gCtx.fillStyle
     gCtx.fillStyle = 'rgba(255, 255, 255, 0.25)'
     gCtx.strokeStyle = 'white'
     gCtx.strokeRect(x - width / 2 * sizePadding, y - (size / 1.8 * sizePadding), width * sizePadding, size * sizePadding - Math.sqrt(size))
     gCtx.fillRect(x - width / 2 * sizePadding, y - (size / 1.8 * sizePadding), width * sizePadding, size * sizePadding - Math.sqrt(size))
     gCtx.fillStyle = oldColor
}

function drawSizeAdjust(x, y, size, sizePadding, width) {
     const iconSize = 12 * Math.sqrt(size / 40)
     let img = new Image()
     img.src = 'icons/resize.png'
     img.onload = function () {
          gCtx.drawImage(img, x + width / 2, y - size / 1.8 - sizePadding - iconSize, iconSize, iconSize)
     }
}

function isLineClicked(clickX, clickY) {
     const meme = getMeme()
     let whatIsClicked = 'none'
     meme.lines.forEach((line, idx) => {
          const { txt, size, font, posX, posY, isEmoji } = line
          // Calc the distance between two dots
          const distanceX = Math.abs(posX - clickX)
          const distanceY = Math.abs(posY - clickY)
          gCtx.font = `${size}px ${font || 'secular'}`
          const width = gCtx.measureText(txt).width
          const sizePadding = (!isEmoji) ? PADDING_MULT : PADDING_MULT * 1.3
          if (meme.selectedLineIdx === idx) { //if is selected - check if resize
               const iconSize = 12 * Math.sqrt(size / 40)
               const rPosX = posX + width / 2 + iconSize / 2
               const rPosY = posY - size / 1.8 - sizePadding - iconSize / 1.8
               const rDistanceX = Math.abs(rPosX - clickX)
               const rDistanceY = Math.abs(rPosY - clickY)
               if (rDistanceX <= iconSize / 2 && rDistanceY <= iconSize / 2) whatIsClicked = 'resize'
          }
          if (whatIsClicked !== 'resize' && distanceX <= width / 2 * sizePadding && distanceY <= size / 2 * sizePadding) {
               changeSelectedLine(idx)
               renderMeme()
               whatIsClicked = 'line'
          }
     })
     return whatIsClicked
}
function onTouchStart(ev) {
     const touch = ev.touches[0]
     if (gPreviousTouch) {
          ev.movementX = touch.pageX - gPreviousTouch.pageX;
          ev.movementY = touch.pageY - gPreviousTouch.pageY;
     }
     gPreviousTouch = touch
     onMouseDown(ev)
}

function onTouchMove(ev) {
     const touch = ev.touches[0]
     if (gPreviousTouch) {
          ev.movementX = touch.pageX - gPreviousTouch.pageX;
          ev.movementY = touch.pageY - gPreviousTouch.pageY;
     }
     gPreviousTouch = touch
     onMouseHold(ev)
}

function onTouchEnd(ev) {
     gPreviousTouch = null
     onMouseUp(ev)
}

function onMouseDown(ev) {
     const pos = getEvPos(ev)
     const { x, y } = pos
     switch (isLineClicked(x, y)) {
          case 'none':
               changeSelectedLine(-1)
               renderMeme()
               return
               break
          case 'resize':
               gIsResizing = true
               break
     }
     gIsMouseDown = true
}

function onMouseUp(ev) {
     gIsMouseDown = false
     gIsResizing = false
}

function onMouseHold(ev) {
     if (!gIsMouseDown) return
     const pos = getEvPos(ev)
     const { x, y } = pos
     const { movementX: movX, movementY: movY } = ev
     if (gIsResizing) {
          changeSize(movX)
     } else {
          moveText(movX, movY, x, y)
     }
     renderMeme()
}

function onKeyDown(ev) {
     if (gIsFocused || isSpecialKey(ev.keyCode)) return
     switch (ev.key) {
          case 'Space':
               onAddTextToLine(' ')
               break
          case 'Delete':
          case 'Backspace':
               ev.preventDefault()
               onDeleteFromLine()
               break
          default:
               onAddTextToLine(ev.key)
               break
     }
     renderMeme()
}

function onEditorDelete() {
     deleteCurrent()
     renderMeme()
}

function onEditorAdd() {
     addMeme()
     renderMeme()
}

function onChangeLine(prop, value) {
     changeLine(prop, value)
     renderMeme()
}

function onChangePage(mod) {
     changePage(mod)
     renderEmojis()
}

function onSwitchLine() {
     switchLine()
     renderMeme()
}

function stopPress() {
     clearInterval(gChangeSizeInterval)
}

function onChangeSize(mod) {
     gChangeSizeInterval = setInterval(() => {
          changeSize(mod)
          renderMeme()
     }, 13)
}

function onSaveMeme() {
     saveMemes()
     openModal()
}

function renderEmojis() {

     const emojis = getFilteredEmojis()
     const elEmojiKeys = document.querySelector('.emoji-keyboard')
     const strHTML = []
     strHTML.push(`<button onclick = "onChangePage(-1)" onkeyup = "event.preventDefault()" >
                         <i class="fa-solid fa-arrow-left"></i>
				</ button>`)
     for (let i = 0; i < emojis.length; i++) {
          strHTML.push(`<button class="emoji emoji${i + 1}"
                         onclick="onAddEmoji('${emojis[i]}')"
                         onkeyup="event.preventDefault()">
                         ${emojis[i]}
                         </button>`)
     }
     strHTML.push(`<button onclick="onChangePage(1)" onkeyup="event.preventDefault()">
				     <i class="fa-solid fa-arrow-right"></i>
			     </button>`)
     elEmojiKeys.innerHTML = strHTML.join('').replaceAll(',', '')
}


function onOpenEditor() {
     document.querySelector('.img-container').classList.add('hide')
     document.querySelector('.editor-container').classList.remove('hide')
     document.querySelector('.memes-container').classList.add('hide')
     document.querySelector('.about-container').classList.add('hide')
     document.querySelector('.gallery-a').classList.remove('active')
     document.querySelector('.my-memes-a').classList.remove('active')
     document.querySelector('.about-a').classList.remove('active')
     addListeners()
     gCtx.fillStyle = 'white'
     updateTextVal()
     updateFontVal()
     renderEmojis()
}

function onOpenSavedMemes() {
     document.querySelector('.img-container').classList.add('hide')
     document.querySelector('.editor-container').classList.add('hide')
     document.querySelector('.memes-container').classList.remove('hide')
     document.querySelector('.about-container').classList.add('hide')
     document.querySelector('.gallery-a').classList.remove('active')
     document.querySelector('.my-memes-a').classList.add('active')
     document.querySelector('.about-a').classList.remove('active')
     resetMyMemeIdx()
     renderMemes()
}

function onOpenGallery() {
     document.querySelector('.img-container').classList.remove('hide')
     document.querySelector('.editor-container').classList.add('hide')
     document.querySelector('.memes-container').classList.add('hide')
     document.querySelector('.about-container').classList.add('hide')
     document.querySelector('.gallery-a').classList.add('active')
     document.querySelector('.my-memes-a').classList.remove('active')
     document.querySelector('.about-a').classList.remove('active')
     resetMyMemeIdx()
}

function onOpenAbout() {
     document.querySelector('.img-container').classList.add('hide')
     document.querySelector('.editor-container').classList.add('hide')
     document.querySelector('.memes-container').classList.add('hide')
     document.querySelector('.about-container').classList.remove('hide')
     document.querySelector('.gallery-a').classList.remove('active')
     document.querySelector('.my-memes-a').classList.remove('active')
     document.querySelector('.about-a').classList.add('active')

}

function openModal() {
     const modal = document.querySelector('.modal')
     modal.classList.remove('hide')
     setTimeout(closeModal, 1500)
}

function closeModal() {
     const modal = document.querySelector('.modal')
     modal.classList.add('hide')
}

function updateFontVal() {
     const line = getSelectedLine()
     const font = (!line) ? 'secular' : line.font
     const elFont = document.querySelector('.font')
     elFont.value = font
}

function toggleMenu() {
     document.body.classList.toggle('menu-open')
}
function updateTextVal() {
     const line = getSelectedLine()
     const txt = (!line) ? '' : line.txt
     document.querySelector('.txt').value = txt
}

function textInputFocus(isFocused) {
     gIsFocused = isFocused
}

function onAddEmoji(emoji) {
     addEmoji(emoji)
     renderMeme()
}

function onToggleLang() {
     document.body.classList.toggle('rtl')
     toggleLang()
     renderGallery()
     doTrans()
}