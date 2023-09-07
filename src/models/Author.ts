// Import required modules and dependencies
import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Author data structure
export interface IAuthor {
    name: string;
}

// Define an interface that extends the Author interface and includes Mongoose's Document
export interface IAuthorModel extends IAuthor, Document {}

// Create a Mongoose schema for the Author model
const AuthorSchema: Schema = new Schema(
    {
        name: { type: String, required: true }
    },
    {
        versionKey: false // Disable the version key (_v) in the database
    }
);

// Create and export the Mongoose model for the Author schema
export default mongoose.model<IAuthorModel>('Author', AuthorSchema);
