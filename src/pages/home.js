import React from 'react'
import { connect } from 'react-redux'
import Moment from 'moment'
import {Modal} from 'react-bootstrap'
import CustomModal from '../components/modal'

import history from '../_helper/history'
import {getShortDescription} from '../_helper/utils'
import * as collectionAction from '../actions/collectionAction'

import '../style/main.css'
import '../style/fontawesome.min.css'
import '../style/light.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'

class HomePage extends React.Component {
    constructor() {
        super()
        this.state = {}
    }
    changeUrl(link) {
        history.push(link)
    }

    onClickPreview(mediaType, mediaLink, title) {
        this.setState({
            showModal: true,
            modalType: "preview",
            modalData: {
                mediaType,
                mediaLink,
                title
            }
        })
    }

    addToFavorite(id) {
        this.props.dispatch(collectionAction.addToFavorites(id))
    }

    removeFromFavorite(id) {
        this.props.dispatch(collectionAction.removeFromFavorite(id))
    }

    removeFromCollection(id) {
        this.props.dispatch(collectionAction.deleteItem(id))
    }

    showDeleteDialog(id) {
        this.setState({
            showModal: true,
            modalType: "delete",
            modalData: {
                id: id
            }
        })
    }

    handleCloseModal() {
        console.log('set showModal false')
        this.setState({
            showModal: false
        })
    }

    onClickEdit(fullData) {
        let [data] = fullData.data
        let title = data.title,
        description = data.description,
        type = data.media_type,
        previewLink = fullData.links ? fullData.links[0].href : null,
        fileLink = fullData.href[0]


        this.setState({
            showModal: true,
            modalType: "edit",
            modalData: {
                title,
                description,
                type,
                previewLink,
                fileLink,
                fullData
            }
        })
    }

    handleChangeInModal(e) {
        this.setState({
            modalData: {
                ...this.state.modalData,
                [e.target.name]: e.target.value
            }
        })
    }

    handleEditItem(fullData) {
        const {title,
            description,
            type,
            previewLink,
            fileLink} = this.state.modalData
        let data = {...fullData.data[0]}
        let links
        data.title = title
        data.description = description
        data.media_type = type
        if (fullData.links) {
            links = fullData.links[0]
            links.href = previewLink
        }
        let href = {...fullData.href[0]}
        href = fileLink

        let newData = {
            ...fullData,
            data: [
                data
            ],
            href : [
                href
            ]
        }
        if (links) {
            newData.links = [links]
        }
        
        this.props.dispatch(collectionAction.editItem(fullData.id, newData))
        this.setState({
            showModal: false
        })
    }

    render() {
        let {collections, favorites} = this.props.collectionStore
        let {showModal, modalType, modalData} = this.state
        let items = collections.map((item,i) => {
            let [data] = item.data

            let thumbnail = null
            let link = null
            switch(data.media_type) {
                case 'video':
                    link = item.href.find(href => {
                        let split = href.split('.')
                        switch(split[split.length -1]) {
                            case 'mp4':
                                return true;
                            default:
                                return false;
                        }
                    })
                    thumbnail = (
                        <div className="thumbnail" onClick={this.onClickPreview.bind(this, data.media_type, link || null, data.title)}>
                            <img src={item.links[0].href}/>
                            <div style={{top: 0, width: "100%", height: "100%", position: "absolute", display: "flex", alignItems: "center"}}>
                                <div style={{width: "50px", height: "50px", margin: "auto", backgroundColor: "rgb(242,242,242, 0.8)", borderRadius: "25px", alignItems: "center", display: "flex"}}>
                                    <i className="fas fa-play fa-2x" style={{margin: "auto", marginLeft: "15px", color: "black"}}/>
                                </div>
                            </div>
                        </div>
                    );
                    break;
                case 'image':
                    link = item.href.find(href => {
                        let split = href.split('.')
                        switch(split[split.length -1]) {
                            case 'apng':
                            case 'bmp':
                            case 'gif':
                            case 'ico':
                            case 'cur':
                            case 'jpg':
                            case 'jpeg':
                            case 'jfif':
                            case 'pjpeg':
                            case 'pjp':
                            case 'png':
                            case 'svg':
                                return true;
                            default:
                                return false;
                        }
                    })
                    thumbnail = (
                        <div className="thumbnail" onClick={this.onClickPreview.bind(this, data.media_type, link, data.title)}>
                            <img src={item.links[0].href}/>
                        </div>
                    );
                    break;
                case 'audio':
                    link = item.href.find(href => {
                        let split = href.split('.')
                        switch(split[split.length -1]) {
                            case 'mp3':
                            case 'ogg':
                            case 'wav':
                                return true;
                            default:
                                return false;
                        }
                    })
                    thumbnail = (
                        <div className="thumbnail" onClick={this.onClickPreview.bind(this, data.media_type, item.href[0] || null, data.title)}>
                            <img src={audioImage}/>
                            <div style={{top: 0, width: "100%", height: "100%", position: "absolute", display: "flex", alignItems: "center"}}>
                                <div style={{width: "50px", height: "50px", margin: "auto", backgroundColor: "rgb(242,242,242, 0.8)", borderRadius: "25px", alignItems: "center", display: "flex"}}>
                                    <i className="fas fa-play fa-2x" style={{margin: "auto", marginLeft: "15px", color: "black"}}/>
                                </div>
                            </div>
                        </div>
                    );
                    break;
                default:
                    break;
            }

            let description =''
            if (data.description.length > 150) {
                description = getShortDescription(data.description)
            } else {
                description = data.description
            }

            let favoriteClass = 'fa-heart fa-2x'
            let favoriteOnClick
            if (favorites.findIndex(fav => fav.id == item.id) > -1) {
                favoriteClass += ' fas'
                favoriteOnClick = this.removeFromFavorite.bind(this, item.id)
            } else {
                favoriteClass += ' fal'
                favoriteOnClick = this.addToFavorite.bind(this, item.id)
            }
            
            return(
                <div className="search_result" key={i}>
                    {thumbnail}
                    <div style={{width: "100%"}}>
                        
                        <div style={{display: "inline-block"}}>
                            {data.center}
                        </div>
                        <div style={{display: "inline-block", float: "right"}}>
                            {(new Moment(data.date_created)).format('DD MMM, YYYY')}    
                        </div>
                    </div>
                    <div style={{color: "black", fontSize: "2em", fontWeight: "bold"}}>
                        {data.title}
                    </div>
                    <div>
                        {description}
                    </div>
                    <div className="action_list">
                        <div className="action first" onClick={favoriteOnClick}>
                            <i className={favoriteClass} />
                        </div>
                        <div className='action' onClick={this.showDeleteDialog.bind(this, item.id)}>
                            <i className="fal fa-trash-alt fa-2x" />
                        </div>
                        <div className='action' onClick={this.onClickEdit.bind(this,item)}>
                            <i className="fal fa-pen fa-2x" />
                        </div>
                    </div>
                </div>
            )
        })

        let modal;
        if (modalType) {
            switch(modalType) {
                case 'preview':
                    let content = null
                    switch(modalData.mediaType) {
                        case 'video':
                            content = (
                                <video controls style={{width: "100%", height: "auto", borderRadius: "5px"}}>
                                    <source src={modalData.mediaLink} />
                                </video>
                            );
                            break;
                        case 'image':
                            content = (
                                <img src={modalData.mediaLink} style={{width: "100%", height: "auto", borderRadius: "5px"}}/>
                            )
                            break;
                        case 'audio':
                            content = (
                                <audio controls style={{width: "100%", height: "auto", borderRadius: "5px"}}>
                                    <source src={modalData.mediaLink} />
                                </audio>
                            );
                            break;
                        default:
                            break;
                    }
                    modal = (
                        <div>
                            <Modal show={showModal} onHide={this.handleCloseModal.bind(this)} dialogClassName="custom_dialog" style={{backgroundColor: "#333333"}}>
                                <div style={{fontWeight: "bold", fontSize: "3em", color: '#CCCCCC'}}>
                                    {modalData.title}
                                </div>
                                <div>
                                    {content}
                                </div>
                            </Modal>
                        </div>
                    );
                    break;
                case 'edit':
                    modal = (
                        <div>
                            <Modal show={showModal} onHide={this.handleCloseModal.bind(this)}>
                                <Modal.Header closeButton>
                                    <span style={{fontWeight: "bold", fontSize: "2em"}}>Edit</span>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className={'float_container ' + (modalData.title.length > 0 ? 'active' : '')}>
                                        <label htmlFor="title">Title</label>
                                        <input name="title" type="text" value={modalData.title} onChange={this.handleChangeInModal.bind(this, event)}/>
                                    </div>
                                    <div className={'float_container ' + (modalData.description.length > 0 ? 'active' : '')}>
                                        <label htmlFor="description">Description</label>
                                        <textarea name="description" rows={15} wrap="soft" onChange={this.handleChangeInModal.bind(this, event)} value={modalData.description}></textarea>
                                    </div>
                                    <div className={'float_container ' + (modalData.type.length > 0 ? 'active' : '')}>
                                        <label htmlFor="type">Type</label>
                                        <div className="select">
                                            <select name="type" onChange={this.handleChangeInModal.bind(this, event)} value={modalData.type}>
                                                <option value="video">Video</option>
                                                <option value="image">Image</option>
                                                <option value="audio">Audio</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className={'float_container ' + (modalData.title.length > 0 ? 'active' : '')}>
                                        <label htmlFor="previewLink">Link preview image url<span style={{color: "red"}}>*</span></label>
                                        <input name="previewLink" type="text" value={modalData.previewLink} onChange={this.handleChangeInModal.bind(this, event)}/>
                                    </div>
                                    <div className={'float_container ' + (modalData.title.length > 0 ? 'active' : '')}>
                                        <label htmlFor="fileLink">Link file url<span style={{color: "red"}}>*</span></label>
                                        <input name="fileLink" type="text" value={modalData.fileLink} onChange={this.handleChangeInModal.bind(this, event)}/>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer style={{justifyContent: "flex-start"}}>
                                    <div className="add_button" onClick={this.handleEditItem.bind(this, modalData.fullData)}>
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <i className="fal fa-check fa-3x" style={{paddingLeft: "15px", paddingRight: "15px"}}></i>
                                            <div style={{display: "inline-block", fontSize: "1em", marginLeft: "auto", marginRight: "auto"}}>
                                                Save
                                            </div>
                                        </div>
                                    </div>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    );
                    break;
                case 'delete':
                    modal=(
                        <CustomModal onClose={this.handleCloseModal.bind(this)} isShow={showModal} closeButton>
                            <div>
                                This is a custom modal!!!!!!!!!!!
                            </div>
                            <button onClick={this.handleCloseModal.bind(this)}>
                                Close
                            </button>
                        </CustomModal>
                    )
                    break;
                default:
                    modal = null;
                    break;
            }
        }

        return(
            <div className="pageContainer">
                <div style={{marginBottom: "5%"}}>
                    <div className="header" style={{display: "inline-block", fontSize: "3em", fontWeight: "bold", color: "#B2B2B2"}}>NASA Collection</div>
                    <div style={{display: "inline-block", float: "right"}}>
                        <div className="search_button" onClick={() => this.changeUrl('/search-nasa')}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <i className="fal fa-plus fa-3x" style={{paddingLeft: "15px", paddingRight: "15px"}}></i>
                                <div style={{display: "inline-block", fontSize: "1em", marginLeft: "auto", marginRight: "auto"}}>
                                    Add new item
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{marginTop: "5%"}}>
                    <div className="search_results_container">
                        {items}
                    </div>
                </div>
                {modal}
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            collectionStore: state.collection
        }
    },
    dispatch => {
        return {
            dispatch
        }
    }
)(HomePage)