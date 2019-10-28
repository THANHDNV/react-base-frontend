import {applyMiddleware, createStore} from 'redux'
import reducers from './reducers'
import thunk from 'redux-thunk'
import rpm from 'redux-promise-middleware'

import {saveCollections, saveFavorites} from './_helper/localStorage'

const middleware = applyMiddleware(
    thunk,
    rpm
)
let store = createStore(reducers, middleware)
export default store
store.subscribe(() => {
    saveCollections(store.getState().collection.collections)
    saveFavorites(store.getState().collection.favorites)
})