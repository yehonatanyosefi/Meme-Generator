'use strict'


renderGallery()

function renderGallery() {
     const elImages = document.querySelector('.img-container')
     const strHTML = []
     const imgs = getImages()
     strHTML.push(imgs.map((img, idx) => `<img src="${img.imgUrl}" onclick="onSelectImg(${idx + 1})" />`))
     strHTML.push(`<button class="round-btn" onclick="onSelectImg('rnd')">I'm Flexible</button>`)
     elImages.innerHTML = strHTML.join('').replaceAll(',', '')
}

// function drawImageOnCanvas(meme, idx) {
//      const imgSrc = meme.url
//      let canvas = document.querySelector(`.image-canvas${idx}`)
//      let ctx = canvas.getContext('2d')
//      let img = new Image()
//      img.src = imgSrc
//      img.onload = function () {
//           ctx.drawImage(img, 0, 0, 180, 180)
//           meme.lines.forEach((line, idx) => {
//                line.size *= 0.4
//                let lineHeight = canvas.height / 8
//                if (idx > 1) lineHeight = canvas.height / 2
//                else if (idx > 0) lineHeight = canvas.height - canvas.height / 8
//                drawText(line, canvas.width / 2, lineHeight, false, ctx)
//           })
//      }
// }

function renderMemes() {
     const elMemes = document.querySelector('.memes-container')
     const strHTML = []
     const memes = loadMemes()
     if (!memes || !memes.length) {
          strHTML.push(`<div class="flex center-all">No Memes Yet, Save Your First One Today</div>`)
          elMemes.innerHTML = strHTML.join('')
          return
     }
     strHTML.push(memes.map((meme, idx) => `<canvas class="pointer meme-canvas${idx}" onclick="onSelectMeme(${idx})" height="180" width="180"> </canvas>`))
     elMemes.innerHTML = strHTML.join('').replaceAll(',', '')
     memes.forEach((meme, idx) => drawMemeOnCanvas(meme, idx))
}

function drawMemeOnCanvas(meme, idx) {
     const imgSrc = meme.url
     let canvas = document.querySelector(`.meme-canvas${idx}`)
     let ctx = canvas.getContext('2d')
     let img = new Image()
     img.src = imgSrc
     img.onload = function () {
          ctx.drawImage(img, 0, 0, 180, 180)
          if (!meme.lines || !memes.lines.length) return
          meme.lines.forEach((line, idx) => {
               line.size *= 0.4
               let lineHeight = canvas.height / 8
               if (idx > 1) lineHeight = canvas.height / 2
               else if (idx > 0) lineHeight = canvas.height - canvas.height / 8
               drawText(line, canvas.width / 2, lineHeight, false, ctx)
          })
     }
}
// function renderMemes() {
//      const elMemes = document.querySelector('.memes-container')
//      const strHTML = []
//      const memes = loadMemes()
//      if (!memes) {
//           strHTML = `No Memes Yet`
//           elMemes.innerHTML = strHTML
//           return
//      }
//      strHTML.push(memes.map((meme, idx) => `<img src="${meme.url}" onclick="onSelectMeme(${idx})" />`))
//      elMemes.innerHTML = strHTML.join('').replaceAll(',', '')
// }
