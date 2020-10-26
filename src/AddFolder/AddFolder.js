import React from 'react'
import ApiContext from '../ApiContext'
import config from '../config'
import ValidationError from '../ValidationError/ValidationError';

const { Component } = require("react");


export default class AddFolder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            folderName: {
                value: '',
                touched: false
            },
        }
    }

    static contextType = ApiContext;

    updateName = (folderName) => {
        this.setState({
            folderName: {value: folderName, touched: true}
        });
    }

    handleAddSubmit = e => {
        e.preventDefault()
        const folderName = this.state.folderName.value;
        if(!folderName) {
            return 'Folder must be assigned a name';
        }
        
        const folder = JSON.stringify({'name': folderName});
        fetch(`${config.API_ENDPOINT}/folders`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: folder
        })
        .then(res => {
            if(!res.ok){
                return res.json().then(e => Promise.reject(e))
            }
            return res.json()})
        .then(data => {
            this.context.addFolder(data)
        })
        .catch(error => {
            console.error({error})
        });

    }

    folderValidation = () => {
        const folderName = this.state.folderName.value.trim()
        
        if(folderName.length === 0) {
            return 'Please enter in a folder name'
        }
        if(folderName.length < 3) {
            return 'Folder name must be at least 3 characters'
        }
    }

    render() {
        const folderNameError = this.folderValidation();

        return(
            //<ApiContext.Consumer>
                
                <form className='addFolder' onSubmit = {e => 
                    {
                        console.log('form submitted');
                        this.handleAddSubmit(e)}}>
                    <h2>Add Folder</h2>
                    <div className='creation__hint'>* required field</div>
                    <div className='folderName'>
                        <label htmlFor='name'>Name *</label>
                        <input type='text' className='creation__control' name='name' id='name' onChange = {e => this.updateName(e.target.value)}/>
                        {this.state.folderName.touched && <ValidationError message={folderNameError}/>}
                    </div>
                    <div className='submit-button'>
                        <input type='submit' className='submit-button' name='submit' value= 'Add Folder' id='submit'/>
                    </div>
                </form>
            //</ApiContext.Consumer>
        )
    }
}
