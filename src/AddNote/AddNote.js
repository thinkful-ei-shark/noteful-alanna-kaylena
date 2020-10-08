import { render } from 'enzyme';
import React from 'react'
import ApiContext from '../ApiContext'
import config from '../config'
import Dropdown from '../Dropdown/Dropdown';
import ValidationError from '../ValidationError'

const { Component } = require('react');

export default class AddNote extends Component {
    state = {
        noteTitle: {
            value: '',
            touched: false
        },
        content: {
            value: '',
            touched: false
        }
    }

    static contextType = ApiContext;

    updateNote = (note) => {
        this.setState({ note: {value: note, touched: true}
    });
}
    updateContent = (content) => {
        this.setState({ content: {value: content, touched: true}});
    }

    handleAddSubmit = e => {
        e.preventDefault()
        const noteTitle = this.state.noteTitle.value;
        const content = this.state.content.value;
       
        const note = JSON.stringify({'name': noteTitle}, {'content': content});
        console.log(noteTitle);
        fetch(`${config.API_ENDPOINT}/notes`, {
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

    render() {
        const titleError = this.titleValidation();

        const contentError = this.contentValidation();

        return(
            <form className='addNote'
            onSubmit = {e =>
            {
                console.log('form submitted');
                this.handleAddSubmit(e)}}>
                    <h2>Add Note</h2>
                    <div className='creation__hint'>* required field</div>
                    <div className='noteTitle'>
                        <label htmlFor='name'> Name *</label>
                        <input type='text' className='creation__control' name='name' id='name' onChange = {e => this.updateNote(e.target.value)}/>
                        {this.state.noteTitle.touched && <ValidationError message = {titleError}/>}
                    </div>
                    <div className='noteContent'>
                        <label htmlFor='content'> Enter your note here</label>
                        <input type='text area' className='creation__control' name='content' id='content' onChange = {e => this.updateContent(e.target.value)}/>
                        {this.state.content.touched && <ValidationError message = {contentError}/>}
                    </div>
                    <div className='folderId'>
                        <Dropdown />
                    </div>
                </form>
        )
    }
}



