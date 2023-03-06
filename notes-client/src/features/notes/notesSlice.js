import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    notes: [],
    status: "idle",
    error: "",
    encrypted: true,
    synced: true,
    key: "",
};

export const fetchNotes = createAsyncThunk("notes/fetchNotes", async () => {
    const response = await axios.get("/api/notes");
    return response.data;
});

export const addNote = createAsyncThunk("notes/addNote", async (request) => {
    const response = await axios.post("/api/note", request);
    return response.data;
});

const updateNote = (state, action) => {
    const { selected, content } = action.payload;
    if (state.notes[selected] != null) {
        state.notes[selected] = content;
    }
};

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        updateNote,
    },
    extraReducers(builder) {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.status = "pending";
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.notes = action.payload;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(addNote.pending, (state) => {
                state.status = "pending"
            })
            .addCase(addNote.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.notes.push(action.payload)
            })
            .addCase(addNote.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
    },
});

export const selectAllNotes = (state) => state.notes.notes;
export const getNotesStatus = (state) => state.notes.status;
export const getNotesError = (state) => state.notes.error;
export const syncNote = notesSlice.actions.updateNote;

export default notesSlice.reducer;
