import React from 'react'
import ReactDom from 'react-dom'
import {Provider} from 'react-redux'

import Layout from './components/layout'
import HomePage from './pages/home'
import SearchPage from './pages/search'

import store from './store'

let app = document.createElement('div')
document.body.append(app)
ReactDom.render(<Provider store={store}><Layout links={[
    {
        name: "Home",
        path: '/',
        component: HomePage,
        metadata: {
            exact: true
        }
    }, {
        name: "Search",
        path: '/search-nasa',
        component: SearchPage
    }
]}/></Provider>, app)