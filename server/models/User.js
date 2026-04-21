import mongoose from "mongoose"

const userSchema = new mongoose.Schema ({

    name :{
        type :String,
        required : [true, "Please enter a name"],

    } ,
    email :{
        type :String ,
        unique :[true, "Please enter a valid email address"],
        trim : true,
        lowercase :true,
        required:true

    } ,
    password:{
        type :String,
        required : function(){
            return this.authProvider ==='local';
        }

    } ,

    avatar:{
        type:String ,
        default : ''
    } ,

    authProvider:{
        type :String,
        enum :['local' ,'google'] ,
       default : 'local' ,
    } ,

    googleId :{
        type :String ,
        default : null ,
    } ,

    isVerified: {
        type : Boolean ,
        default : false ,
    },

    role :{
        type :String ,
        enum : ['admin', 'user'],
        default :'user' ,
    } ,

},{timestamps:true} ) ;


export default mongoose.model('User', userSchema);
