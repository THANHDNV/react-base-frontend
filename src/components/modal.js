import React, { Component } from "react"
import ReactCssTransitionGroup from 'react-addons-css-transition-group'
import {createPortal} from 'react-dom'

import '../style/fontawesome.min.css'
import '../style/light.min.css'
import '../style/modal.css'

export default class Modal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShow: null,
            disabled: false
        }
    }

    componentDidMount() {
        setTimeout(() => this.setState({isShow: true}), 0)
        this.toggleScrollLock();
        window.addEventListener("keydown", this.onEscKeyDown.bind(this), false)
    }

    componentWillUnmount() {
        console.log('unmount')
        this.toggleScrollLock();
        window.removeEventListener("keydown", this.onEscKeyDown, false)
    }

    onEscKeyDown(e) {
        if (e.key === "Escape") this.setState({isShow: false})
    }

    onTransitionEnd(e) {
        console.log('end transition')
        if (!this.state.isShow) {
            this.props.onClose();
        }
    }

    handleClick(e) {
        e.preventDefault();
        this.setState({isShow: false})
    }

    onClickAway(e) {
        if (this.modalNode && this.modalNode.contains(e.target)) return;
        this.handleClick(e)
    }
    
    toggleScrollLock() {
        document.querySelector('html').classList.toggle('lock-scroll')
    }

    componentDidUpdate(nextProps) {
        // if (!this.props.isShow) this.setState({isShow: false})
        if (nextProps.isShow != this.props.isShow) this.setState({isShow: false})
    }

    render() {
        let transitionClass = null
        if (this.state.isShow) {
            // if (this.props.isShow)
            //     transitionClass = "modal-transition-enter modal-transition-enter-active"
            // else
            //     transitionClass = "modal-transition-leave modal-transition-leave-active"
            transitionClass = "modal-transition-enter modal-transition-enter-active"
        } else {
            transitionClass = "modal-transition-leave modal-transition-leave-active"
        }

        let closeButton = null
        if (this.props.closeButton) {
            closeButton = (
                <div className="close_button" onClick={this.handleClick.bind(this)}>
                    <i className="fal fa-times fa-2x" />
                </div>
            )
        }

        let body = (
            <div id={this.props.id} role='dialog' aria-label="Custom Modal" className={"custom_modal_cover" + " " + transitionClass + (this.props.className ? ' ' + this.props.className : '')} style={{...this.props.style}} onTransitionEnd={this.onTransitionEnd.bind(this)} aria-modal="true" onClick={this.onClickAway.bind(this)}>
                <div className={"custom_modal" + (this.props.dialogClassName ? ' ' + this.props.dialogClassName : '')} ref={(node) => this.modalNode = node}>
                    {closeButton}
                    {this.props.children}
                </div>
            </div>
        )
        

        // if (show) {
        //     if (isShow) {
        //         body = this.renderBody()
        //     }
        // } else {
        //     body = this.renderBody()
        // }
        
        return createPortal(
            // <ReactCssTransitionGroup transitionName="modal-transition" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
            //     {body}
            // </ReactCssTransitionGroup>
            <div>
                {body}
            </div>
        , document.body);
    }
}