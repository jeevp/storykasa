function applyAlphabeticalOrder(list, key) {
    return list.sort((a, b) => {
        if (key) {
            if (a[key] < b[key]) return -1
            if (a[key] > b[key]) return 1
        } else {
            if (a < b) return -1
            if (a > b) return 1
        }
    })
}


module.exports = applyAlphabeticalOrder
