const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/SIH2")
.then(()=>{
    console.log("group connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        trim: true
    },
    groupPurpose: {
        type: String,
        required: true,
        trim: true
    },
    targetAudience: {
        type: String,
        enum: ['alumni', 'students', 'staff', 'mixed'],  // Limiting to valid values
        required: true
    },
    createdBy: {
        type: String,
        required: true,  // Reference to the creator (alumni) by name or ID
    },
    email: {
        type: String,
        required: true,  // Email of the creator for contact purposes
    },
    groupImage: {
        type: String,  // Image URL or file path for the group
        

    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});
const  group=new mongoose.model("group",groupSchema)
module.exports=group
