function applyAlphabeticalOrder(list, key) {
    return list.sort((a, b) => {
        if (key) {
            if (a[key]?.trim() < b[key]?.trim()) return -1
            if (a[key] > b[key]) return 1
        } else {
            if (a?.trim() < b?.trim()) return -1
            if (a?.trim() > b?.trim()) return 1
        }
    })
}


module.exports = applyAlphabeticalOrder
