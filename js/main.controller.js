'use strict'
//const
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
//var
var gCurrArrId = null
var gIsModalOpen = false
var gModal = null
var gElCanvas = null
var gCtx = null
var gCanvas = { width: 450, height: 450, currOpt: 'text', color: '', linewidth: 2, isDraw: false, textSize: 20 }

function onInit() {
     //touch
     // const modal = document.querySelector('.modal')
     // gModal = new Hammer(modal)
     onSwipe()
     //CRUDL
     // renderFilterByQueryStringParams()
     // renderLangByQueryStringParams()
     renderCanvas()
     //canvas
     gElCanvas = document.querySelector('.canvas')
     gCtx = gElCanvas.getContext('2d')
     //TODO: add listeners with hammer
     addListeners()
     resizeCanvas()
     doTrans()
     gCtx.fillStyle = 'white'
}

function renderCanvas() {
}

function onSwipe() {
     // gModal.on('swipeleft swiperight', (ev) => {
     //      const currArr = getCurrArr()
     //      if (ev.type === 'swiperight') {
     //           onReadArr(currArr.prev)
     //      } else {
     //           onReadArr(currArr.next)
     //      }
     // })
}

// function onDeleteArr(arrId) {
//      deleteArr(arrId)
//      renderTable()
// }

// function onAddArr() {
//      const form = document.querySelector('.new-arr')
//      form.hidden = false
// }

// function onConfirmArr(ev) {
//      ev.preventDefault()
//      const elNewName = document.querySelector('input[name="new-arr-name"]')
//      const elNewPrice = document.querySelector('input[name="new-arr-price"]')
//      const imageURL = getImageURL()
//      if (imageURL) addArr(elNewName.value, elNewPrice.value, imageURL)
//      else addArr(elNewName.value, elNewPrice.value)
//      renderTable()
//      const form = document.querySelector('.new-arr')
//      form.hidden = true
// }

// function onUpdateArr(arrId) {
//      const arrPrice = +prompt('Price?')
//      updateArr(arrId, arrPrice)
//      renderTable()
// }

// function onReadArr(arrId) {
//      var currArr = getArrById(arrId)
//      gCurrArrId = arrId
//      saveCurrArr(currArr)
//      openModal(currArr)
// }

// function openModal(currArr) {
//      const modal = document.querySelector('.modal')
//      modal.classList.remove('hide')
//      const modalSpan = document.querySelector('.modal-body span')
//      modalSpan.innerText = currArr.text
//      const modalTitle = document.querySelector('.modal-title')
//      modalTitle.innerText = currArr.name
//      const modalRate = document.querySelector('.modal-footer div')
//      const currRate = currArr.rate
//      modalRate.innerText = currRate
//      disableEnableModalBtns(currRate)
//      gIsModalOpen = true
//      setQueryStringParams()
// }

// function onChangeRate(ratingChange) {
//      const newRate = changeRate(ratingChange, gCurrArrId)
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
//      changeArrFilter(filterType, filterBy)
//      renderTable()
//      setQueryStringParams()
// }

// function renderFilterByQueryStringParams() {
//      const queryStringParams = new URLSearchParams(window.location.search)
//      if (queryStringParams.get('modal') === 'true') {
//           let arrId = queryStringParams.get('arrId')
//           if (!checkArrId(arrId)) {
//                const arr = getCurrArr()
//                if (arr) {
//                     arrId = arr.id
//                     onReadArr(arrId)
//                }
//           } else onReadArr(arrId)
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
//      setArrFilter(filterVars)
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
//      if (currPage >= getFilteredArr().length / PAGE_SIZE - 1) document.querySelector('.next').disabled = true
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

function resizeCanvas() { //deletes content on move
     const elContainer = document.querySelector('.canvas-container')
     // Note: changing the canvas dimension this way clears the canvas
     gElCanvas.width = elContainer.offsetWidth
     // Unless needed, better keep height fixed.
     // gElCanvas.height = elContainer.offsetHeight //might need to remove
     gCanvas = { width: elContainer.offsetWidth, height: elContainer.offsetWidth, }
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
     gElCanvas.addEventListener('mousemove', draw)
     gElCanvas.addEventListener('mouseup', onMouseUp)
}

function addTouchListeners() {
     gElCanvas.addEventListener('touchstart', onMouseDown)
     gElCanvas.addEventListener('touchmove', draw)
     gElCanvas.addEventListener('touchend', onMouseUp)
}


function downloadCanvas(elLink) {
     const data = gElCanvas.toDataURL() // Method returns a data URL containing a representation of the image in the format specified by the type parameter.
     elLink.href = data // Put it on the link
     elLink.download = 'my-img' // Can change the name of the file
}

function onDrawImg(imgNum) {
     const img = new Image() // Create a new html img element
     img.src = `img/${imgNum}.jpg` // Send a network req to get that image, define the img src
     // When the image ready draw it on the canvas
     img.onload = () => {
          gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.width) //TODO: aspect ratio
     }
}

function drawText(text, x, y) {
     gCtx.lineWidth = 2
     const size = gCanvas.textSize
     gCtx.font = `${size}px Arial`
     gCtx.textAlign = 'center'
     gCtx.textBaseline = 'middle'

     gCtx.fillText(text, x - (size / 2), y - (size / 2)) // Draws (fills) a given text at the given (x, y) position.
     gCtx.strokeText(text, x - (size / 2), y - (size / 2)) // Draws (strokes) a given text at the given (x, y) position.
     gCanvas.isDraw = false
     console.log('hi')
}

function drawRect(x, y) {
     const size = gCanvas.textSize
     gCtx.strokeRect(x - (size / 2), y - (size / 2), size, size)
     gCtx.fillRect(x - (size / 2), y - (size / 2), size, size)
     gLastDrawn = { startX: x, startY: y, endX: x + size, endY: y + size, size: size }
}

function setFillColor(color) {
     gCtx.fillStyle = color
}

function setStrokeColor(color) {
     gCtx.strokeStyle = color
}


function drawBrush(x, y) {
     gCtx.lineTo(x, y)
     gCtx.stroke()
}

function drawLine(startX, startY, endX, endY) {
     gCtx.lineJoin = 'miter'
     gCtx.lineCap = 'square'
     gCtx.moveTo(startX, startY)
     gCtx.lineTo(endX, endY)
     //debugger
     gCtx.lineWidth = 2
     gCtx.stroke()
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


function onMouseDown(ev) {
     gCanvas.isDraw = true
     const pos = getEvPos(ev)
     const { x, y } = pos
     console.log('hi')
     console.log('gCanvas.currOpt', gCganvas.currOpt)
     switch (gCanvas.currOpt) {
          case 'text':
               drawText('Hello', x, y)
               console.log('hi')
               break
          case 'line':
               gLinePos = { startX: x, startY: y }
               break
          case 'brush':
               gCtx.lineWidth = 4;
               gCtx.lineJoin = 'round'
               gCtx.lineCap = 'round'
               gCtx.beginPath()
               gCtx.moveTo(x, y)
               gCanDraw = true
               break
     }
}


function onMouseUp(ev) {
     gCanvas.isDraw = false
     switch (gCanvas.currOpt) {
          case 'line':
               if (!gLinePos) break
               const pos = getEvPos(ev)
               const { startX, startY } = gLinePos
               const { x: endX, y: endY } = pos
               drawLine(startX, startY, endX, endY)
               gLinePos = null
               break
          case 'brush':
               gCanDraw = false
               break
     }
}

function draw(ev) {
     if (!gCanvas.isDraw || gCanvas.currOpt === 'line' || gCanvas.currOpt === 'text') return
     const pos = getEvPos(ev)
     const { x, y } = pos
     const { movementX: movX, movementY: movY } = ev
     switch (gCanvas.currOpt) {
          case 'brush':
               drawBrush(x, y)
               break
          case 'img':
               drawImg(x, y)
               break
     }
}