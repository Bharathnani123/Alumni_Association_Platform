const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/SIH2")
.then(()=>{
    console.log("Local connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const AlumniLocationSchema = new mongoose.Schema({
    name: String,
    location: String,
    latitude: Number,
    longitude: Number
});

const AlumniLocation =  new mongoose.model('AlumniLocation', AlumniLocationSchema);
module.exports=AlumniLocation