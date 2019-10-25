import React from 'react'
import ReactDom from 'react-dom'

let app = document.createElement('div')
document.body.append(app)
ReactDom.render(<h1>Hello World</h1>, app)