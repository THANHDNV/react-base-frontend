import React from 'react'
import {Router, Route} from 'react-router-dom'
import history from '../_helper/history'


export default class Layout extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {links} = this.props

        const routes = links.map(link => {
            return(
                <Route key={link.name} component={link.component} path={link.path} {...link.metadata || null} />
            )
        })

        return(
            <div>
                <Router history={history}>
                    {routes}
                </Router>
            </div>
        )
    }
}