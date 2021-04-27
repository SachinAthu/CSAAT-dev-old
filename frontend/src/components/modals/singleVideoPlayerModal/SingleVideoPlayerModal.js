import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './SingleVideoPlayerModal.module.css'
import ModalFrame from '../modalFrame/ModalFrame'
import VideoJSPlayer from '../../videoJSPlayer/VideoJSPlayer'

class SingleVideoPlayerModal extends Component {
    static propTypes = {

    }

    render() {
        return (
            <ModalFrame player={true} close={this.props.close}>
                <div className={classes.container}>
                    <VideoJSPlayer video={this.props.video}/>
                </div>
            </ModalFrame>
        )
    }
}

export default SingleVideoPlayerModal
