import express from "express"
import cors from "cors"
import multer from "multer"
import {v4 as uuidv4} from "uuid"

const app = express()
app.get('/',function(req,res){
    res.json({message: "this"})
})
app.listen(4000,function(){
    console.log("that")
})