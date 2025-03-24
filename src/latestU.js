const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/SIH2")
.then(()=>{
    console.log("latest Update connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const UpdateSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});
  
  const Update = new mongoose.model('Update', UpdateSchema);
  module.exports = Update
  