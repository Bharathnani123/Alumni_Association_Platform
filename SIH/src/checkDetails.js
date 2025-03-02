const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/SIH2")
.then(()=>{
    console.log("Details connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    rollNumber: String,
    batchYear: Number,
    department: String,
    dob: Date,
    phoneNumber: String,
    document: String, // Store the document file path or URL
    image: String, // Store the image URL
    type: { type: String, enum: ['current student', 'Alumni'], default: 'current student' },
    approved: { type: Boolean, default: false },
    approvalKey: String // Unique key for email approval
});


module.exports = new mongoose.model('User', userSchema);
