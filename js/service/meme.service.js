'use strict'

const MEMES_KEY = 'memesDB'
const CURR_MEME_KEY = 'currMemeDB'
const PAGE_SIZE = 5

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }
var gMeme = createMeme()
var gImgs = createImages()
var gFilter = { min: -Infinity, max: Infinity, name: '', }
var gPageIdx = 0

function getMeme() {
     return gMeme
}

function createMemes() {
     gMeme = loadFromStorage(MEMES_KEY)
     if (!gMeme || !gMeme.length) {
          gMeme = []
          let memes = ['Harry Potter', 'Narnia', 'Lord of the Rings']
          let imgCounter = 0
          memes.forEach(item => {
               gMeme.push(createMeme(item, undefined, undefined, `img/img${imgCounter}.jpg`))
               imgCounter++
          })
          // for (let i = 0; i < 98; i++) {
          //      gMeme.push(createMeme(makeLorem(1)))
          // }
          gMeme = _addNextPrev()
          _saveMemes()
     } else gMeme.forEach(item => {
          if (gDisplayId < item.displayId) gDisplayId = item.displayId + 1
     })
}

function createMeme(name, price = getRandomIntInclusive(20, 100), rate = 0, img = 'img/default.jpg') {
     return {
          selectedImgId: 5,
          selectedLineIdx: 0,
          lines: [
               { txt: 'Hello', size: 50, align: 'left', color: 'white', font: 'Impact' },
          ],
          url: img,
          prev: null,
          next: null,
     }
}
function clearCanvas() {
     gMeme.lines = [{ txt: 'Hello', size: 20, align: 'left', color: 'red' }]
}

function createImages() {
     let images = []
     for (let i = 1; i <= 18; i++) {
          images.push(createImage(i))
     }
     return images
}

function createImage(id) {
     return {
          id: id,
          imgUrl: `img/${id}.jpg`,
          keywords: ['funny', 'cat'],
          prev: null,
          next: null,
     }
}

function deleteMeme(memeId) {
     gMeme.splice(getMemeIdxById(memeId), 1)
     _saveMemes()
}

function addMeme(memeName, memePrice, imgURL) {
     gMeme.unshift(createMeme(memeName, memePrice, 0, imgURL))
     _saveMemes()
}

function updateMeme(memeId, memePrice) {
     getMemeById(memeId).price = memePrice
     _saveMemes()
}

function getCurrRate(memeId) {
     return getMemeById(memeId).rate
}

function changeRate(changeRate, memeId) {
     const currMeme = getMemeById(memeId)
     currMeme.rate += changeRate
     _saveMemes()
     return currMeme.rate
}

function getFilteredMeme() {
     return gMeme.filter(item => item.price > gFilter.min &&
          item.price < gFilter.max &&
          item.name.toLowerCase().includes(gFilter.name.toLowerCase()))
}

function getMemes() {
     let currMeme = getFilteredMeme()
     currMeme = _addNextPrev(currMeme)
     const startIdx = gPageIdx * PAGE_SIZE
     const memes = currMeme.slice(startIdx, startIdx + PAGE_SIZE)
     return memes
}

function getMemeIdxById(memeId) {
     return gMeme.findIndex(meme => meme.id === memeId)
}

function getMemeById(memeId) {
     return gMeme.find(meme => meme.id === memeId)
}

function _saveMemes() {
     saveToStorage(MEMES_KEY, gMeme)
}

function _addNextPrev(memes = gMeme) {
     memes.forEach((meme, idx) => {
          meme.prev = (idx === 0) ? gMeme[gMeme.length - 1].id : gMeme[idx - 1].id
          meme.next = (idx === gMeme.length - 1) ? gMeme[0].id : gMeme[idx + 1].id
     })
     return Memes
}

function getFilter() {
     return gFilter
}

function changeMemeFilter(filterType, filterBy) {
     if (filterBy !== undefined && filterBy !== '') gFilter[filterType] = filterBy
     else resetFilter(filterType)
}

function setMemeFilter(filterVars) {
     gFilter = filterVars
}

function getImages() {
     return gImgs
}

function resetFilter(filterType) {
     switch (filterType) {
          case 'min':
               gFilter.min = -Infinity
               break
          case 'max':
               gFilter.max = Infinity
               break
          case 'name':
               gFilter.name = ''
               break
     }
}

function prevPage() {
     gPageIdx--
     return gPageIdx
}

function nextPage() {
     gPageIdx++
     return gPageIdx
}

function saveCurrMeme(currMeme) {
     saveToStorage(CURR_MEME_KEY, currMeme)
}

function getCurrMeme() {
     return loadFromStorage(CURR_MEME_KEY) || null
}

function checkMemeId(currMemeId) {
     const meme = gMeme.find(meme => {
          return meme.id === currMemeId
     })
     return meme
}