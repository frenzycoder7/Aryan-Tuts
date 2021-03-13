const mongoose = require('mongoose');
const lodash = require('lodash');
const jwt = require('jsonwebtoken');
const bcryptJs = require('bcryptjs');
const access = 'iamjack56';
const secret = 'blackcoder56';
const AdminSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    username:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        
    },
    password:{
        type:String,
        
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
    adminImg:{
        type:String,
        //default:null,

    }
},{
    timestamps:true,
});

AdminSchema.methods.toJSON = function(){
    let admin = this;
    let adminObj = admin.toObject();
    return lodash.pick(adminObj,['_id','name','username','adminImg']);
}

AdminSchema.methods.genAdminToken = function(){
    let admin = this;
    let token = jwt.sign({_id:admin._id.toHexString(),access},secret).toString();
    admin.tokens = admin.tokens.concat([{
        access,
        token
    }]);
    return admin.save().then(()=>{
        return token;
    });
}

AdminSchema.statics.findAdminByToken = function(token){
    let Admin = this;
    let decode;
    try {
        decode = jwt.verify(token,secret);
    } catch (error) {
        return Promise.reject();
    }
    return Admin.find({
        '_id':decode._id,
        'tokens.token':token,
        'tokens.access':access
    });
}

AdminSchema.statics.findAdminByCredentials = function(username,password){
    let Admin = this;
    // console.log(username,password);
    return Admin.findOne({username}).then((ad)=>{
        //console.log(ad);
        if(!ad) return Promise.reject();
        return new Promise((resolve,reject)=>{
            bcryptJs.compare(password,ad.password,(err,res)=>{
                if(res) resolve(ad);
                else reject(400);
            });
        });
    });
}

AdminSchema.methods.removeAdminToken = function(token){
    let admin = this;
    return admin.update({
        $pull:{
            tokens:{
                token:token
            }
        }
    });
}

AdminSchema.pre('save',function(next){
    let admin = this;
    if(admin.isModified('password')){
        bcryptJs.genSalt(7,(err,salt)=>{
            bcryptJs.hash(admin.password,salt,(err,hash)=>{
                admin.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});

const Admin = mongoose.model('Admin',AdminSchema);

module.exports = Admin;