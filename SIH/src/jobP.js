const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/SIH2")
.then(()=>{
    console.log("jb connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const LogInSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    eligibility:{
        type:String,
        required:true,
    },
    package:{
        type:String,
        required:true
    },
    jobType:{
        type:String,
        required:true
    },
    lastDate:{
        type:Date,
        required:true
    },
    registrationLink:{
        type:String,
        required:true
    },
    postedBy:{
        type:String,
        required:true
    }
})
const JobPost=new mongoose.model("JobPost1",LogInSchema)
module.exports=JobPost