const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/SIH2")
.then(()=>{
    console.log("Acheivements connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const achievementSchema = new mongoose.Schema({
    title: String,
    alumniName: String,
    batchYear: String,
    briefSummary: String,
    fullDetails: String,
    skillsHighlighted: String,
    awards: String,
    challenges: String,
    futureGoals: String,
    image: String,
    tags: [String],
    likes: { type: Number, default: 0 },
    comments: [
        {
            alumniName: String,
            comment: String,
        },
    ],
});

const Achievement = new mongoose.model('Achievement', achievementSchema);
module.exports = Achievement;