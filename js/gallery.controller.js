'use strict'

function renderGallery() {
     const elImages = document.querySelector('.img-container')
     const strHTML = []
     const imgs = getImages()
     strHTML.push(imgs.map((img, idx) => {
          if (idx !== 0) return `<img src="${img.imgUrl}" class="gallery-img" onclick="onSelectImg(${idx + 1})" />`
     }))
     let flexibleImg = 'flexible'
     if (getLang() === 'he') flexibleImg = 'flexible-he'
     strHTML.push(`<img src="img/${flexibleImg}.png" class="gallery-img" onclick="onSelectImg('rnd')" />`)
     elImages.innerHTML = strHTML.join('').replaceAll(',', '')
}

function renderMemes() {
     const elMemes = document.querySelector('.memes-container')
     const strHTML = []
     const memes = loadMemes()
     if (!memes || !memes.length) {
          const emptyText = (getLang() === 'en') ? 'No memes yet, save your first one today!' : 'טרם יצרת מימז, צור את הראשון שלך היום!'
          strHTML.push(`<div class="flex center-all" data-trans="empty-memes">${emptyText}</div>`)
          elMemes.innerHTML = strHTML.join('')
          return
     }
     strHTML.push(memes.map((meme, idx) => `<canvas class="pointer my-meme meme-canvas${idx}" onclick="onSelectMeme(${idx})" height="180" width="180"> </canvas>`))
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
          if (!meme.lines || !meme.lines.length) return
          meme.lines.forEach((line, idx) => {
               const mult = 0.4 //180/450
               line.size *= mult
               let lineHeight = canvas.height / 8
               if (line.posY) lineHeight = line.posY * mult
               else if (idx > 1) lineHeight = canvas.height / 2
               else if (idx > 0) lineHeight = canvas.height - canvas.height / 8
               let lineWidth = line.posX * mult || canvas.width / 2
               drawText(line, lineWidth, lineHeight, false, idx, ctx)
          })
     }
}