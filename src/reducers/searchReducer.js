import searchConstant from '../constants/search'

const initialState = {
    results: [],
    fetching: false,
    fetched: false,
    error: null,
    searchValue: ''
}

export default function searchReducer(state=initialState, action) {
    switch(action.type) {
        case searchConstant.SEARCH_FETCH_INIT:
            return {
                ...state,
                fetching: true,
                fetched: false,
                searchValue: action.payload
            }
        case searchConstant.SEARCH_FETCH_FULFILLED:
            const {data} = action.payload;
            return {
                ...state,
                fetching: false,
                fetched: true,
                results: data.collection.items || []
            }
        case searchConstant.SEARCH_FETCH_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: true,
                error: action.payload
            }
        case searchConstant.SEARCH_CLEAR:
            return {
                ...initialState
            }
        default:
            return state
    }
}