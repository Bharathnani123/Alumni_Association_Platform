const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/SIH2")
.then(()=>{
    console.log("Feedback connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const feedbackSchema = new mongoose.Schema({
    name: 
    { 
        type:String
    },
    email: 
    {
        type:String
    },
    batchYear: String,
    department: String,
    eventRating: Number,
    eventSuggestions: String,
    websiteRating: Number,
    websiteIssues: String,
    communicationRating: Number,
    communicationSuggestions: String,
    futureInitiatives: String,
    overallRating: Number,
    openFeedback: String,
    recommend: String,
    contactPermission: String,
    submittedAt: { type: Date, default: Date.now }
});

const Feedback = new mongoose.model('Feedback', feedbackSchema);
module.exports=Feedback