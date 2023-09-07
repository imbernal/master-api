import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { get } from 'lodash';
import Author from '../models/Author';
import Logger from '../library/Logging';

const createAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;

        const author = new Author({
            _id: new mongoose.Types.ObjectId(),
            name
        });

        const newAuthor = await author.save();

        res.status(200).json({ newAuthor });
    } catch (error) {
        res.status(500).json({ error });
    }
};
const readAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorId = get(req, 'params.authorId');
        const author = authorId ? await Author.findById(authorId) : await Author.find();
        author ? res.status(200).json({ author }) : res.status(404).json({ message: `Not found author with id: ${authorId}` });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const updateAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorId = get(req, 'params.authorId');

        const author = await Author.findById(authorId);

        if (author) {
            author.set(req.body);
            const updatedAuthor = await author.save();
            res.status(200).json({ updatedAuthor });
        } else {
            res.status(404).json({ message: `Not found author with id: ${authorId}` });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};
const deleteAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorId = get(req, 'params.authorId');

        const deletedAuthor = await Author.findByIdAndDelete(authorId);

        deletedAuthor ? res.status(200).json({ deletedAuthor }) : res.status(404).json({ message: `Not found author with id: ${authorId}` });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export default { createAuthor, readAuthor, updateAuthor, deleteAuthor };
