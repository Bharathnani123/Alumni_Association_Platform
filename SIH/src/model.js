const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/SIH2")
.then(()=>{
    console.log("mongodb connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const LogInSchema=new mongoose.Schema({
    RollNo:{
        type:Number,
        required:false
    },
    FullName:{
        type:String,
        required:true,
    },
    DateOfBirth:{
        type:String,
        required:true
    },
    status:{
        type:Boolean
    },
    type:{
        type:String
    },
    img:{
        type:String
    },
    batch:{
        type:String
    },
    department:{
        type:String
    },
    Groups:{
        type:Array,
        required:false,
        default:[]
    },
    email:{
        type:String
    },
    Phno:{
        type:Number
    }
})
const collection=new mongoose.model("collection1",LogInSchema)
module.exports=collection