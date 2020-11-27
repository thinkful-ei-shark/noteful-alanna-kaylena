import React from 'react'
import ApiContext from '../ApiContext'
import config from '..config'
import ValidationError from '../ValidationError'
import { Component } from 'react';

export default class EditFolder extends Component {
    constructor(props){
        super(props);
        this.state = {
            folderName: {
                value: '',
                touched: false,
            },

            hasNameError: false,
        }
    }

    static contextType = ApiContext;

    updateName = folderName => {
        this.setState({
            folderName: {value: folderName, touched: true}
        });
    }

    handleUpdateSubmit = e => {
        e.preventDefault()
        const folderName = this.state.folderName.value;
        if(!folderName) {
            this.setState({hasNameError : true});
            return
        }

        const folderId = this.props.location

        const folder = JSON.stringify({'folder_name': folderName});
        fetch(`${config.API_ENDPOINT}/folders/${folderId}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: folder
        })
        .then(res => {
            if(!res.ok){
                return res.json().then(e => Promise.reject(e))
            }
            return res.json()
        })
        .then(() => {
            this.context.updateFolder(folder, folderId)
            this.props.onEditFolder()
        })
        .catch(error => {
            console.error({error})
        });
    }

    folderValidation = () => {
        const folderName = this.state.folderName.value.trim()

        if(folderName.length === 0){
            return 'You must provide a new name for the folder'
        }
        if(folderName.length < 3){
            return 'Folder name must be at least 3 characters'
        }
    }

    render() {
        const folderNameError = this.folderValidation();
        let errorMessage = '';
        if(this.state.hasNameError){
            errorMessage = 'You must provide a new name for the folder to update'
        }

        return (
            <form className='editFolder' onSubmit = { e => this.handleUpdateSubmit(e)}>
                <h2>Edit Folder</h2>
                <div className='creation_hint'>* required field</div>
                <div className='folderName'>
                    <label htmlFor='name'>Name *</label>
                    <input type='text' className='creation_control' name='name' id='name' onChange = {e => this.updateName(e.target.value)}/>
                    {this.state.folderName.touched && <ValidationError message={folderNameError}/>}
                    <ValidationError message={errorMessage}/>
                </div>
                <div className='submit-button'>
                    <input type='submit' className='submit-button' name='submit' value='Submit Changes' id='submit'/>
                </div>
            </form>
        )
    }
}