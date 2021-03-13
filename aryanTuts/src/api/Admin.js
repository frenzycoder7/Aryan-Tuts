const admin = require('express').Router();
const Admin = require('./../Models/Admin');
const isAdminAuthencated = require('./../MiddelWare/isAdminAuthencated');
const Batch = require('./../Models/Batch');
const fs = require('fs');
const Student = require('../Models/Student');
const BatchPayment = require('./../Models/BatchPayment');


admin.get('/',isAdminAuthencated,async(req,res)=>{
    console.log(req.admin);
    res.send({msg:"Hello Admin",data:req.admin[0]});
});

admin.post('/reg-nadmin',async(req,res)=>{
    try {
        const {username,password,name} = req.body;
        let path = null;
        let date = Date.now();
        const admin = new Admin();
        admin.name = name;
        admin.username = username;
        admin.password = password;
        admin.adminImg = req.files ? '/public/'+date+'.jpg' : null ;
        await admin.save();
        if(req.files){
            path = './public/';
            req.files.adminImg.mv(path+date+'.jpg');
        }
        const token = await admin.genAdminToken();
        if(!token) res.status(200).send({msg:"Token Generation failed",status:'Failed',code:200});
        res.status(200).send({msg:"Admin Created",token:token,data:{username:username,name:name,adminImg:'/public/'+date+'.jpg'}});
    } catch (error) {
        res.status(200).send({msg:"Internal Server error",code:403,status:false,error:error.message});
    }
});

admin.post('/log-admin',async(req,res)=>{
    try {
        const {username,password} = req.body;
        const ad = await Admin.findAdminByCredentials(username,password);
        if(!ad) res.status(200).send({msg:"Username or password was wrong",status:false});
        const token = await ad.genAdminToken();
        if(!token) res.status(200).send({msg:"Token Generation failed",code:404,status:false});
        res.status(200).send({msg:"Login Success",data:ad,token:token,status:true});
    } catch (error) {
        res.status(200).send({msg:"Login Failed",status:false,code:404});
    }
});

admin.post('/add-batch',isAdminAuthencated,async(req,res)=>{
    try {
        const {name,batchDetails,batchTeacher,batchFee,batchSubjects} = req.body;
        let courseName;
        let courseDetails;
        const date = Date.now();
        let batch = new Batch();
        batch.name = name;
        batch.batchDetails = batchDetails;
        batch.batchTeacher = batchTeacher;
        batch.batchFee = batchFee;
        // console.log(batchSubjects);
        batchSubjects.forEach(element => {
            courseName = element.courseName;
            courseDetails = element.courseDetails;
            batch.batchSubjects = batch.batchSubjects.concat([{courseName,courseDetails}])
        });
        if(req.files){
            req.files.batchImage.mv('./public/'+'Batch'+name+date+'.jpg');
        }
        batch.batchImage = req.files ? '/public/'+'Batch'+name+date+'.jpg' : null ;
        await batch.save();
        res.send({batch:batch,msg:"Batch Created",status:true, code:201});
    } catch (error) {
        res.status(200).send({Msg:"Internal server error",status:false,code:403});
    }
});

admin.delete('/dlt-batch/:bid',isAdminAuthencated,async(req,res)=>{
    try {
        const batch = await Batch.findOne({_id:req.params.bid});
        if(!batch) res.status(200).send({msg:"Batch Not Found",status:false,code:404});
        batch.batchImage != null ? await fs.unlinkSync('.'+batch.batchImage) : console.log('Image Not Found');
        const dlt = await Batch.findByIdAndDelete(req.params.bid);
        //console.log(dlt)
        res.status(200).send({msg:"batch Deleted",status:true,code:200});
    } catch (error) {
        console.log(error);
        res.status(200).send({msg:"Internal server error",status:false,code:403,eror:error});
    }
});

admin.get('/all-batches',async(req,res)=>{
    try {
        const batches = await Batch.find({});
        if(!batches) res.status(200).send({msg:"Batch Not Found",status:false,code:404});
        res.status(200).send({msg:"Batch Found",batches:batches,status:true,code:200});
    } catch (error) {
        res.status(200).send({msg:"Internal server error",status:false,code:403});
    }
});

admin.patch('/update-batch/:bid',isAdminAuthencated,async(req,res)=>{
    try {
        let batch = await Batch.findById(req.params.bid);
        if(!batch) res.status(200).send({msg:"Invalid Batch id(bid)",status:false,code:404});
        const {name,batchDetails,batchTeacher,batchFee,batchSubjects} = req.body;
        let courseName;
        let courseDetails;
        const date = Date.now();
        batch.name = name || batch.name;
        batch.batchDetails = batchDetails || batch.batchDetails;
        batch.batchTeacher = batchTeacher || batch.batchTeacher;
        batch.batchFee = batchFee || batch.batchFee;
        // console.log(batchSubjects);
        if(req.files){
            req.files.batchImage.mv('./public/'+'Batch'+name+date+'.jpg');
        }
        batch.batchImage = req.files ? '/public/'+'Batch'+name+date+'.jpg' : batch.batchImage ;
        await batch.save();
        res.status(200).send({msg:"Batch Updated Successfully",code:200,status:true})
    } catch (error) {
        console.log(error);
    }
});
admin.post('/add-subject-to-batch/:bid',isAdminAuthencated,async(req,res)=>{
    try {
        const {subjectList} = req.body;
        let courseName;
        let courseDetails;
        let batch = await Batch.findById(req.params.bid);
        if(!batch) res.status(200).send({msg:"Invalid Batch id(bid)",status:false,code:404});
        subjectList.forEach((e)=>{
            courseName = e.courseName;
            courseDetails = e.courseDetails;
            batch.batchSubjects = batch.batchSubjects.concat([{courseName,courseDetails}]);
            
        });
        await batch.save();
        res.status(200).send({msg:subjectList.length+' are added to batch '+req.params.bid,status:true,code:201,batch:batch});
    } catch (error) {
        res.status(200).send({msg:"Internal server error",status:false,code:403});
    }
});

admin.delete('/delete-subjects-from-batch/:bid/:sid',isAdminAuthencated,async(req,res)=>{
    try {
        let batch = await Batch.findById(req.params.bid);
        if(!batch) res.status(200).send({msg:"Batch Not Found invalid batch id",status:false,code:404});
        await batch.update({
            $pull:{
                batchSubjects:{
                    _id:req.params.sid,
                }
            }
        });
        await batch.save();
        res.status(200).send({msg:"subject delete success",status:true,code:200});
    } catch (error) {
        res.status(200).send({msg:"internal server error",status:false,code:403})
    }
});

admin.get('/list-all-student',isAdminAuthencated,async(req,res)=>{
   try {
       const listAllStudent = await Student.find({});
       if(!listAllStudent) res.status(200).send({msg:"No Student",status:false,code:404});
       res.status(200).send({students:listAllStudent,status:true,code:200});
   } catch (error) {
       res.status(200).send({msg:"internal server error",status:false,code:403});
   } 
});

admin.post('/confirm-student-addmition/:sid',isAdminAuthencated,async(req,res)=>{
    try {
        let student = await Student.findById(req.params.sid);
        if(!student) res.status(200).send({msg:"Student Not Found",status:false,code:404});
        student.status = true;
        await student.save();
        res.status(200).send({msg:"Addmition confirmed for student"+student.name,status:true,code:201});
    } catch (error) {
        res.status(200).send({msg:"internal server error",status:false,code:403});
    }
});

admin.delete('/delete-student/:sid',isAdminAuthencated,async(req,res)=>{
    try {
        const student = await Student.findById(req.params.sid);
        if(!student) res.status(200).send({msg:"Student Not Found",status:false,code:404});
        await Student.findByIdAndDelete(req.params.sid);
        if(student.img != null) fs.unlinkSync('.'+student.img);
        res.status(200).send({msg:"Student Deleted",status:true,code:200});
    } catch (error) {
        console.log(error)
        res.status(200).send({msg:"Internal server error",status:false,code:403})
    }
});

admin.get('/single-batch/:bid',async(req,res)=>{
    try {
        const batch = await Batch.findById(req.params.bid);
        if(!batch) res.status(200).send({msg:"batch not found",status:false,code:404});
        res.status(200).send({batch:batch,status:true,code:200});
    } catch (error) {
        res.status(200).send({msg:"Internal server error",code:403,status:false});
    }
});

admin.patch('/accept-batch-enrollment/:sid/:bid',isAdminAuthencated,async(req,res)=>{
    try {
        const student = await Student.findById(req.params.sid);
        if(!student) res.status(200).send({msg:"Student not found wrong sid",status:false,code:404});
        student.batchId.forEach((e)=>{
            if(e.bid === req.params.bid){
                e.status = true;
            }
        });
        const batch = await Batch.findById(req.params.bid);
        let batchPayment = new BatchPayment();
        batchPayment.studentId = req.params.sid;
        batchPayment.batchId = req.params.bid;
        batchPayment.totalAmount = batch.batchFee;
        batchPayment.first_installment = null;
        batchPayment.second_installment = null;
        batchPayment.third_installment = null;
        batchPayment.dues = batch.batchFee;
        await student.save();
        await batchPayment.save();
        res.status(200).send({msg:"Batch Request was accepted",code:201,status:true});
    } catch (error) {
        res.status(200).send({msg:"internal server error " ,code:403, status:false});
    }
});

admin.patch('/deny-batch-enrollment/:sid/:bid',isAdminAuthencated,async(req,res)=>{
    try {
        let student = await Student.findById(req.params.sid);
        let isExist = false;
        if(!student) res.status(200).send({msg:"Student not found wrong sid",status:false,code:404});
        student.batchId.forEach( async (e)=>{
           
            if(e.bid === req.params.bid){
                
                if(e.status == false){
                    
                    await student.update({
                        $pull:{
                            batchId:{
                                bid:req.params.bid,
                                status:false
                            }
                        }
                    });
                }else { isExist = true;}
            }
        });
        if(isExist != false) res.status({msg:"NO Batch Request found for deny",status:false,code:404});
        await student.save();
        res.status(200).send({msg:"Batch Deny Request applied",code:201,status:true});
    } catch (error) {
        res.status(200).send({msg:"Internal Server error",code:403,status:false});
    }
});

module.exports = admin;