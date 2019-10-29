import axios from 'axios'
import config from '../config/config.json'
import querystring from 'querystring'
import searchConst from '../constants/search'
import promise from 'redux-promise-middleware'

export function search(query) {
    return dispatch => {
        dispatch({
            type: searchConst.SEARCH_FETCH_INIT,
            payload: query
        })
        const data = {
            q: query
        }
        axios.get(`${config.nasaUrl}?${querystring.stringify(data)}`).then(async (data) => {
            let promises = []
            for (let i = 0; i< data.data.collection.items.length; i++) {
                let result = data.data.collection.items[i]
                promises.push(new Promise((resolve, reject) => {
                    axios.get(result.href).then(linksArr => {
                        result.href= linksArr.data
                        resolve()
                    }).catch(error => reject(error))
                }))
            }

            Promise.all(promises).then(() => {
                dispatch({
                    type: searchConst.SEARCH_FETCH_FULFILLED,
                    payload: data
                })
            }).catch(error => {
                dispatch({
                    type: searchConst.SEARCH_FETCH_ERROR,
                    payload: error
                })
            })
            
        }).catch(error => {
            dispatch({
                type: searchConst.SEARCH_FETCH_ERROR,
                payload: error
            })
        })
    }
}

export function clearAll() {
    return {
        type: searchConst.SEARCH_CLEAR
    }
}