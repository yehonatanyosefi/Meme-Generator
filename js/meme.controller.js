'use strict'
//const
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
//var
var gElCanvas = null
var gCtx = null
var gCanvas = { isMouseDown: false, }

// var gCanvasListeners = null
// var gCurrMemeId = null
// var gIsModalOpen = false
// var gModal = null
//TODO: fix square around text
//TODO: add rest of buttons
//TODO: add several fonts selectors
//TODO: add randomizer on canvas editor
//TODO: fix all media queries and ui
//TODO: fix uploaded image render, and save to local storage
//TODO: fix Saved Memes
//TODO: randomize the stroke color. Note that as a bonus here you may calculate the text size so it will not exceed the canvas width
//TODO: Image gallery filter (use <datalist>)
//TODO: Add stickers (Those are lines that have emojis
//TODO: Support “Drag&Drop” of lines and stickers on canvas. This requires also support of line selection by click line/stickers on canvas
//TODO: Support using various aspect-ratio of images, use the images from “meme-imgs(various aspect ratios)” folder
//TODO: Add “search by keywords” to Image-Gallery Page. Each word size is determined by the popularity of the keyword search - so each click on a keyword makes that keyword bigger TIP: use an initial demo data so it will look good when loads
//TODO: Inline (on Canvas) text editing
//TODO: Resize / Rotate a line. UI for this feature shall be a resize icon added to the line’s frame.
//TODO: Use the new Web Share API to share your meme
//TODO: i18n for Hebrew

function onInit() {
     //touch
     // const modal = document.querySelector('.modal')
     // gModal = new Hammer(modal)
     // onSwipe()
     //CRUDL
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
          meme.lines.forEach((line, idx) => {
               let lineHeight = gElCanvas.height / 8
               if (idx > 1) lineHeight = gElCanvas.height / 2
               else if (idx > 0) lineHeight = gElCanvas.height - gElCanvas.height / 8
               drawText(line, gElCanvas.width / 2, lineHeight, meme.selectedLineIdx === idx)
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
     // gCanvasListeners = new Hammer(gElCanvas)
     // gCanvasListeners.on('mousedown mousemovemouseup', (ev) => {
     //      const currMeme = getCurrMeme()
     //      if (ev.type === 'swiperight') {
     //           onReadMeme(currMeme.prev)
     //      } else {
     //           onReadMeme(currMeme.next)
     //      }
     // })
     window.addEventListener('resize', resizeCanvas)
}

function addMouseListeners() {
     gElCanvas.addEventListener('mousedown', onMouseDown)
     gElCanvas.addEventListener('mousemove', onMouseHold)
     gElCanvas.addEventListener('mouseup', onMouseUp)
}

function addTouchListeners() {
     gElCanvas.addEventListener('touchstart', onMouseDown)
     gElCanvas.addEventListener('touchmove', onMouseHold)
     gElCanvas.addEventListener('touchend', onMouseUp)
}

function downloadCanvas(elLink) {
     const meme = getMeme()
     const oldSelectedLine = meme.selectedLineIdx
     if (oldSelectedLine !== -1) {
          meme.selectedLineIdx = -1
          renderMeme()
          //TODO: remove double download, keep interval to load canvas
          elLink.click()
     } else {
          const data = gElCanvas.toDataURL() // Method returns a data URL containing a representation of the image in the format specified by the type parameter.
          elLink.href = data // Put it on the link
          elLink.download = 'my-img' // Can change the name of the file
     }
}

function onSelectImg(imgId) {
     clearCanvas()
     if (imgId === 'rnd') {
          randomizeLine()
          imgId = getRandomIntInclusive(1, getImages().length)
     }
     onOpenEditor()
     setImg(imgId)
     renderMeme()
}

function drawText(line, x, y, isSelected) {
     const { txt, size, font, color, align } = line
     gCtx.lineWidth = 1
     gCtx.font = `${size}px ${font}`
     gCtx.fillStyle = color
     gCtx.textAlign = align
     gCtx.textBaseline = 'middle'

     gCtx.fillText(txt, x, y) // Draws (fills) a given text at the given (x, y) position.
     gCtx.strokeText(txt, x, y) // Draws (strokes) a given text at the given (x, y) position.
     if (isSelected) drawRect(x, y, size, txt.length)
}

function drawRect(x, y, size, length) { //TODO: improve dimensions and x start
     const oldColor = gCtx.fillStyle
     gCtx.fillStyle = 'rgba(255, 255, 255, 0.4)'
     gCtx.strokeStyle = 'white'
     gCtx.strokeRect(x - size * 1.3, y - (size / 2) - (length / 2), size * length / 2, size)
     gCtx.fillRect(x - size * 1.3, y - (size / 2) - (length / 2), size * length / 2, size)
     gCtx.fillStyle = oldColor
}

function onMouseDown(ev) {
     gCanvas.isMouseDown = true
     const pos = getEvPos(ev)
     const { x, y } = pos
}

function onMouseUp(ev) {
     gCanvas.isMouseDown = false
}

function onMouseHold(ev) {
     const pos = getEvPos(ev)
     const { x, y } = pos
     const { movementX: movX, movementY: movY } = ev
}

function onClearCanvas() {
     clearCanvas()
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
     renderMemes(loadMemes())
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
}
// function resizeCanvas() {
//      // create temp stuff
//      const tempCanvas = document.createElement('canvas');
//      const tempCtx = tempCanvas.getContext('2d');
//      const fill = gCtx.fillStyle
//      const stroke = gCtx.strokeStyle
//      // save
//      tempCanvas.width = gElCanvas.width
//      tempCanvas.height = gElCanvas.height
//      tempCtx.fillStyle = 'white'
//      tempCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
//      tempCtx.drawImage(gElCanvas, 0, 0)
//      // resize & get the temp stuff back in
//      const elContainer = document.querySelector('.canvas-container')
//      gElCanvas.width = elContainer.offsetWidth
//      gElCanvas.height = elContainer.offsetHeight
//      gCtx.drawImage(tempCanvas, 0, 0)
//      gCtx.fillStyle = fill
//      gCtx.strokeStyle = stroke
// }


// function onSwipe() {
//      // gModal.on('swipeleft swiperight', (ev) => {
//      //      const currMeme = getCurrMeme()
//      //      if (ev.type === 'swiperight') {
//      //           onReadMeme(currMeme.prev)
//      //      } else {
//      //           onReadMeme(currMeme.next)
//      //      }
//      // })
// }

// function onDeleteMeme(memeId) {
//      deleteMeme(memeId)
//      renderTable()
// }

// function onAddMeme() {
//      const form = document.querySelector('.new-meme')
//      form.hidden = false
// }

// function onConfirmMeme(ev) {
//      ev.preventDefault()
//      const elNewName = document.querySelector('input[name="new-meme-name"]')
//      const elNewPrice = document.querySelector('input[name="new-meme-price"]')
//      const imageURL = getImageURL()
//      if (imageURL) addMeme(elNewName.value, elNewPrice.value, imageURL)
//      else addMeme(elNewName.value, elNewPrice.value)
//      renderTable()
//      const form = document.querySelector('.new-meme')
//      form.hidden = true
// }

// function onUpdateMeme(memeId) {
//      const memePrice = +prompt('Price?')
//      updateMeme(memeId, memePrice)
//      renderTable()
// }

// function onReadMeme(memeId) {
//      var currMeme = getMemeById(MemeId)
//      gCurrMemeId = MemeId
//      saveCurrMeme(currMeme)
//      openModal(currMeme)
// }

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

// function onChangeRate(ratingChange) {
//      const newRate = changeRate(ratingChange, gCurrMemeId)
//      const modalRate = document.querySelector('.modal-footer div')
//      modalRate.innerText = newRate
//      disableEnableModalBtns(newRate)
// }

// function disableEnableModalBtns(rate) {
//      const modalMinus = document.querySelector('.modal-minus')
//      const modalPlus = document.querySelector('.modal-plus')
//      if (rate <= 0) modalMinus.disabled = true //minus
//      else if (rate >= 1) modalMinus.disabled = false
//      if (rate >= 10) modalPlus.disabled = true //plus
//      else if (rate <= 9) modalPlus.disabled = false
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

// function disableEnablePageBtns(currPage) {
//      if (currPage >= getFilteredMeme().length / PAGE_SIZE - 1) document.querySelector('.next').disabled = true
//      else document.querySelector('.next').disabled = false
//      if (currPage <= 0) document.querySelector('.previous').disabled = true
//      else document.querySelector('.previous').disabled = false

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