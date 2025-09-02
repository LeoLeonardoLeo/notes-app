const Note = require("../models/noteModels")
const express = require("express")
const { verifyToken } = require("../middleware/verifyToken")
const router = express.Router()

const crypto = require("crypto")

router.post("/share-note/:id", verifyToken, async (req, res) => {
    try{   
        const {id} = req.params
        const {expiresIn} = req.body //example 1h, front end would have a drop down with options
        
        const note = await Note.findOne({
            _id: id,
            user: req.user.id
        })
        if (!note){
            return res.status(404).json({ message: "Note not found"})
        }

        if(note.note_privacy !== "public"){
            return res.status(400).json({ message: "Note must be public to share" });
        }

        const token = crypto.randomBytes(16).toString("hex") //makes random string of letters to be the unique token
        const expiryDate = new Date(Date.now() + (expiresIn || 60) * 60 * 1000); //default 1h

        note.shareToken = token //set token to the share token 
        note.expiresAt = expiryDate
        await note.save()

        //share link
        const shareUrl = `${req.protocol}://${req.get("host")}/api/share/shared-note/${token}`
        
        res.status(200).json({ shareUrl, expiresAt: expiryDate });
    }
    catch(error){
        console.error("Error generating share link:", error.message);
        res.status(500).json({ message: "Server error" });
    }
})

router.get("/shared-note/:token", async (req, res) => {
    try{
        const {token} = req.params
        const note = await Note.findOne({
            shareToken: token //set the token to shareToken taken from db
        })

        if (!note){
            return res.status(404).json({ message: "Invalid or expired link" });
        }

        if(!note.expiresAt || note.expiresAt < new Date()){
            return res.status(410).json({ message: "Link has expired" }); // 410 - gone (resource no longer available)
        }

        res.status(200).json({
            note_title: note.note_title,
            note_text: note.note_text,
            tags: note.tags
        })

    }
    catch (error){
        console.error("Error fetching shared note:", error.message);
        res.status(500).json({ message: "Server error" });
    }
})

module.exports = router