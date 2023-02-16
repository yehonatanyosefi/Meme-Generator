'use strict'
//consts
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
const PADDING_MULT = 1.05 //multiplier for padding
//vars
var gElCanvas = null
var gCtx = null
var gIsMouseDown = false
var gChangeSizeInterval = null
var gIsFocused = false

//TODO: Add stickers (Those are lines that have emojis) & “Drag&Drop” for stickers
//TODO: Resize / Rotate a line. UI for this feature shall be a resize icon added to the line’s frame.
//TODO: Use the new Web Share API to share your meme
//TODO: i18n for Hebrew
//TODO: maybe: aspect ratio, filter(datalist), keywords(w/popularity)

function onInit() {
     // renderFilterByQueryStringParams()
     // renderLangByQueryStringParams()
     //canvas
     gElCanvas = document.querySelector('.canvas')
     gCtx = gElCanvas.getContext('2d')
     doTrans()
     renderGallery()
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

function resizeCanvas() { //deletes content on move
     //TODO: maybe resize
     const elContainer = document.querySelector('.canvas-container')
     // Note: changing the canvas dimension this way clears the canvas
     // gElCanvas.width = elContainer.offsetWidth
     // Unless needed, better keep height fixed.
     // gElCanvas.height = elContainer.offsetHeight //might need to remove
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
     window.addEventListener('resize', resizeCanvas)
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
     gElCanvas.addEventListener('touchstart', onMouseDown)
     gElCanvas.addEventListener('touchmove', onMouseHold)
     gElCanvas.addEventListener('touchend', onMouseUp)
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
     const { txt, size, font, color, stroke, align, posX, posY } = line
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
     if (isSelected) drawRect(x, y, size, txt, align)
     ctx.fillText(txt, x, y) // Draws (fills) a given text at the given (x, y) position.
     ctx.strokeText(txt, x, y) // Draws (strokes) a given text at the given (x, y) position.
}

function drawRect(x, y, size, text, align) {
     const oldColor = gCtx.fillStyle
     const width = gCtx.measureText(text).width
     gCtx.fillStyle = 'rgba(255, 255, 255, 0.25)'
     gCtx.strokeStyle = 'white'
     switch (align) {
          case 'right':
               x -= width / 2
               break
          case 'left':
               x += width / 2
               break
     }
     gCtx.strokeRect(x - width / 2 * PADDING_MULT, y - (size / 2 * PADDING_MULT + 2), width * PADDING_MULT, size - PADDING_MULT)
     gCtx.fillRect(x - width / 2 * PADDING_MULT, y - (size / 2 * PADDING_MULT + 2), width * PADDING_MULT, size - PADDING_MULT)
     gCtx.fillStyle = oldColor
}

function onMouseDown(ev) {
     const pos = getEvPos(ev)
     const { x, y } = pos
     if (!isLineClicked(x, y)) {
          changeSelectedLine(-1)
          renderMeme()
          return
     }
     gIsMouseDown = true
}

function isLineClicked(clickX, clickY) {
     const meme = getMeme()
     let isLineClicked = false
     meme.lines.forEach((line, idx) => {
          const { txt, size, posX, posY } = line
          // Calc the distance between two dots
          const distanceX = Math.abs(posX - clickX)
          const distanceY = Math.abs(posY - clickY)
          const width = gCtx.measureText(txt).width
          if (distanceX <= width / 2 * PADDING_MULT && distanceY <= size / 2 * PADDING_MULT) {
               isLineClicked = true
               changeSelectedLine(idx)
               renderMeme()
          }
     })
     return isLineClicked
}

function onMouseUp(ev) {
     gIsMouseDown = false
}

function onMouseHold(ev) {
     if (!gIsMouseDown) return
     const pos = getEvPos(ev)
     const { x, y } = pos
     const { movementX: movX, movementY: movY } = ev
     moveText(x, y, movX, movY)
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
     }, 37)
}

function onSaveMeme() {
     saveMemes()
     openModal()
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
     resizeCanvas()
     gCtx.fillStyle = 'white'
     updateTextVal()
     updateFontVal()
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
     setTimeout(closeModal, 800)
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

// function onSetFilterBy(filterType, filterBy) {
//      changeMemeFilter(filterType, filterBy)
//      renderTable()
//      setQueryStringParams()
// }

// function renderFilterByQueryStringParams() {
//      const queryStringParams = new URLSearchParams(window.location.search)
//      if (queryStringParams.get('modal') === 'true') {
//           let MemeId = queryStringParams.get('memeId')
//           if (!checkMemeId(memeId)) {
//                const meme = getCurrMeme()
//                if (meme) {
//                     memeId = meme.id
//                     onReadMeme(memeId)
//                }
//           } else onReadMeme(memeId)
//      }
//      const filterVars = {
//           min: +queryStringParams.get('min') || -Infinity,
//           max: +queryStringParams.get('max') || Infinity,
//           name: queryStringParams.get('name') || '',
//      }
//      // const {min, max, name} = filterVars
//      if (!filterVars.min && !filterVars.max && (!filterVars.name || filterVars.name === '')) return

//      document.querySelector('.filter-min').value = (filterVars.min === -Infinity) ? '' : filterVars.min
//      document.querySelector('.filter-max').value = (filterVars.max === Infinity) ? '' : filterVars.max
//      document.querySelector('.filter-name').value = filterVars.name
//      setMemeFilter(filterVars)
// }

// function onSetLang(lang) {
//      if (lang === 'choose') return
//      setLang(lang)
//      renderTable()
//      setBodyRTL(lang)
//      setQueryStringParams()
// }

// function setBodyRTL(lang) {
//      if (lang === 'he') document.body.classList.add('rtl')
//      else document.body.classList.remove('rtl')
// }

// function renderLangByQueryStringParams() {
//      const queryStringParams = new URLSearchParams(window.location.search)
//      if (queryStringParams.get('lang') === 'he') {
//           setLang('he')
//           setBodyRTL('he')
//      }
// }