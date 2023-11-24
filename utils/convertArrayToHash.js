function convertArrayToHash(array, objectKey) {
    return array.reduce((acc, item) => {
        acc[item[objectKey]] = item

        return acc
    }, {})
}


module.exports = convertArrayToHash
