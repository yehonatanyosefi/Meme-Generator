'use strict'

const MEMES_KEY = 'memesDB'
// const PAGE_SIZE = 5

// var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }
var gMeme = createMeme()
var gMyMemeIdx = -1

// var gFilter = { min: -Infinity, max: Infinity, name: '', }
// var gPageIdx = 0

var gImgs = createImages()

function createImages() {
     let images = []
     for (let i = 1; i <= 18; i++) {
          images.push(createImage(i))
     }
     return images
}

function createImage(id, img) {
     return {
          id: id,
          imgUrl: img || `img/${id}.jpg`,
          keywords: ['funny', 'cat'],
          prev: null,
          next: null,
     }
}

function moveText(x, y, movX, movY) {
     gMeme.lines[gMeme.selectedLineIdx].posX = x + movX
     gMeme.lines[gMeme.selectedLineIdx].posY = y + movY
}

function addImage(img) { //TODO: fix bug in display on gallery
     gImgs.push(createImage(gImgs.length + 1, img.src))
     setImg(gImgs.length)
     renderMeme()
     // renderGallery() //not adding to gallery atm, don't know if I want it to
}

function setImg(imgId) {
     gMeme.selectedImgId = imgId
     gMeme.selectedLineIdx = 0
     gMeme.url = gImgs[imgId - 1].imgUrl
}

function setMeme(memeIdx) {
     gMeme = loadMemes()[memeIdx]
     gMyMemeIdx = memeIdx
}

function createMeme() {
     return {
          selectedImgId: 5,
          selectedLineIdx: 0,
          lines: [
               createLine(),
               createLine()
          ],
     }
}

function resetCanvas() {
     gMeme.lines = [createLine(), createLine()]
     gMeme.selectedLineIdx = 0
}
function deleteCurrent() {
     if (!gMeme.lines) {
          if (gMyMemeIdx !== -1) {
               const allMemes = loadMemes() || []
               allMemes.splice(gMyMemeIdx, 1)
               saveToStorage(MEMES_KEY, allMemes)
               onOpenSavedMemes()
          } else {
               onOpenGallery()
          }
     } else if (gMeme.lines.length === 1) {
          gMeme.lines = null
          gMeme.selectedLineIdx = -1
     } else {
          gMeme.lines.splice(gMeme.selectedLineIdx, 1)
          if (gMeme.selectedLineIdx !== 0) gMeme.selectedLineIdx -= 1
     }
}

function createLine(txt = 'Hello', size = 50, align = 'center', color = 'white', stroke = 'black', font = 'Impact', posX = null, posY = null) {
     return { txt, size, align, color, stroke, font, posX, posY }
}

function changeLine(prop, value) {
     switch (prop) {
          case 'size':
               if (!value) value = 50
               gMeme.lines[gMeme.selectedLineIdx].size = value
               break
          case 'text':
               if (!value) {
                    deleteCurrent()
                    break
               }
               if (!gMeme.lines || !gMeme.lines.length) addMeme()
               gMeme.lines[gMeme.selectedLineIdx].txt = value
               break
          case 'align':
               gMeme.lines[gMeme.selectedLineIdx].align = value
               break
          case 'fill':
               gMeme.lines[gMeme.selectedLineIdx].color = value
               break
          case 'font':
               gMeme.lines[gMeme.selectedLineIdx].font = value
               break
          case 'posX':
               gMeme.lines[gMeme.selectedLineIdx].posX = value
               break
          case 'posY':
               gMeme.lines[gMeme.selectedLineIdx].posY = value
               break
     }
}


function addMeme() {
     if (!gMeme.lines || !gMeme.lines.length) gMeme.lines = [createLine()]
     else gMeme.lines.push(createLine())
     gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function switchLine() {
     if (gMeme.selectedLineIdx === 0 && gMeme.lines.length === 1) {
          addMeme() //when only one line, it adds one as well
     } else if (gMeme.selectedLineIdx < gMeme.lines.length - 1) {
          gMeme.selectedLineIdx++
     } else {
          gMeme.selectedLineIdx = 0
     }
}

function saveMemes() {
     const allMemes = loadMemes() || []
     if (gMyMemeIdx !== -1) allMemes[gMyMemeIdx] = gMeme
     else allMemes.push(gMeme)
     saveToStorage(MEMES_KEY, allMemes)
}

function loadMemes() {
     return loadFromStorage(MEMES_KEY)
}

function randomizeLine() {
     gMeme.lines = [createLine(makeLorem(3), getRandomIntInclusive(25, 50), 'center', getRandomColor(), getRandomColor()), createLine(makeLorem(3), getRandomIntInclusive(25, 50), 'center', getRandomColor(), getRandomColor())]
}

function resetMyMemeIdx() {
     gMyMemeIdx = -1
}

function changeSelectedLine(idx) {
     gMeme.selectedLineIdx = idx
}

function setLinePos(lineIdx, axis, pos) {
     gMeme.lines[lineIdx][axis] = pos
}

function getMeme() {
     return gMeme
}

function getImages() {
     return gImgs
}

// function changeRate(changeRate, memeId) {
//      const currMeme = getMemeById(memeId)
//      currMeme.rate += changeRate
//      _saveMemes()
//      return currMeme.rate
// }

// function getFilteredMeme() {
//      return gMeme.filter(item => item.price > gFilter.min &&
//           item.price < gFilter.max &&
//           item.name.toLowerCase().includes(gFilter.name.toLowerCase()))
// }

// function getMemes() {
//      let currMeme = getFilteredMeme()
//      currMeme = _addNextPrev(currMeme)
//      const startIdx = gPageIdx * PAGE_SIZE
//      const memes = currMeme.slice(startIdx, startIdx + PAGE_SIZE)
//      return memes
// }

// function getMemeIdxById(memeId) {
//      return gMeme.findIndex(meme => meme.id === memeId)
// }

// function getMemeById(memeId) {
//      return gMeme.find(meme => meme.id === memeId)
// }

// function getFilter() {
//      return gFilter
// }

// function changeMemeFilter(filterType, filterBy) {
//      if (filterBy !== undefined && filterBy !== '') gFilter[filterType] = filterBy
//      else resetFilter(filterType)
// }

// function setMemeFilter(filterVars) {
//      gFilter = filterVars
// }

// function resetFilter(filterType) {
//      switch (filterType) {
//           case 'min':
//                gFilter.min = -Infinity
//                break
//           case 'max':
//                gFilter.max = Infinity
//                break
//           case 'name':
//                gFilter.name = ''
//                break
//      }
// }

// function prevPage() {
//      gPageIdx--
//      return gPageIdx
// }

// function nextPage() {
//      gPageIdx++
//      return gPageIdx
// }

// function saveCurrMeme(currMeme) {
//      saveToStorage(CURR_MEME_KEY, currMeme)
// }

// function getCurrMeme() {
//      return loadFromStorage(CURR_MEME_KEY) || null
// }

// function checkMemeId(currMemeId) {
//      const meme = gMeme.find(meme => {
//           return meme.id === currMemeId
//      })
//      return meme
// }