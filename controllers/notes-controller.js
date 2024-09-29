require('dotenv').config();
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const Notes = require("../models/notesSchema")
const axios = require("axios")

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME|| "all-subject-files",
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    }),
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed'), false);
        }
        cb(null, true);
    }
}).single('file');

const uploadNotes = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).json({ message: 'File upload failed', error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file provided' });
        }
        res.status(200).json({
            message: 'File uploaded successfully',
            fileUrl: req.file.location
        });
    });
};

const uploadNotesFromAi = async(req,res)=>{
    const {class: className,subject,chapter}=req.body;
    try{
        const notes = await Notes.findOne({class:className,subject});
        if(!notes){
            return res.status(404).json({message:"No notes found for this class and subject"});
        }
        const requestPayload = {
            class:className,
            subject,
            chapter,
            notes:notes.notes
        };
        const response = await axios.post('https://notes-ai-eaethjg8cxg3ebgs.eastus-01.azurewebsites.net/getNotes/', requestPayload);
        res.status(200).json(response.data);
        }
        catch(err){
            console.error('Error uploading notes:', err);
            res.status(500).json({message:'Internal server error',error:err});
        }
};

const displayNotes = async(req,res)=>{
    const {class: className,subject,chapter}=req.body;
    try{
        const notes = await Notes.findOne({class:className,subject});
        if(!notes){
            return res.status(404).json({message:"No notes found for this class and subject"});
        }
        res.status(200).json(notes);
    }
    catch(err){
        console.error('Error displaying notes:', err);
        res.status(500).json({message:'Internal server error',error:err});
    }
}

module.exports = {
    uploadNotes,
    uploadNotesFromAi,
    displayNotes
};
