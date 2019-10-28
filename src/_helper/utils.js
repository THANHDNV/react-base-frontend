function getShortDescription(text) {
    let arr = text.split(' ')
    let i = 0;
    let str = ''
    while ((str.length + 3) <= 150 && i < arr.length) {
        if (((str + ' ' + arr[i]).length + 3) > 150) break;
        str += ' ' + arr[i];
        i += 1;
    }
    if (i == (arr.length - 1)) return str
    return str + '...';
}
export {getShortDescription}