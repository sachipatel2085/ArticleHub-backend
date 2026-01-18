import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("MONGO_URI from env:", process.env.MONGO_URI)
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database is connected");
    } catch (error) {
        console.log(error)
        console.error("Mongodb connection failed:",error.massage);
        
    }
}

export default connectDB;