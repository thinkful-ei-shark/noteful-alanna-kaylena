import React, { Component } from 'react'
import ApiContext from '../ApiContext'


export default class Dropdown extends React.Component{
    static contextType = ApiContext;

    render(){
        const {folders} = this.context;
        console.log(folders)
        return (
            <div>
                <label htmlFor='folders'>Choose a Folder</label>
                <select id='folder' name='folders'>
                    {folders.map( folder=> {
                        return (
                            <option key = {folder.id} value={folder.id}>{folder.name}</option>
                        )
                    })
                }
    
                </select>
            </div>
        )
    }
    

}