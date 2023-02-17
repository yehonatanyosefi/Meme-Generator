'use strict'

let shareData = null
const elWebAPIBtn = document.querySelector('.share-api')

elWebAPIBtn.addEventListener('click', async () => {
     onShareAPI()
     setTimeout(async () => {
          await navigator.share(shareData)
     }, 200)
})

function onShareAPI() {
     const meme = getMeme()
     if (meme.selectedLineIdx !== -1) {
          meme.selectedLineIdx = -1
          renderMeme()
          setTimeout(() => getShareData(), 100)
     } else getShareData()
}

function getShareData() {
     const imgDataUrl = gElCanvas.toDataURL('image/jpeg').substring(23)
     console.log('imgDataUrl', imgDataUrl)
     const byteCharacters = atob(imgDataUrl);
     const byteNumbers = new Array(byteCharacters.length);
     for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
     }
     const byteArray = new Uint8Array(byteNumbers);
     const blob = new Blob([byteArray], { type: 'base64' });
     const filesArray = [
          new File(
               [blob],
               'meme.jpg',
               {
                    type: "image/jpeg",
                    lastModified: new Date().getTime()
               }
          )
     ]
     shareData = {
          files: filesArray,
     }
}