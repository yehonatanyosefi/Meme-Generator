'use strict'
const USDTOILS_CONV = 3.53

var gTrans = {
    'a': {
        en: 'a',
        he: 'א'
    },
}

var gCurrLang = 'en'

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

function setLang(lang) {
    gCurrLang = lang
}

function formatCurrency(num) {
    if (gCurrLang === 'he') {
        num *= USDTOILS_CONV
        return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(num)
    }
    return `${num}$`
}

function formatNumSimple(num) {
    return num.toLocaleString('es')
}

function formatNum(num) {
    return new Intl.NumberFormat(gCurrLang).format(num)
}

function formatCurrency(num) {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(num)
}

function formatDate(time) {

    const options = {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: 'numeric',
        hour12: true,
    }

    return new Intl.DateTimeFormat(gCurrLang, options).format(time)
}

// Kilometers to Miles
function kmToMiles(km) {
    return km / 1.609
}

// Kilograms to Pounds:
function kgToLbs(kg) {
    return kg * 2.20462262185
}


function getPastRelativeFrom(ts) {
    const diff = Date.now() - new Date(ts)
    const seconds = diff / 1000
    const minutes = seconds / 60
    const hours = minutes / 60
    const days = hours / 24

    const formatter = new Intl.RelativeTimeFormat('en-US', {
        numeric: 'auto'
    })
    if (seconds <= 60) return formatter.format(-seconds, 'seconds')
    if (minutes <= 60) return formatter.format(-minutes, 'minutes')
    if (hours <= 24) return formatter.format(-hours, 'hours')
    return formatter.format(-days, 'days')
}
