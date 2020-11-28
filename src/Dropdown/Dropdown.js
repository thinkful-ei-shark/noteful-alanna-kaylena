import React, { Component } from 'react'
import ApiContext from '../ApiContext'
import PropTypes from 'prop-types'


export default class Dropdown extends Component{
    static contextType = ApiContext;

    render(){
        const {folders} = this.context;
        console.log(folders)
        return (
            <div>
                <label htmlFor='folders'>Choose a Folder</label>
                <select id='folder' name='folders' onChange = {e=>this.props.updateFolderId(e.target.value)}>
                    <option key= {0} value='default'>Choose Folder</option>
                    {folders.map( folder => {
                        return (
                            <option key = {folder.id} value={folder.id}>{folder.folder_name}</option>
                        )
                    })
                }
    
                </select>
            </div>
        )
    }
    

}

Dropdown.propTypes = {
    updateFolderId : PropTypes.func.isRequired,
}
