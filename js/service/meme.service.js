'use strict'
//consts
const MEMES_KEY = 'memesDB'
const EMOJIS_PER_PAGE = 4
const IMAGES_NUM = 26
//vars
var gImagesText = ['Shachar', 'Chen', 'Stav', 'Yaron', 'Yuval', 'Tal', 'Adam', 'Oshra', 'Sharon', 'Guy', 'Asi', 'Eran', 'Denis', 'Dima', 'Yarden', 'Tal', 'Inbar', 'Hadas', 'Dvir', 'Moria', 'Lihi', 'Omri', 'Shani', 'Avi', 'Alon', 'Yuval',]
var gMeme = createMeme()
var gMyMemeIdx = -1
var gImgs = createImages()
var gEmojis = ['👓', '💖', '💍', '🎉', '🎃', '🎈', '💄', '🎨', '🥇', '🎧', '💰', '💩', '📞', '🎤', '🕑', '💤', '😂', '😀', '😭', '👿']
var gEmojisPage = 1
var gDefaultText = 'Text'

function createImages() {
     let images = []
     images.push(createImage(0, 'img/0.png', 'Yehonatan')) //me :)
     for (let i = 1; i <= IMAGES_NUM; i++) {
          images.push(createImage(i, `img/${i}.jpg`, gImagesText[i - 1]))
     }
     return images
}

function createImage(id, img, text) {
     return {
          id: id,
          imgUrl: img || `img/${id}.jpg`,
          text: text || 'unknown',
     }
}

function moveText(movX, movY, x, y) {
     if (!gMeme.lines[gMeme.selectedLineIdx].posX) gMeme.lines[gMeme.selectedLineIdx].posX = x + movX
     else gMeme.lines[gMeme.selectedLineIdx].posX += movX
     if (!gMeme.lines[gMeme.selectedLineIdx].posY) gMeme.lines[gMeme.selectedLineIdx].posY = y + movY
     else gMeme.lines[gMeme.selectedLineIdx].posY += movY
}

function addImage(img) {
     gImgs.push(createImage(gImgs.length + 1, img.src))
     setImg(gImgs.length)
     renderMeme()
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
          updateTextVal()
     } else {
          gMeme.lines.splice(gMeme.selectedLineIdx, 1)
          if (gMeme.selectedLineIdx !== 0) {
               gMeme.selectedLineIdx -= 1
          }
          updateTextVal()
     }
     updateFontVal()
}

function createLine(txt = gDefaultText, size = 50, align = 'center', color = 'white', stroke = 'black', font = 'secular', posX = null, posY = null, isEmoji = false) {
     return { txt, size, align, color, stroke, font, posX, posY, isEmoji }
}

function changeSize(mod) {
     if (gMeme.selectedLineIdx === -1) return
     gMeme.lines[gMeme.selectedLineIdx].size += mod
     if (gMeme.lines[gMeme.selectedLineIdx].size <= 0) gMeme.lines[gMeme.selectedLineIdx].size = 50
}

function changeLine(prop, value, canvas) {
     if (gMeme.selectedLineIdx === -1) {
          gMeme.selectedLineIdx = 0
          updateTextVal()
          updateFontVal()
     }
     switch (prop) {
          case 'text':
               if (!gMeme.lines || !gMeme.lines.length) addMeme()
               gMeme.lines[gMeme.selectedLineIdx].txt = value
               updateTextVal()
               break
          case 'align':
               switch (value) {
                    case 'left':
                         gMeme.lines[gMeme.selectedLineIdx].posX = canvas.width - canvas.width / 8
                         break
                    case 'right':
                         gMeme.lines[gMeme.selectedLineIdx].posX = canvas.width / 8
                         break
                    case 'center':
                         gMeme.lines[gMeme.selectedLineIdx].posX = canvas.width / 2
                         break
               }
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
     if (!gMeme.lines || !gMeme.lines.length) gMeme.lines = [createLine('')]
     else gMeme.lines.push(createLine())
     gMeme.selectedLineIdx = gMeme.lines.length - 1
     updateTextVal()
     updateFontVal()
}

function switchLine() {
     if (!gMeme.lines) return
     if (gMeme.selectedLineIdx === 0 && gMeme.lines.length === 1) {
          addMeme() //when only one line, it adds one as well
     } else if (gMeme.selectedLineIdx < gMeme.lines.length - 1) {
          gMeme.selectedLineIdx++
          updateTextVal()
     } else {
          gMeme.selectedLineIdx = 0
          updateTextVal()
     }
     updateFontVal()
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
     gMeme.lines = [createRandomLine(), createRandomLine()]
}
function createRandomLine() {
     return createLine(makeJoke(), getRandomIntInclusive(20, 40), 'center', getRandomColor(), getRandomColor())
}

function resetMyMemeIdx() {
     gMyMemeIdx = -1
}

function changeSelectedLine(idx) {
     gMeme.selectedLineIdx = idx
     updateTextVal()
     updateFontVal()
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

function getImagesNum() {
     return IMAGES_NUM
}

function getFilteredEmojis() {
     let startPage = gEmojisPage
     // if (gEmojis.length / EMOJIS_PER_PAGE < Math.round(gEmojisPage)) startPage = Math.floor(gEmojisPage)
     const filteredEmojis = gEmojis.slice(startPage * EMOJIS_PER_PAGE - EMOJIS_PER_PAGE, Math.floor(gEmojisPage) * EMOJIS_PER_PAGE)
     return filteredEmojis
}

function changePage(mod) {
     gEmojisPage += mod
     const lastPage = gEmojis.length / EMOJIS_PER_PAGE + (EMOJIS_PER_PAGE - 1) / EMOJIS_PER_PAGE
     if (gEmojisPage < 1) gEmojisPage = Math.floor(lastPage)
     else if (gEmojisPage > lastPage) gEmojisPage = 1
}

function getSelectedLine() {
     if (gMeme.selectedLineIdx === -1) return null
     return gMeme.lines[gMeme.selectedLineIdx]
}

function onAddTextToLine(key) {
     if (gMeme.selectedLineIdx === -1) gMeme.selectedLineIdx = 0
     if (!gMeme.lines || !gMeme.lines.length) addMeme()
     gMeme.lines[gMeme.selectedLineIdx].txt += key
     updateTextVal()
}

function onDeleteFromLine() {
     if (!gMeme.lines[gMeme.selectedLineIdx].txt) {
          deleteCurrent()
          updateTextVal()
          return
     }
     if (gMeme.selectedLineIdx === -1) gMeme.selectedLineIdx = 0
     gMeme.lines[gMeme.selectedLineIdx].txt = gMeme.lines[gMeme.selectedLineIdx].txt.slice(0, -1)
     updateTextVal()
}

function addEmoji(emoji) {
     const newLine = createLine(emoji, 50, 'center', 'white', 'black', 'secular', null, null, true)
     if (!gMeme.lines) gMeme.lines = [newLine]
     else gMeme.lines.push(newLine)
     gMeme.selectedLineIdx = gMeme.lines.length - 1
     updateTextVal()
}

function setDefaultText(txt) {
     gDefaultText = txt
}