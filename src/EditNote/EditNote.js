import React, { Component } from "react";
import ApiContext from "../ApiContext";
import config from "../config";
import ValidationError from "../ValidationError/ValidationError";

export default class EditNote extends Component {
  state = {
    noteTitle: {
      value: "",
      touched: false,
    },
    content: {
      value: "",
      touched: false,
    },
    hasTitleError: false,
    hasContentError: false,
  };

  static contextType = ApiContext;

  updateNoteTitle = (noteTitle) => {
    this.setState({ noteTitle: { value: noteTitle, touched: true } });
  };

  updateContent = (content) => {
    this.setState({ content: { value: content, touched: true } });
  };

  handleUpdateSubmit = (e) => {
    e.preventDefault();
    const noteTitle = this.state.noteTitle.value;
    const content = this.state.content.value;

    const note = JSON.stringify({ 'note_name' : noteTitle, 'content': content });

    if (!noteTitle) {
      this.setState({ hasTitleError: true });
      return;
    }

    if (!content) {
      this.setState({ hasContentError: true });
      return;
    }

    const noteId = this.props.location;
    fetch(`${config.API_ENDPOINT}/api/notes/${noteId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: note,
    })
      .then((res) => {
        if (!res.ok) {
          return res.jsons().then((e) => Promise.reject(e));
        }
        return res.json();
      })
      .then(() => {
        this.context.updateNote(note);
        this.props.onEditNote();
      })
      .catch((error) => {
        console.error({ error });
      });
  };

  titleValidation = () => {
    const noteTitle = this.state.noteTitle.value.trim() || "";

    if (noteTitle) {
      if (noteTitle.length < 3) {
        return "Title must be at least 3 characters";
      }
    }
  };

  contentValidation = () => {
    const content = this.state.content.value.trim();

    if (content) {
      if (content.length > 1000) {
        return "Note must be under 1000 characters";
      }
    }
  };

  render() {
    const titleError = this.titleValidation();

    const contentError = this.contentValidation();

    let errorMessage = "";

    if (this.state.hasTitleError && this.state.hasContentError) {
      errorMessage =
        "There are no changes to current note. Please change either content or title.";
    }

    return (
      <form className="editNote" onSubmit={(e) => this.handleUpdateSubmit(e)}>
        <h2>Edit Note</h2>
        <div className="noteTitle">
          <label htmlFor="name">Name </label>
          <input
            type="text"
            className="creation_control"
            name="name"
            id="name"
            onChange={(e) => this.updateNoteTitle(e.target.value)}
          />
          {this.state.noteTitle.touched && (
            <ValidationError message={titleError} />
          )}
        </div>
        <div className="noteContent">
          <label htmlFor="content"> Update note content here</label>
          <input
            type="text area"
            className="creation_control"
            name="content"
            id="content"
            onChange={(e) => this.updateContent(e.target.value)}
          />
          {this.state.content.touched && (
            <ValidationError message={contentError} />
          )}
        </div>
        <div>
          <ValidationError message={errorMessage} />
        </div>
        <div className="submit-form">
          <input type="submit" id="js-update-note" value="Update Note" />
        </div>
      </form>
    );
  }
}
