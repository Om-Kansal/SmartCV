import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRouts.js";
import aiRouter from "./routes/aiRoutes.js";


const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
// await connectDB()
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use(express.json())
app.use(cors())

app.get('/', (req, res)=>res.send("Server is live..."))
app.use('/api/users', userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)

export default app;

// app.listen(PORT, ()=>{
//         console.log(`Server is running on ${PORT}`);
        
// });

if(process.env.PRODUCTION !== "true"){
    app.listen(PORT, ()=>{
        console.log(`Server is running on ${PORT}`);
        
    });
}
