const Note = require("../models/noteModels")
const express = require("express")
const { verifyToken } = require("../middleware/verifyToken")
const router = express.Router()

router.post("/create-note", verifyToken, async (req, res) => {
    try{
        const { note_title, note_text, note_privacy, tags } = req.body

        const note = await Note.create({
            note_title,
            note_text,
            note_privacy,
            tags,
            user: req.user.id
        })

        res.status(201).json(note)
        
    }
    catch(error){
        console.error("Error creating note:", error.message);
        res.status(500).json({ message: "Server error" });
    }
})

//view all notes
router.get("/all-notes", verifyToken, async (req, res) => {
    try{
        const notes = await Note.find({ user: req.user.id })
        res.status(200).json(notes)
    }
    catch (error){  
        console.error("Error fetching notes", error.message)
        res.status(500).json({ message: "Server error"})
    }
})

//view notes by title, partial, case insensitive
router.get("/note/:note_title", verifyToken, async (req, res) => {
    try {
        //decode URI in case of spaces/special characters
        const noteTitleQuery = decodeURIComponent(req.params.note_title);

        //use regex for partial, case-insensitive match
        const noteByTitle = await Note.findOne({
            user: req.user.id,
            note_title: { $regex: noteTitleQuery, $options: "i" }
        });

        if (!noteByTitle) {
            return res.status(404).json({ message: "Note with title not found" });
        }

        res.status(200).json(noteByTitle);
    } catch (error) {
        console.error("Error fetching note by title:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/update-note/:id", verifyToken, async (req, res) => {
    try{
        const {note_title, note_text, note_privacy, tags} = req.body

        const noteUpdated = await Note.findOneAndUpdate(
            {_id: req.params.id, user: req.user.id }, //must check the id if matched to user
            {
                note_title,
                note_text,
                note_privacy,
                tags
            },
            { new: true} //returning new version
        )

        if (!noteUpdated){
            return res.status(404).json({ message: "Note not found"})
        }

        res.status(200).json(noteUpdated)
    }
    catch(error){
        console.error("Error creating note:", error.message);
        res.status(500).json({ message: "Server error" });
    }
})

router.delete("/delete-note/:id", verifyToken, async (req, res) => {
    try{
        //const noteDeleted = await Note.findByIdAndDelete(
        const noteDeleted = await Note.findOneAndDelete(
            {_id: req.params.id, user: req.user.id}
        )
        if (!noteDeleted){
            return res.status(404).json({ message: "Note not found or could not be deleted"})
        }
        res.status(200).json({message: "Note deleted successfully"})
    }
    catch (error){
        console.error("Error deleting note:", error.message);
        res.status(500).json({ message: "Server error" });
    }
})


module.exports = router