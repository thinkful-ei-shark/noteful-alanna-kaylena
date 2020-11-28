import React from 'react'
import ApiContext from '../ApiContext'
import config from '../config'
import Dropdown from '../Dropdown/Dropdown';
import ValidationError from '../ValidationError/ValidationError'
import { Component } from 'react';

export default class AddNote extends Component {
    state = {
        noteTitle: {
            value: '',
            touched: false
        },
        content: {
            value: '',
            touched: false
        },
        folderId: {
            value: '',
            
        }, 
        hasTitleError: false,
        hasContentError: false,
        hasFolderError: false
    }

    static contextType = ApiContext;

    updateNoteTitle = (noteTitle) => {
        this.setState({ noteTitle: {value: noteTitle, touched: true}
    });
}
    updateContent = (content) => {
        this.setState({ content: {value: content, touched: true}});
    }
    updateFolderId = (folderId) => {
        this.setState({folderId: {value: folderId}})
    
    }

    handleAddSubmit = e => {
        e.preventDefault()
        const noteTitle = this.state.noteTitle.value;
        const content = this.state.content.value;
        const folderId = this.state.folderId.value;
       
        const note = JSON.stringify({'note_name': noteTitle,'content': content, 'folder_id': folderId});

        if(!noteTitle){
            this.setState({hasTitleError: true});
            return;
        }

        if(!folderId){
            this.setState({hasFolderError: true});
            return;
        }

        if(!content){
            this.setState({hasContentError: true});
            return;
        }
        
        fetch(`${config.API_ENDPOINT}/api/notes`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: note
        })
        .then(res => {
            if(!res.ok){
                return res.json().then(e => Promise.reject(e))
            }
            return res.json()})
        .then(data => {
            this.context.addNote(data)
            this.props.onAddNote()
        })
        .catch(error => {
            console.error({error})
        });
    }

    titleValidation = () => {
        const noteTitle = this.state.noteTitle.value.trim()

        if(noteTitle.length === 0) {
            return 'Please enter a title'
        }

        if(noteTitle.length < 3) {
            return 'Title must be at least 3 characters'
        }
    }

    contentValidation = () => {
        const content = this.state.content.value.trim()

        if(content.length === 0) {
            return 'Please add content to your note'
        }

        if(content.length > 1000) {
            return 'Note must be under 1000 characters'
        }
    }

    folderIdValidation = () => {
        const folderId = this.state.folderId.value;

        if(folderId.value === 'default'){
            return 'Please choose a folder for your note'
        }

    }

    render() {
        const titleError = this.titleValidation();

        const contentError = this.contentValidation();

        const folderIdError = this.folderIdValidation();

        let errorMessage = '';

        if(this.state.hasTitleError){
            errorMessage = 'Note must have a title';
        }

        if(this.state.hasFolderError){
            errorMessage = 'Note must be assigned to a folder';
        }

        if(this.state.hasContentError){
            errorMessage = 'Note must have something in the content';
        }

        return(
            <form className='addNote' onSubmit = {e => this.handleAddSubmit(e)}>
                    <h2>Add Note</h2>
                    <div className='creation__hint'>* required field</div>
                    <div className='noteTitle'>
                        <label htmlFor='name'> Name *</label>
                        <input type='text' className='creation__control' name='name' id='name' onChange = {e => this.updateNoteTitle(e.target.value)}/>
                        {this.state.noteTitle.touched && <ValidationError message = {titleError}/>}
                    </div>
                    <div className='noteContent'>
                        <label htmlFor='content'> Enter your note here</label>
                        <input type='text area' className='creation__control' name='content' id='content' onChange = {e => this.updateContent(e.target.value)}/>
                        {this.state.content.touched && <ValidationError message = {contentError}/>}
                    </div>
                    <div className='folderId'>
                        <Dropdown updateFolderId = {this.updateFolderId} />
                        <ValidationError message={folderIdError}/>
                    </div>
                    <div>
                        <ValidationError message= {errorMessage}/>
                    </div>
                    <div className="submit-form">
                        <input type='submit' id='js-submit-note' value='Add Note'/>
                    </div>
                </form>
        )
    }
}



