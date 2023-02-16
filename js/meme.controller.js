'use strict'
//const
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
const PADDING_MULT = 1.05 //multiplier for padding
//var
var gElCanvas = null
var gCtx = null
var gCanvas = { isMouseDown: false, }

// var gCanvasListeners = null
// var gCurrMemeId = null
// var gIsModalOpen = false
// var gModal = null
//TODO: set/reset input and select values
//TODO: “Drag&Drop” stickers on canvas
//TODO: Inline (on Canvas) text editing
//TODO: Support using various aspect-ratio of images, use the images from “meme-imgs(various aspect ratios)” folder
//TODO: add responsiveness for mobile
//TODO: calculate the 'I'm flexible' text size so it will not exceed the canvas width
//TODO: improve ui colors and styling
//TODO: Image gallery filter (use <datalist>)
//TODO: Add stickers (Those are lines that have emojis
//TODO: Add “search by keywords” to Image-Gallery Page. Each word size is determined by the popularity of the keyword search - so each click on a keyword makes that keyword bigger TIP: use an initial demo data so it will look good when loads
//TODO: Resize / Rotate a line. UI for this feature shall be a resize icon added to the line’s frame.
//TODO: Use the new Web Share API to share your meme
//TODO: i18n for Hebrew

function onInit() {
     // renderFilterByQueryStringParams()
     // renderLangByQueryStringParams()
     //canvas
     gElCanvas = document.querySelector('.canvas')
     gCtx = gElCanvas.getContext('2d')
     doTrans()
}

function renderMeme() {
     const meme = getMeme()
     const img = new Image() // Create a new html img element
     img.src = `${meme.url}` // Send a network req to get that image, define the img src
     // When the image ready draw it on the canvas
     img.onload = () => {
          gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height) //TODO: aspect ratio
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
     window.addEventListener('resize', resizeCanvas)
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
     if (ctx === gCtx) {
          if (posX) x = posX
          else setLinePos(idx, 'posX', x)
          if (posY) y = posY
          else setLinePos(idx, 'posY', y)
     }
     ctx.lineWidth = 1.5
     ctx.font = `${size}px ${font}`
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
     gCtx.strokeRect(x - width / 2 * PADDING_MULT, y - (size / 2) * PADDING_MULT, width * PADDING_MULT, size * PADDING_MULT)
     gCtx.fillRect(x - width / 2 * PADDING_MULT, y - (size / 2) * PADDING_MULT, width * PADDING_MULT, size * PADDING_MULT)
     gCtx.fillStyle = oldColor
}

function onMouseDown(ev) {
     const pos = getEvPos(ev)
     const { x, y } = pos
     if (!isLineClicked(x, y)) return
     gCanvas.isMouseDown = true
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
     gCanvas.isMouseDown = false
}

function onMouseHold(ev) {
     if (!gCanvas.isMouseDown) return
     const pos = getEvPos(ev)
     const { x, y } = pos
     const { movementX: movX, movementY: movY } = ev
     moveText(x, y, movX, movY)
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

function onSaveMeme() {
     saveMemes()
}

function onOpenSavedMemes() {
     document.querySelector('.img-container').classList.add('hide')
     document.querySelector('.editor-container').classList.add('hide')
     document.querySelector('.memes-container').classList.remove('hide')
     resetMyMemeIdx()
     renderMemes()
}

function onOpenEditor() {
     document.querySelector('.img-container').classList.add('hide')
     document.querySelector('.editor-container').classList.remove('hide')
     document.querySelector('.memes-container').classList.add('hide')
     addListeners()
     resizeCanvas()
     gCtx.fillStyle = 'white'
}

function onOpenGallery() {
     document.querySelector('.img-container').classList.remove('hide')
     document.querySelector('.editor-container').classList.add('hide')
     document.querySelector('.memes-container').classList.add('hide')
     resetMyMemeIdx()
}

// function openModal(currMeme) {
//      const modal = document.querySelector('.modal')
//      modal.classList.remove('hide')
//      const modalSpan = document.querySelector('.modal-body span')
//      modalSpan.innerText = currMeme.text
//      const modalTitle = document.querySelector('.modal-title')
//      modalTitle.innerText = currMeme.name
//      const modalRate = document.querySelector('.modal-footer div')
//      const currRate = currMeme.rate
//      modalRate.innerText = currRate
//      disableEnableModalBtns(currRate)
//      gIsModalOpen = true
//      setQueryStringParams()
// }

// function onCloseModal() {
//      const modal = document.querySelector('.modal')
//      modal.classList.add('hide')
//      gIsModalOpen = false
//      setQueryStringParams()
// }

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

// function onPrevPage() {
//      var currPage = prevPage()
//      disableEnablePageBtns(currPage)
//      renderTable()
// }

// function onNextPage() {
//      var currPage = nextPage()
//      disableEnablePageBtns(currPage)
//      renderTable()
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