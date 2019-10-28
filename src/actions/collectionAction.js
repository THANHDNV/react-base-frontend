import collectionConst from '../constants/collection'

export function addToCollection(fullData) {
    return {
        type: collectionConst.COLLECTION_ADD,
        payload: fullData
    }
}

export function editItem(id, data) {
    return {
        type: collectionConst.COLLECTION_EDIT,
        payload: {
            id,
            data
        }
    }
}

export function deleteItem(id) {
    return {
        type: collectionConst.COLLECTION_REMOVE,
        payload: id
    }
}

export function addToFavorites(id) {
    return {
        type: collectionConst.COLLECTION_FAVORITE_ADD,
        payload: id
    }
}

export function removeFromFavorite(id) {
    return {
        type: collectionConst.COLLECTION_FAVORITE_REMOVE,
        payload: id
    }
}