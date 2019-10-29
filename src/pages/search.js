import React from 'react'
import {connect} from 'react-redux'
import Moment from 'moment'
import CustomModal from '../components/modal'

import history from '../_helper/history'
import * as searchAction from '../actions/searchAction'
import * as collectionAction from '../actions/collectionAction'
import {getShortDescription} from '../_helper/utils'

import '../style/main.css'
import '../style/fontawesome.min.css'
import '../style/light.min.css'
import '../style/solid.min.css'

import audioImage from '../assets/images/audio-wave.jpg'
import loadingGif from '../assets/images/loading.gif'
import { isNullOrUndefined } from 'util'

class SearchPage extends React.Component {
    constructor(props) {
        super(props)
        this.state= {}
        this.handleChangeInModal = this.handleChangeInModal.bind(this)
    }

    changeUrl(link) {
        history.push(link)
        this.props.dispatch(searchAction.clearAll())
    }

    onInput(e) {
        let value = e.target.value
        this.setState({
            searchValue: value
        })
    }

    onInputKeyPress(e) {
        let searchValue = e.target.value
        if (e.key == "Enter") {
            if (searchValue && searchValue.length > 0) {
                this.props.dispatch(searchAction.search(searchValue))
            }
        }
    }

    onClickAdd(result) {
        let [data] = result.data
        let title = data.title,
        description = data.description,
        type = data.media_type,
        previewLink = result.links ? result.links[0].href : null
        let fileLink
        switch(type) {
            case 'video':
                fileLink = result.href.find(href => {
                    let split = href.split('.')
                    switch(split[split.length -1]) {
                        case 'mp4':
                            return true;
                        default:
                            return false;
                    }
                })
                break;
            case 'image':
                fileLink = result.href.find(href => {
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
                break;
            case 'audio':
                fileLink = result.href.find(href => {
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
                break;
            default:
                break;
        }


        this.setState({
            showModal: true,
            modalType: "add",
            modalData: {
                title,
                description,
                type,
                previewLink,
                fileLink,
                fullData: result
            }
        })
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

    handleCloseModal() {
        this.setState({
            showModal: false
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

    handleAddItem(fullData) {
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
        let href = fileLink

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
        
        this.props.dispatch(collectionAction.addToCollection(newData))
        this.setState({
            showModal: false
        })
    }

    render() {
        const {results, fetching, fetched, searchValue: sValue, error} = this.props.searchStore
        const {showModal, modalType, modalData} = this.state
        const searchValue = this.state.searchValue || ''
        let resultString = ""

        if (!fetching) {
            if (results.length > 0) {
                let n = results.length
                resultString = `${n} result${n > 1 ? 's': ''} for "${sValue}"`
            } else {
                if (fetched) resultString = `No result for "${sValue}"`
            }
        }

        let items = []
        let err = null
        if (fetched) {
            items = results.map((result,i) => {
                let [data] = result.data

                let thumbnail = null
                let link = null
                switch(data.media_type) {
                    case 'video':
                        link = result.href.find(href => {
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
                                <img src={result.links[0].href}/>
                                <div style={{top: 0, width: "100%", height: "100%", position: "absolute", display: "flex", alignItems: "center"}}>
                                    <div style={{width: "50px", height: "50px", margin: "auto", backgroundColor: "rgb(242,242,242, 0.8)", borderRadius: "25px", alignItems: "center", display: "flex"}}>
                                        <i className="fas fa-play fa-2x" style={{margin: "auto", marginLeft: "15px", color: "black"}}/>
                                    </div>
                                </div>
                            </div>
                        );
                        break;
                    case 'image':
                        link = result.href.find(href => {
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
                                <img src={result.links[0].href}/>
                            </div>
                        );
                        break;
                    case 'audio':
                        link = result.href.find(href => {
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
                            <div className="thumbnail" onClick={this.onClickPreview.bind(this, data.media_type, result.href[0] || null, data.title)}>
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
                        <div onClick={this.onClickAdd.bind(this, result)} style={{width: "100%", height: "63px", display: "flex", flexDirection: "column", justifyContent: "center", borderRadius: "5px", border: "1px solid #FAFAFA", cursor: "pointer"}}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <i className="fal fa-plus fa-3x" style={{paddingLeft: "15px", paddingRight: "15px"}}></i>
                                <div style={{display: "inline-block", fontSize: "1em", marginLeft: "auto", marginRight: "auto"}}>
                                    Add to NASA Collection
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
        } else if (error) {
            err = (
                <div style={{color: "#E54D42", fontSize: "1.5em"}}>
                    An error has occured. Please try again or search for other keywords.<br/>
                    {error.message}
                </div>
            )
        }

        let modal;
        if (modalType) {
            switch(modalType) {
                case 'add':
                    modal = (
                        <div>
                            <CustomModal isShow={showModal} onClose={this.handleCloseModal.bind(this)} closeButton>
                                <div style={{padding: "1em"}}>
                                    <span style={{fontWeight: "bold", fontSize: "2em"}}>Add to collection</span>
                                </div>
                                <div style={{padding: "1em"}}>
                                    <div className={'float_container ' + (modalData.title.length > 0 ? 'active' : '')}>
                                        <label htmlFor="title">Title</label>
                                        <input name="title" type="text" value={modalData.title} onChange={this.handleChangeInModal}/>
                                    </div>
                                    <div className={'float_container ' + (modalData.description.length > 0 ? 'active' : '')}>
                                        <label htmlFor="description">Description</label>
                                        <textarea name="description" rows={15} wrap="soft" onChange={this.handleChangeInModal} value={modalData.description}></textarea>
                                    </div>
                                    <div className={'float_container ' + (modalData.type.length > 0 ? 'active' : '')}>
                                        <label htmlFor="type">Type</label>
                                        <div className="select">
                                            <select name="type" onChange={this.handleChangeInModal} value={modalData.type}>
                                                <option value="video">Video</option>
                                                <option value="image">Image</option>
                                                <option value="audio">Audio</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className={'float_container ' + (modalData.title.length > 0 ? 'active' : '')}>
                                        <label htmlFor="previewLink">Link preview image url</label>
                                        <input name="previewLink" type="text" value={modalData.previewLink} onChange={this.handleChangeInModal}/>
                                    </div>
                                    <div className={'float_container ' + (modalData.title.length > 0 ? 'active' : '')}>
                                        <label htmlFor="fileLink">Link file url</label>
                                        <input name="fileLink" type="text" value={modalData.fileLink} onChange={this.handleChangeInModal}/>
                                    </div>
                                </div>
                                <div style={{padding: "1em"}}>
                                    <div className="add_button" onClick={this.handleAddItem.bind(this, modalData.fullData)}>
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <i className="fal fa-check fa-3x" style={{paddingLeft: "15px", paddingRight: "15px"}}></i>
                                            <div style={{display: "inline-block", fontSize: "1em", marginLeft: "auto", marginRight: "auto"}}>
                                                Add to collection
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CustomModal>
                        </div>
                    );
                    break;
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
                            <CustomModal isShow={showModal} onClose={this.handleCloseModal.bind(this)} dialogClassName="custom_dialog" style={{backgroundColor: "#333333"}}>
                                <div style={{fontWeight: "bold", fontSize: "3em", color: '#CCCCCC'}}>
                                    {modalData.title}
                                </div>
                                <div>
                                    {content}
                                </div>
                            </CustomModal>
                        </div>
                    );
                    
                    break;
                default:
                    modal = null
                    break;
            }
        }

        return(
            <div className="pageContainer">
                <div style={{display: "flex", alignItems: "center", cursor: "pointer", color: "#784CC0"}} onClick={this.changeUrl.bind(this, '/')}>
                    <i className="fal fa-chevron-left fa-2x" tabIndex="2" style={{paddingRight: "10px"}}/>
                    <span style={{fontSize: "1.5em"}}>Back to collection</span>
                </div>
                <div>
                    <div style={{fontSize: "3em", marginTop: "5%", marginBottom: "5%", color: "#404040"}}>
                        Search from NASA
                    </div>
                    <div>
                        <input type='text' name='searchValue' disabled={fetching?'disabled': ''} value={!isNullOrUndefined(searchValue) ? searchValue : sValue} placeholder="Type something to search..." onChange={this.onInput.bind(this)} onKeyPress={this.onInputKeyPress.bind(this)} style={{width: "100%", boxSizing:"border-box", padding: "1%", fontSize:"2em", borderRadius: "5px", border: "1px solid #D8D8D8"}}/>
                    </div>
                    {
                        error &&
                        err
                    }
                    {
                        !fetching &&
                        <div style={{marginTop: "5%"}}>
                            <div>{resultString}</div>
                            <div className="search_results_container">
                                {items}
                            </div>
                        </div>
                    }
                    {
                        fetching &&
                        <div style={{marginTop: "5%", textAlign: "center"}}>
                            <img src={loadingGif} style={{maxWidth: "320px", maxHeight: "320px", width: "10%", height: "auto"}} />
                        </div>
                    }
                </div>
                {modal}
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            searchStore: state.search
        }
    },
    dispatch => {
        return {
            dispatch
        }
    }
)(SearchPage)