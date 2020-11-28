import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import EditFolder from '../EditFolder/EditFolder';
import EditNote from '../EditNote/EditNote';
import HandleError from '../HandleError';

import ApiContext from '../ApiContext';
import config from '../config';

import './App.css';


class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {

        Promise.all([
            fetch(`${config.API_ENDPOINT}/api/notes`),
            fetch(`${config.API_ENDPOINT}/api/folders`)
        ])
            .then(([notesRes, foldersRes]) => {
                if (!notesRes.ok)
                    return notesRes.json().then(e => Promise.reject(e));
                if (!foldersRes.ok)
                    return foldersRes.json().then(e => Promise.reject(e));

                return Promise.all([notesRes.json(), foldersRes.json()]);
            })
            .then(([notes, folders]) => {
                this.setState({notes, folders});
            })
            .catch(error => {
                console.error({error});
            });
    }

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        });
    };

    handleAddFolder = folder => {
        const newFolders = this.state.folders;
        newFolders.push(folder);
        this.setState({
           folders: newFolders
        })
    }

    handleAddNote = note => {
        const newNotes = this.state.notes;
        newNotes.push(note);
        this.setState({
            notes: newNotes
        })
    }

    updateNote = updatedNote => {
        let newNotes = this.state.notes;
        newNotes = newNotes.map(note => {
            if(note.id === updatedNote.id){
                note = updatedNote
            }
            return note
        })

        this.setState({
            notes: newNotes
        })
    }

    updateFolder = updatedFolder => {
        let newFolders = this.state.folders;
        newFolders = newFolders.map(folder => {
            if(folder.id === updatedFolder.id){
                folder = updatedFolder
            }
            return folder
        })

        this.setState({
            folders: newFolders
        })
    }

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageNav} />
                <Route path="/edit-folder/:folderId" render={({history}) => 
                    <EditFolder
                        onEditFolder = {() => history.goBack()}
                    />}
                />
                <Route path="/add-folder" render={({history}) => 
                    <AddFolder
                        onAddFolder = {() => history.goBack()}
                    />} 
                />
                <Route path="/edit-note/:noteId" render={({history}) => 
                    <EditNote
                        onEditNote = {() =>  history.goBack()}
                    />}
                />
                <Route path="/add-note" render={({history}) =>
                    <AddNote
                        onAddNote = {() => history.goBack()}
                    />} 
                />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageMain} />
            </>
        );
    }

    render() {
        const value = {
            notes: this.state.notes,
            folders: this.state.folders,
            deleteNote: this.handleDeleteNote,
            addFolder: this.handleAddFolder,
            addNote: this.handleAddNote,
            updateNote: this.updateNote,
            updateFolder: this.updateFolder,
        };
        return (
            <ApiContext.Provider value={value}>
                <div className="App">
                    <HandleError>
                        <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    </HandleError>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{' '}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <HandleError>
                        <main className="App__main">{this.renderMainRoutes()}</main>
                    </HandleError>
                </div>
            </ApiContext.Provider>
        );
    }
}

export default App;
