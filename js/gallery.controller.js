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

function renderMemes(memes) {
     const elImages = document.querySelector('.memes-container')
     const strHTML = []
     strHTML.push(memes.map((meme, idx) => `<img src="${img.imgUrl}" onclick="onSelectImg(${idx + 1})" />`))
     elImages.innerHTML = strHTML.join('').replaceAll(',', '')
}