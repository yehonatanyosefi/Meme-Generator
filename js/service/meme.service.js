'use strict'

const MEMES_KEY = 'memesDB'
const CURR_MEME_KEY = 'currMemeDB'
const PAGE_SIZE = 5

// var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }
var gMeme = createMeme()

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

function addImage(img) { //TODO: fix bug in display on gallery
     gImgs.push(createImage(gImgs.length + 1, img.src))
     setImg(gImgs.length)
     renderMeme()
     renderGallery()
}

function setImg(imgId) {
     gMeme.selectedImgId = imgId
     gMeme.selectedLineIdx = 0
     gMeme.url = gImgs[imgId - 1].imgUrl
}
function setMeme(memeIdx) {
     const oldMemes = loadMemes()
     gMeme = oldMemes[memeIdx]
}

function createMeme() {
     return {
          selectedImgId: 5,
          selectedLineIdx: 0,
          lines: [
               createLine()
          ],
          prev: null,
          next: null,
     }
}

function resetCanvas() {
     gMeme.lines = [createLine()]
     gMeme.selectedLineIdx = 0
}

function createLine(txt = 'Hello', size = 50, align = 'center', color = 'white', stroke = 'black', font = 'Impact', posY = null) {
     return { txt, size, align, color, stroke, font, posY }
}

function changeLine(prop, value) {
     switch (prop) {
          case 'size':
               if (!value) value = 50
               gMeme.lines[gMeme.selectedLineIdx].size = value
               break
          case 'text':
               if (!value) value = ' '
               gMeme.lines[gMeme.selectedLineIdx].txt = value
               break
          case 'fill':
               gMeme.lines[gMeme.selectedLineIdx].color = value
               break
          case 'font':
               gMeme.lines[gMeme.selectedLineIdx].font = value
               break
          case 'posY':
               gMeme.lines[gMeme.selectedLineIdx].posY = value
               break
     }
}

function getMeme() {
     return gMeme
}

function getImages() {
     return gImgs
}

function switchLine() {
     if (gMeme.selectedLineIdx === 0 && gMeme.lines.length === 1) {
          gMeme.lines.push(createLine())
          gMeme.selectedLineIdx++
     } else if (gMeme.selectedLineIdx < gMeme.lines.length - 1) {
          gMeme.selectedLineIdx++
     } else {
          gMeme.selectedLineIdx = 0
     }
}

function saveMemes() {
     const allMemes = loadMemes() || []
     allMemes.push(gMeme)
     saveToStorage(MEMES_KEY, allMemes)
}

function loadMemes() {
     return loadFromStorage(MEMES_KEY)
}

function randomizeLine() {
     gMeme.lines = [createLine(makeLorem(3), getRandomIntInclusive(25, 50), 'center', getRandomColor(), getRandomColor())]
}

// function deleteMeme(memeId) {
//      gMeme.splice(getMemeIdxById(memeId), 1)
//      _saveMemes()
// }

// function addMeme(memeName, memePrice, imgURL) {
//      gMeme.unshift(createMeme(memeName, memePrice, 0, imgURL))
//      _saveMemes()
// }

// function updateMeme(memeId, memePrice) {
//      getMemeById(memeId).price = memePrice
//      _saveMemes()
// }

// function getCurrRate(memeId) {
//      return getMemeById(memeId).rate
// }

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

// function _saveMemes() {
//      saveToStorage(MEMES_KEY, gMeme)
// }

// function _addNextPrev(memes = gMeme) {
//      memes.forEach((meme, idx) => {
//           meme.prev = (idx === 0) ? gMeme[gMeme.length - 1].id : gMeme[idx - 1].id
//           meme.next = (idx === gMeme.length - 1) ? gMeme[0].id : gMeme[idx + 1].id
//      })
//      return Memes
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