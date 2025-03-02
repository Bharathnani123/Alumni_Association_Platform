const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/SIH2")
.then(()=>{
    console.log("MessageA connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const LogInSchema=new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    sender:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    batch:{
        type:String
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    department:{
        type:String
    },
    recipientEmail:{
        type:String
    },
    Groups:{
        type:String
    },
    read: {
        type: Boolean,
        default: false  // Default to unread
    }
})
const MessageA=new mongoose.model('MessageA', LogInSchema);
module.exports=MessageA