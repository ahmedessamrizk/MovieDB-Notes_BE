import { asyncHandler } from './../../../middleware/asyncHandler.js';
import { noteModel } from './../../../../DB/models/note.model.js';
import { create, findById, find, deleteOne, findOne, updateOne } from '../../../../DB/DBmethods.js'

export const addNote = asyncHandler(
    async (req, res, next) => {
        req.body.userID = req.user._id;
        const newNote = await create({ model: noteModel, data: req.body });
        return res.status(201).json({ message: "Done", newNote });
    }
)

export const getUserNotes = asyncHandler(
    async (req, res, next) => {
        const Notes = await find({ model: noteModel, filter: { userID: req.user._id } });
        return res.status(200).json({ message: "Done", Notes });
    }
)

export const deleteNote = asyncHandler(
    async (req, res, next) => {
        const { NoteID } = req.body;
        const delNote = await deleteOne({ model: noteModel, filter: { _id: NoteID, userID: req.user._id } });
        return delNote.deletedCount ? res.status(200).json({ message: "Done" }) : next(Error('Invalid NoteID or not authorized', { cause: 400 }));
    }
)

export const updateNote = asyncHandler(
    async (req, res, next) => {
        const { NoteID } = req.body;
        const updateNote = await updateOne({ model: noteModel, filter: { _id: NoteID, userID: req.user._id }, data: req.body });
        return updateNote.modifiedCount ? res.status(200).json({ message: "Done" }) : next(Error('Invalid NoteID or not authorized', { cause: 400 }));
    }
)