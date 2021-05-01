import React, { Component } from 'react'

import classes from './DragDropField.module.css'

class DragDropField extends Component {

    constructor(props){
        super(props)
        this.state = {
            dragging: false,
        }
        this.dropRef = React.createRef()
        this.dragCounter = 0  
    }

    componentDidMount(){
        let div = this.dropRef.current
        div.addEventListener('dragenter', this.handleDragIn)
        div.addEventListener('dragleave', this.handleDragOut)
        div.addEventListener('dragover', this.handleDrag)
        div.addEventListener('drop', this.handleDrop)
        this.dragCounter = 0

    }

    componentWillUnmount(){
        let div = this.dropRef.current
        div.removeEventListener('dragenter', this.handleDragIn)
        div.removeEventListener('dragleave', this.handleDragOut)
        div.removeEventListener('dragover', this.handleDrag)
        div.removeEventListener('drop', this.handleDrop)
    }

    handleDragIn = e => {
        e.preventDefault();
        e.stopPropagation();
        this.dragCounter++  
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
          this.setState({dragging: true})
        }
      };
    
      handleDragOut = e => {
        e.preventDefault();
        e.stopPropagation();
        this.dragCounter--
        if (this.dragCounter > 0) return  
        this.setState({dragging: false})
      };
    
      handleDrag = e => {
        e.preventDefault();
        e.stopPropagation();
      };
    
      handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.setState({
            dragging: false,
          });
          this.props.onChange(e.dataTransfer.files[0])
          e.dataTransfer.clearData()
          this.dragCounter = 0
        }
      };

      onChange = e => {
        this.props.onChange(e.target.files[0])
      }

    render() {
        const {dragging} = this.state
        const {filename} = this.props

        return (
            <div className={dragging ? `${classes.dropbox} ${classes.dropbox_dragging}` : classes.dropbox} 
              ref={this.dropRef}
              style={{ border: this.props.error ? '1px solid var(--color-danger)' : '1px solid rgba(0, 0, 0, 0.1)'}}
            >
                {filename ? <span>{filename}</span> : null}

                <input
                  type="file"
                  name="consent_doc"
                  id={this.props.id}
                  onChange={this.onChange}
                  className={classes.filefield}
                />

                <label htmlFor={this.props.id}>Browse</label>
            </div>
        )
    }
}

export default DragDropField
