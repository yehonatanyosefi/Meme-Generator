'use strict'

function makeJoke(jokeCount = 1) { //makes random text
    const words = ['קליק קלאק', 'בסיידר', 'מאגניייייב', 'יקרים', 'לא הייתי שולח לדודה', 'זה אמור לקחת שעה', '?רוצה סקר על שקשוקה', '?איפה המצלמות שלכם', '?יש שאלה איסלם', 'בוווקר טווב', '?מאק קורה', `קג'ן 23`, '?למישהו יש שאלות', 'נחמדי', 'פשוטי', 'אני מרגישה ורוד היום', 'לירון']
    var txt = ''
    while (jokeCount > 0) {
        jokeCount--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomColor() { //gets random color with a #
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomIntInclusive(min, max) { //gets random int, with maximum inclusive
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getRandomIntExclusive(min, max) { //gets random int, stopping at one before maximum
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function isSpecialKey(keyCode) {
    if (keyCode == 9 // Tab
        || keyCode == 13 //Enter
        || keyCode == 16 // Shift
        || keyCode == 17 // Ctrl
        || keyCode == 18 // Alt
        || keyCode == 19 // Pause/Break
        || keyCode == 20 // Caps Lock
        || keyCode == 27 // Escape
        || keyCode == 33 // Page Up
        || keyCode == 34 // Page Down
        || keyCode == 35 // End
        || keyCode == 36 // Home
        || keyCode == 37 // Left arrow
        || keyCode == 38 // Up arrow
        || keyCode == 39 // Right arrow
        || keyCode == 40 // Down arrow
        || keyCode == 45 // Insert
        || keyCode == 91 // Left Windows/Command key
        || keyCode == 92 // Right Windows/Command key
        || keyCode == 93 // Select key
        || (keyCode >= 112 && keyCode <= 123) // Function keys
        || (keyCode >= 144 && keyCode <= 145)) // Num Lock and Scroll Lock
    {
        return true
    }
    return false
}

function getValByQSParams(param) { //gets query string
    const queryStringParams = new URLSearchParams(window.location.search)
    return queryStringParams.get(param)
}

function setQueryStringParams(lang) { //sets query string params with an object like we had before
    const queryStringParams = `?lang=${lang}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}