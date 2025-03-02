const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/SIH2")
.then(()=>{
    console.log("Event connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const LogInSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    venue:{
        type:String,
        required:true
    },
    Date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    },
    register:{
        type:String,
        required:false
    }
})
const Events=new mongoose.model("EventsDB",LogInSchema)
module.exports=Events