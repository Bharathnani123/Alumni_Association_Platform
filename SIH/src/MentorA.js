const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/SIH2")
.then(()=>{
    console.log("Alumni Mentor connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const MentorSchema = new mongoose.Schema({
    name: String,
    email: String,
    department: String,
    profileImage: String,
    areasOfGuidance: [String],
    available: { type: Boolean, default: true }
});

const Mentor = new mongoose.model('Mentor', MentorSchema);
module.exports = Mentor;