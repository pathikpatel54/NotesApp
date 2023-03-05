import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    notes: [],
    status: "idle",
    error: "",
};

export const fetchNotes = createAsyncThunk("notes/fetchNotes", async () => {
    const response = await axios.get("/api/notes");
    return response.data;
});

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {},
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
            });
    },
});

export const selectAllNotes = (state) => state.notes.notes;
export const getNotesStatus = (state) => state.notes.status;
export const getNotesError = (state) => state.notes.error;

export default notesSlice.reducer;
