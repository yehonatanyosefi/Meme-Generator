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
    'empty-memes': {
        en: 'No memes yet, save your first one today!',
        he: 'טרם יצרת מימז, צור את הראשון שלך היום!'
    },
    'meme-save': {
        en: 'Meme Saved Successfully! 💾',
        he: 'המימ נשמר בהצלחה! 💾'
    },
    'img-text1': {
        en: 'Shachar',
        he: 'שחר'
    },
    'img-text2': {
        en: 'Chen',
        he: 'חן'
    },
    'img-text3': {
        en: 'Stav',
        he: 'סתיו'
    },
    'img-text4': {
        en: 'Yaron',
        he: 'ירון'
    },
    'img-text5': {
        en: 'Yuval',
        he: 'יובל'
    },
    'img-text6': {
        en: 'Tal',
        he: 'טל'
    },
    'img-text7': {
        en: 'Adam',
        he: 'אדם'
    },
    'img-text8': {
        en: 'Oshra',
        he: 'אושרה'
    },
    'img-text9': {
        en: 'Sharon',
        he: 'שרון'
    },
    'img-text10': {
        en: 'Guy',
        he: 'גיא'
    },
    'img-text11': {
        en: 'Asi',
        he: 'אסי'
    },
    'img-text12': {
        en: 'Eran',
        he: 'ערן'
    },
    'img-text13': {
        en: 'Denis',
        he: 'דניס'
    },
    'img-text14': {
        en: 'Dima',
        he: 'דימה'
    },
    'img-text15': {
        en: 'Yarden',
        he: 'ירדן'
    },
    'img-text16': {
        en: 'Tal',
        he: 'טל'
    },
    'img-text17': {
        en: 'Inbar',
        he: 'ענבר'
    },
    'img-text18': {
        en: 'Hadas',
        he: 'הדס'
    },
    'img-text19': {
        en: 'Dvir',
        he: 'דביר'
    },
    'img-text20': {
        en: 'Moria',
        he: 'מוריה'
    },
    'img-text21': {
        en: 'Lihi',
        he: 'ליהי'
    },
    'img-text22': {
        en: 'Omri',
        he: 'עמרי'
    },
    'img-text23': {
        en: 'Shani',
        he: 'שני'
    },
    'img-text24': {
        en: 'Avi',
        he: 'אבי'
    },
    'img-text25': {
        en: 'Alon',
        he: 'אלון'
    },
    'img-text26': {
        en: 'Yuval',
        he: 'יובל'
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
