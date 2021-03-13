const mongoose = require('mongoose');
const lodash = require('lodash');
const access = 'Somthing Access COde';
const secret = 'iamjack56';
const jwt = require('jsonwebtoken');
const bcryptJs = require('bcryptjs');


const StudentSchema = new mongoose.Schema({
    Name:{
        type:String,
    },
    username:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase: true,
    },
    password:{
        type:String
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }],
    DOB:{
        type:String,
        
    },
    img:{
        type:String

    },
    batchId:[{
        bid:{
            type:String,
            required:true,
            unique:true,
        },
        status:{
            type:Boolean,
            default:false
        }
    }],
    mobNum:{
        type:String,
        
    },
    status:{
        type:Boolean,
        default: false
    },
    batchStatus:{
        type:Boolean,
        default:false
    }
    
},{
    timestamps:true
});


StudentSchema.methods.toJSON = function(){
    var student = this;
    let studentObj = student.toObject();
    return lodash.pick(studentObj,['_id','Name','username','DOB','img','mobNum','status','batchId','batchStatus']);
}

StudentSchema.methods.genStudentToken = function(){
    let student = this;
    let token = jwt.sign({_id:student._id.toHexString(),access},secret).toString();
    student.tokens = student.tokens.concat([{
        access,
        token
    }]);
    return student.save().then(()=>{
        return token;
    });
}

StudentSchema.statics.findStudentByToken = function(token){
    let Student = this;
    let decode;
    try {
        decode = jwt.verify(token,secret);
    } catch (error) {
        return Promise.reject();
    }
    return Student.find({
        '_id':decode._id,
        'tokens.token': token,
        'tokens.access': access
    });
}

StudentSchema.statics.findStudentByCredentials = function(username,password){
    let Student = this;
    return Student.findOne({username}).then((user)=>{
        if(!user) return Promise.reject();
        return new Promise((resolve,reject)=>{
            bcryptJs.compare(password,user.password,(err,res)=>{
                if(res) resolve(user);
                else reject(404);
            });
        });
    });
}

StudentSchema.methods.removeStudentToken = function(token){
    let student = this;
    return student.update({
        $pull:{
            tokens:{
                token:token
            }
        }
    });
}

StudentSchema.pre('save',function(next){
    let student = this;
    
    if(student.isModified('password')){
        bcryptJs.genSalt(7,(err,salt)=>{
            bcryptJs.hash(student.password,salt,(err,hash)=>{
                student.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});
const Student = mongoose.model('Student',StudentSchema);

module.exports = Student;