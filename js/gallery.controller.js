'use strict'


renderGallery()

function renderGallery() {
     const elImages = document.querySelector('.img-container')
     const strHTML = []
     const imgs = getImages()
     strHTML.push(imgs.map((img, idx) => `<img src="${img.imgUrl}" onclick="onSelectImg(${idx + 1})" />`))
     elImages.innerHTML = strHTML.join('').replaceAll(',', '')
}
