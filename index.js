const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config()
const cors = require("cors")

//routes
const authRoutes = require("./routes/authRoutes")
const notesRoutes = require("./routes/notesRoutes")
const shareRoutes = require("./routes/shareRoute")

//variables for app
const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));


//calling routes
app.use("/api/auth", authRoutes)
app.use("/api/notes", notesRoutes)
app.use("/api/share", shareRoutes)


mongoose.connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("mongodb connected"))
.catch((err) => console.log("mongodb connection error: ", err))


app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`)
})