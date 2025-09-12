import mongoose from "mongoose";

const dbConnct =async()=>{
    try {
       await mongoose.connect(process.env.MONGODB_URL) 
       console.log("mongodb connected succesfully")
    } catch (error) {
        console.log("error happened inside dbconnect",error)
    }
}

export default dbConnct