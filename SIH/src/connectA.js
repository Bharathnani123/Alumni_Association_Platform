const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/SIH2")
.then(()=>{
    console.log("chat connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const ChatSchema = new mongoose.Schema({
    studentId: String,
    alumniId: String,
    messages: [
        {
            sender: String, // 'student' or 'alumni'
            text: String,
            timestamp: { type: Date, default: Date.now }
        }
    ]
});

const Chat = mongoose.model('Chat', ChatSchema);
module.exports=Chat