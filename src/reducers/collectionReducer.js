import collectionConst from '../constants/collection'
import {loadCollections, loadFavorites} from '../_helper/localStorage'

const initialState = {
    collections: loadCollections(),
    favorites: loadFavorites()
}

export default function collectionReducer(state = initialState, action) {
    let cIndex;
    let fIndex
    let newCollection;
    let newFavorites
    switch(action.type) {
        case collectionConst.COLLECTION_ADD:
            if (state.collections.length == 0) {
                action.payload.id = 1
            } else {
                let largestId = Math.max(...state.collections.map(x=>x.id))
                action.payload.id = (largestId + 1)
            }
            return {
                ...state,
                collections: [
                    ...state.collections,
                    action.payload
                ]
            }
        case collectionConst.COLLECTION_REMOVE:
            newCollection = state.collections.filter(item => item.id != action.payload)
            newFavorites = state.favorites.filter(item => item.id != action.payload)
            return {
                ...state,
                collections: newCollection,
                favorites: newFavorites
            }
        case collectionConst.COLLECTION_EDIT:
            cIndex = state.collections.findIndex(item => item.id == action.payload.id)
            if (cIndex > -1) {
                state.collections[cIndex] = action.payload.data
            }

            fIndex = state.favorites.findIndex(item => item.id == action.payload.id)
            if (fIndex > -1) {
                state.favorites[fIndex] = action.payload.data
            }
            return {
                ...state
            }
        case collectionConst.COLLECTION_FAVORITE_ADD:
            cIndex = state.collections.findIndex(item => item.id == action.payload)
            if (cIndex > -1) {
                return {
                    ...state,
                    favorites: [
                        ...state.favorites,
                        state.collections[cIndex]
                    ]
                }
            }
            return {
                ...state
            }
        case collectionConst.COLLECTION_FAVORITE_REMOVE:
            newFavorites = state.favorites.filter(item => item.id != action.payload)
            return {
                ...state,
                favorites: newFavorites
            }
        default:
            return state
    }
}