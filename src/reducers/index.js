import {combineReducers} from 'redux'

import search from './searchReducer'
import collection from './collectionReducer'

export default combineReducers({
    search,
    collection
})