import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: undefined,
};

export const notes = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNotesFromApi: (state, action) => {
      state.list = action.payload;
    },
    addNoteFromUser: (state, action) => {
      state.list.push(action.payload);
    },
    editNote: (state, action) => {
      const noteToEditIndex = state.list.findIndex(
        (note) => note.id === action.payload.id
      );

      state.list[noteToEditIndex] = action.payload;
    },
    deleteNote: (state, action) => {
      state.list = state.list.filter((note) => note.id !== action.payload);
    },
  },
});

export function getNotesFromAPI() {
  return function (dispatch, getState) {
    fetch("http://127.0.0.1:8000/notes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        dispatch(addNotesFromApi(data));
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
}

export function createNote(note) {
  return async function (dispatch) {
    try {
      const response = await fetch("http://127.0.0.1:8000/note/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      });
      console.log(note);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newNote = await response.json();
      dispatch(addNoteFromUser(newNote));
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
}

export function updateNote(note) {
  return async function (dispatch) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/note/${note.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const updatedNote = await response.json();
      dispatch(editNote(updatedNote));
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
}

export function deleteNoteById(noteId) {
  return async function (dispatch) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/note/${noteId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const deletedNote = await response.json();
      dispatch(deleteNote(deletedNote.id));
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
}

export const { addNotesFromApi, addNoteFromUser, editNote, deleteNote } =
  notes.actions;
export default notes.reducer;
