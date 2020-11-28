
export const findFolder = (folders=[], folderId) =>
  folders.find(folder => folder.id === folderId)

export const findNote = (notes=[], noteId) =>
  notes.find(note => note.id === noteId)

export const getNotesForFolder = (notes=[], folderId) => {
  console.log('getNotesForFolder ran: ', notes)
  if(!folderId){
    return notes
  }
  console.log(notes[0])
  notes = notes.filter(note => note.folder_id === folderId)
  return notes
}

export const countNotesForFolder = (notes=[], folderId) =>
  notes.filter(note => note.folder_id === folderId).length
