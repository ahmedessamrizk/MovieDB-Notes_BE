import { asyncHandler } from '../../../middleware/asyncHandler.js'
import { findById, findByIdAndUpdate } from './../../../../DB/DBmethods.js';
import { userModel } from './../../../../DB/models/user.model.js';

export const getProfile = asyncHandler(
    async (req, res, next) => {
        const { _id } = req.user;
        const user = await findById({ model: userModel, filter: { _id: _id }, select: "first_name last_name email age" });
        return res.status(200).json({ message: "Done", user });
    })

export const addMovie = asyncHandler(
    async (req, res, next) => {
        const { movieId } = req.body;
        const user = await findByIdAndUpdate({ model: userModel, filter: { _id: req.user._id }, data: { $addToSet: { movies: movieId } }, options: { new: true }, select: 'movies tvShows' });
        return res.status(200).json({ message: "Done", user });
    })

export const removeMovie = asyncHandler(
    async (req, res, next) => {
        const { movieId } = req.body;
        const user = await findByIdAndUpdate({ model: userModel, filter: { _id: req.user._id }, data: { $pull: { movies: movieId } }, options: { new: true }, select: 'movies tvShows' });
        return res.status(200).json({ message: "Done", user });
    })

export const addTvShow = asyncHandler(
    async (req, res, next) => {
        const { tvShowId } = req.body;
        const user = await findByIdAndUpdate({ model: userModel, filter: { _id: req.user._id }, data: { $addToSet: { tvShows: tvShowId } }, options: { new: true }, select: 'tvShows movies' });
        return res.status(200).json({ message: "Done", user });
    })

export const removeTvShow = asyncHandler(
    async (req, res, next) => {
        const { tvShowId } = req.body;
        const user = await findByIdAndUpdate({ model: userModel, filter: { _id: req.user._id }, data: { $pull: { tvShows: tvShowId } }, options: { new: true }, select: 'tvShows movies' });
        return res.status(200).json({ message: "Done", user });
    })

