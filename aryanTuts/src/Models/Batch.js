const mongoose = require('mongoose');
const lodash = require('lodash');

const BatchSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    batchDetails:{
        type:String,
    },
    batchTeacher:{
        type:String,
    },
    batchFee:{
        type:String,
    },
    batchSubjects:[{
        courseName:{
            type:String,
        },
        courseDetails:{
            type:String,
        }
    }],
    batchImage:{
        type:String,
    }
},{
    timestamps:true,
});

BatchSchema.methods.toJson = function(){
    let batch = this;
    let batchObj = batch.toObject();
    return lodash.pick(batchObj,['_id','name','batchDetails','batchTeacher','batchFee','batchSubject','batchImage']);
}


BatchSchema.methods.addNewCourse = function(courseName,courseDetails){
    let batch = this;
    batch.batchSubjects = batch.batchSubjects.concat([{
        courseName,
        courseDetails
    }]);
    return batch.save().then(()=>{
        return batch;
    });
}

const Batch = mongoose.model('Batch',BatchSchema);

module.exports = Batch;