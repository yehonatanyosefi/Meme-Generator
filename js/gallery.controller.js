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

function renderMemes() {
     const elMemes = document.querySelector('.memes-container')
     const strHTML = []
     const memes = loadMemes()
     if (!memes) {
          strHTML = `No Memes Yet`
          elMemes.innerHTML = strHTML
          return
     }
     strHTML.push(memes.map((meme, idx) => `<img src="${meme.url}" onclick="onSelectMeme(${idx})" />`))
     elMemes.innerHTML = strHTML.join('').replaceAll(',', '')
}