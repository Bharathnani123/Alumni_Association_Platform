const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/SIH2")
.then(()=>{
    console.log("Gallery connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const alumniGallerySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['gallery', 'profiles', 'interviews'],
        required: true
    },
    title: {
        type: String,
        required: function() { return this.type !== 'interviews'; }
    },
    imageUrl: {
        type: String,
        required: function() { return this.type === 'gallery'; }
    },
    profilePhoto:{
        type: String,
        required: function() { return this.type === 'profiles'; }
    },
    fullName: {
        type: String,
        required: function() { return this.type === 'profiles'; }
    },
    batch: {
        type: String,
        required: function() { return this.type === 'profiles'; }
    },
    achievement: {
        type: String,
        required: function() { return this.type === 'profiles'; }
    },
    description: {
        type: String,
        required: function() { return this.type === 'profiles'; }
    },
    location: {
        type: String,
        required: function() { return this.type === 'profiles'; }
    },
    contact: {
        type: String,
        required: function() { return this.type === 'profiles'; }
    },
    interviewDate: {
        type: Date,
        required: function() { return this.type === 'interviews'; }
    },
    videoUrl: {
        type: String,
        required: function() { return this.type === 'interviews'; }
    },
    summary: {
        type: String,
        required: function() { return this.type === 'interviews'; }
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});
const AlumniGallery = new mongoose.model('AlumniGallery', alumniGallerySchema);
module.exports=AlumniGallery;