import React from 'react'
import ApiContext from '../ApiContext'
import config from '../config'

const { Component } = require("react");


export default class AddFolder extends Component {
    static contextType = ApiContext;

    handleAddSubmit = e => {
        e.preventDefault()
        const noteId = this.props.id 

        fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: {}
        })

    }

    render() {
        return(
            //<ApiContext.Consumer>
                <form className='addFolder'>
                    <h2>Add Folder</h2>
                    <div className='creation__hint'>* required field</div>
                    <div className='folderName'>
                        <label htmlFor='name'>Name *</label>
                        <input type='text' className='creation__control' name='name' id='name'/>
                    </div>
                    <div className='submit-button'>
                        <input type='button' className='submit-button' name='submit' value= 'Add Folder' id='submit'/>
                    </div>
                </form>
            //</ApiContext.Consumer>
        )
    }
}
