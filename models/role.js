const mongoose=require('mongoose');
const roleSchema=new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    name:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true 
    },
    contactNumber:{
        type:String,
        // required:true
    },
    password:{
        type:String,
        required:true 
    },
    ward:{
        type:String,
        required:true 
    }
})
module.exports=mongoose.model('Role',roleSchema)