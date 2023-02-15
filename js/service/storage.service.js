'use strict'

function saveToStorage(key, value) { //saves to Local Storage
     var json = JSON.stringify(value)
     localStorage.setItem(key, json)
}

function loadFromStorage(key) { //gets from Local Storage
     var json = localStorage.getItem(key)
     var value = JSON.parse(json)
     return value
}

function removeFromStorage(key) { //removes from Local Storage
     localStorage.removeItem(key)
}