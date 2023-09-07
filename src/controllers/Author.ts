import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { get } from 'lodash';
import Author from '../models/Author'; // Import the Author model

// Create a new Author
const createAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;

        // Create a new Author document with a generated ObjectId
        const author = new Author({
            _id: new mongoose.Types.ObjectId(),
            name
        });

        // Save the new Author document to the database
        const newAuthor = await author.save();

        res.status(200).json({ newAuthor });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Read one or all Authors
const readAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorId = get(req, 'params.authorId');
        const author = authorId ? await Author.findById(authorId) : await Author.find();

        // Check if an Author(s) was found and respond accordingly
        author ? res.status(200).json({ author }) : res.status(404).json({ message: `Not found author with id: ${authorId}` });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Update an existing Author
const updateAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorId = get(req, 'params.authorId');

        // Find the Author by ID
        const author = await Author.findById(authorId);

        if (author) {
            // Update Author attributes based on the request body
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

// Delete an Author by ID
const deleteAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorId = get(req, 'params.authorId');

        // Find and delete the Author by ID
        const deletedAuthor = await Author.findByIdAndDelete(authorId);

        // Check if the Author was deleted and respond accordingly
        deletedAuthor ? res.status(200).json({ deletedAuthor }) : res.status(404).json({ message: `Not found author with id: ${authorId}` });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export default { createAuthor, readAuthor, updateAuthor, deleteAuthor };
