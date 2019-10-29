import React, { Component } from "react"
import {CSSTransition} from 'react-transition-group'
import {createPortal} from 'react-dom'

import '../style/fontawesome.min.css'
import '../style/light.min.css'
import '../style/modal.css'

export default class Modal extends Component {
    constructor(props) {
        super(props)
    }

    onEscKeyDown(e) {
        if (e.key === "Escape") {
            this.props.onClose()
        }
    }

    lock() {
        this.toggleScrollLock();
        window.addEventListener("keydown", this.onEscKeyDown.bind(this), false)
    }

    unlock() {
        this.toggleScrollLock();
        window.removeEventListener("keydown", this.onEscKeyDown.bind(this), false)
    }

    onClickAway(e) {
        if (this.modalNode && this.modalNode.contains(e.target)) return;
        this.props.onClose()
    }
    
    toggleScrollLock() {
        document.querySelector('html').classList.toggle('lock-scroll')
    }

    render() {
        const duration = 300

        let closeButton = null
        if (this.props.closeButton) {
            closeButton = (
                <div className="close_button" onClick={this.props.onClose}>
                    <i className="fal fa-times fa-2x" />
                </div>
            )
        }
        

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
            <CSSTransition in={this.props.isShow} timeout={duration} unmountOnExit appear classNames="modal-transition" onEntered={this.lock.bind(this)} onExited={this.unlock.bind(this)}>
                <div id={this.props.id} role='dialog' aria-label="Custom Modal" className={"custom_modal_cover" + (this.props.className ? ' ' + this.props.className : '')} style={{...this.props.style}} aria-modal="true" onClick={this.onClickAway.bind(this)}>
                    <div className={"custom_modal" + (this.props.dialogClassName ? ' ' + this.props.dialogClassName : '')} ref={(node) => this.modalNode = node}>
                        {closeButton}
                        {this.props.children}
                    </div>
                </div>
            </CSSTransition>
        , document.body);
    }
}