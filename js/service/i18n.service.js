'use strict'
const USDTOILS_CONV = 3.53

var gTrans = {
    'gallery': {
        en: 'Gallery',
        he: 'גלריה'
    },
    'my-memes': {
        en: 'My-Memes',
        he: 'מימז שלי'
    },
    'about': {
        en: 'About',
        he: 'לגבי'
    },
    'about-text': {
        en: 'This is all about love.',
        he: 'זה הכל עקב אהבה.'
    },
    'text-input': {
        en: 'Text',
        he: 'טקסט'
    },
    'text': {
        en: 'Text',
        he: 'טקסט'
    },
    'font': {
        en: 'Font',
        he: 'פונט'
    },
    'footer': {
        en: 'By Yehonatan Yosefi',
        he: 'נוצר על ידי יהונתן יוספי'
    },
    'title': {
        en: 'Meme Generator By Yehonatan Yosefi',
        he: 'יוצר מימז - יהונתן יוספי'
    },
    'logo': {
        en: 'Meme-Generator',
        he: 'יוצר-מימז'
    },
    'memes-empty': {
        en: 'No memes yet, save your first one today!',
        he: 'טרם יצרת מימז, צור את הראשון שלך היום!'
    },
    'meme-save': {
        en: 'Meme Saved Successfully! 💾',
        he: 'המימ נשמר בהצלחה! 💾'
    },
}

var gCurrLang = 'en'

function getLang() {
    return gCurrLang
}

function getTrans(transKey) {
    // if key is unknown return 'UNKNOWN'
    const transMap = gTrans[transKey]
    if (!transMap) return 'UNKNOWN'
    // get from gTrans
    let translation = transMap[gCurrLang]
    // if translation not found - use english
    if (!translation) translation = transMap.en
    return translation
}

function doTrans() {
    var els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        const transKey = el.dataset.trans
        const translation = getTrans(transKey)
        const prop = el.placeholder ? 'placeholder' : 'innerText'
        el[prop] = translation
    })
}

function toggleLang() {
    gCurrLang = (gCurrLang === 'en') ? 'he' : 'en'
    setLangSettings()
}

function setLang(lang) {
    gCurrLang = lang
    setLangSettings()
}

function setLangSettings() {
    setQueryStringParams(gCurrLang)
    if (gCurrLang === 'en') setDefaultText('Text')
    else setDefaultText('טקסט')
}
