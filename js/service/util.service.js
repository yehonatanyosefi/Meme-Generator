'use strict'

function sortByName(arr, varName) {
    return arr.sort((item1, item2) => item1[varName].localeCompare(item2[varName]))
}

function sortByNumbers(nums, varName) {
    return arr.sort((a, b) => a[varName] - b[varName])
}

function getValByQSParams(param) { //gets query string
    const queryStringParams = new URLSearchParams(window.location.search)
    return queryStringParams.get(param)
}

function setQueryStringParams(filterBy) { //sets query string params with an object like we had before
    const queryStringParams = `?min=${filterBy.min}&max=${filterBy.max}&name=${filterBy.name}&modal=${gIsModalOpen}&lang=${getLang()}&arrId=${gCurrarrId}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}
function setQueryParams(newParams) { //Sets with an object different way
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    for (let paramName in newParams) {
        const paramValue = newParams[paramName];
        params.set(paramName, paramValue); // used to update an existing query string parameter or add a new one if it doesn't exist.
    }

    url.search = params.toString();
    window.history.pushState({ path: url.href }, '', url.href); //modify the URL of the current page without reloading the page
}

function makeId(length = 6) { //makes random ID
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var txt = ''
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function makeLorem(wordCount = 100) { //makes random text
    const words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', 'All', 'this happened', 'more or less', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (wordCount > 0) {
        wordCount--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function startTimer() { //starts timer and updates updateTimer(time) with the current time
    let startTime = new Date().getTime()
    gGame.timerInterval = setInterval(function () {
        let currentTime = new Date().getTime()
        let elapsedTime = currentTime - startTime
        let seconds = Math.floor(elapsedTime / 1)
        let timePassed = parseInt(seconds / 1000)
        updateTimer(timePassed)
    }, 10)
}

function playSound(fileName, volume = 1, loop = false) { //plays a sound from a fileName in audio folder
    let audio = new Audio(`audio/${fileName}.mp3`)
    audio.loop = loop
    audio.volume = volume * 0.5
    audio.play()
}

function objProps(obj, func = colog) { //unpacks all children of an object and does a function on them, default = console log
    for (let val in obj) {
        if (isObject(obj[val])) objProps(obj[val])
        else func(obj[val])
    }
}
function colog(val) {
    return console.log('value:', val)
}

function isObject(val) { //checks if a value is an object
    if (val === null) return false
    else return (typeof val === 'object')
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

function getNegs(cellI, cellJ, mat, symbol) { //gets the neighbors of a cell object with a certain symbol in a matrix
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            else if (mat[i][j] === symbol) negsCount++
        }
    }
    return negsCount
}

function getNums(drawSize) { //gets an array of ordered numbers by drawSize
    var nums = []
    for (var i = 1; i <= drawSize; i++) {
        nums.push(i)
    }
    return nums
}

function shuffle(array) { //shuffles an array and returns it shuffled
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
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