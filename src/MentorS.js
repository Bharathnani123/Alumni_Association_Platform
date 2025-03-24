const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/SIH2")
.then(()=>{
    console.log("student Mentor connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const MentorshipRequestSchema = new mongoose.Schema({
    studentId: mongoose.Schema.Types.ObjectId,
    mentorId: mongoose.Schema.Types.ObjectId,
    message: String,
    status: { type: String, default: 'Pending' },
    meetingLink: String,
    feedback: String,
});

const MentorshipRequest = new mongoose.model('MentorshipRequest', MentorshipRequestSchema);
module.exports = MentorshipRequest;