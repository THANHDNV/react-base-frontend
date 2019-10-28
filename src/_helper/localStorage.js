function loadCollections() {
    try {
        const serializedCollections = localStorage.getItem('collection')
        if (!serializedCollections) return []
        return JSON.parse(serializedCollections)
    } catch (error) {
        return []
    }
}
export {loadCollections}

function loadFavorites() {
    try {
        const serializedCollections = localStorage.getItem('favorites')
        if (!serializedCollections) return []
        return JSON.parse(serializedCollections)
    } catch (error) {
        return []
    }
}
export {loadFavorites}

function saveCollections(collection) {
    try {
        const serializedCollections = JSON.stringify(collection)
        localStorage.setItem('collection', serializedCollections)
    } catch (error) {
        console.log('unable to save collection to local storage')
    }
}
export {saveCollections}

function saveFavorites(favorites) {
    try {
        const serializedCollections = JSON.stringify(favorites)
        localStorage.setItem('favorites', serializedCollections)
    } catch (error) {
        console.log('unable to save favorites to local storage')
    }
}
export {saveFavorites}