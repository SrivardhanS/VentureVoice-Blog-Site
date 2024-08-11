import express from "express"
import cors from 'cors'  // cors 
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors())  // Added this line
app.use(cookieParser()) 
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

app.listen(8800, () => {
    console.log("Connected!")
})