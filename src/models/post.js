import mongoose from "mongoose";


const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        tags: [{
            type: String,
        }],
        views: {
            type: Number,
            default: 0,
        },
        reactions: {
            helpful: { type: Number, default: 0},
            love: { type: Number, default: 0},
            mindblown: { type: Number, default: 0},
        },

        reactedBy: [
            {
                user: { type: mongoose.Types.ObjectId, ref: "User"},
                reaction: String
            }
        ]
    },
    { timestamps: true }
);
postSchema.index({
    title: "text",
    content: "text",
});
//mongodb+srv://sachixl300:#sachi@123#@sachipatel.5hep5xp.mongodb.net/?appName=sachipatel
//694b827258fe064315cc8e07 user id
//694ced2ca8553196fbaa1b67 post id
//user 1 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NTYyOGUwMWViMWMxZTE3YjFjYmE0YiIsImlhdCI6MTc2NzkzOTkwOCwiZXhwIjoxNzY4NTQ0NzA4fQ.l01uEGzaPpx8eSfNG2rxMyrYs_EN6Pf053Xul4qYW4A
//user 2 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NWY0MDcwNjRjODgwNTM3MGQ0Nzk2YSIsImlhdCI6MTc2NzkzOTQwOCwiZXhwIjoxNzY4NTQ0MjA4fQ.gN1eyvJLDxhDWLlarB42TVJxmslbHReOWiO0HRImkBI
export default mongoose.model("post", postSchema);