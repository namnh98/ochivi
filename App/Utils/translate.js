import requests from "./requests";
//Translate unlimited and free, develop by Buminta
export default (text = "", from = "vi", to = "zh") => {
    const url = `https://translate.google.com/translate_a/single?client=at&dt=t&dt=ld&dt=qca&dt=rm&dt=bd&dj=1&hl=es-ES&ie=UTF-8&oe=UTF-8&inputm=2&otf=2&q=${text}&sl=${from}&tl=${to}`
    const request = requests.get(url)
    let promise = new Promise((resolve, reject) => {
        request.then(res => {
            resolve((res.sentences && res.sentences.length > 0) ? res.sentences[0].trans : text)
        }).catch(err => {
            reject(err)
        })
    })
    promise.cancel = request.cancel
    return promise
}
