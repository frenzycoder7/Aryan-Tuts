const student = require('express').Router();
const isStudentAuthencated = require('../MiddelWare/isStudentAuthencated');
const Student = require('./../Models/Student');
const Batch = require('./../Models/Batch');
const BatchPayment = require('./../Models/BatchPayment');


student.get('/stud',isStudentAuthencated,async(req,res)=>{
    if(!req.user[0]){
        res.status(200).send({msg:"Token Expaire"});
    }
    res.send({data:req.user[0]});
});


student.post('/stu-reg',async(req,res)=>{
    try {
        const stu = new Student(req.body);
        const name = Date.now();
        stu.img = req.files ? '/public/'+name+'.jpg' : null;
        await stu.save();
        if(req.files){
            const path = './public/';
            req.files.img.mv(path+name+'.jpg');
        }
        const token = await stu.genStudentToken();
        if(!token) return res.status(200).send({msg:"Token Generation Faild",code:403,data:[],token:null});
        res.status(200).send({msg:"Registration Successfull.",code:201,data:stu,token:token});
    } catch (error) {
        res.status(200).send({msg:"Internal Server Error.",code:403,errorMsg:error.message});
    }
});

student.post('/log-stu',async(req,res)=>{
    try {
        const {username,password} = req.body;
        const user = await Student.findStudentByCredentials(username,password);
        if(!user) res.status(200).send({msg:"Username or password was wrong.",code:404,status:false});
        const token = await user.genStudentToken();
        if(!token) res.status(200).send({msg:"Token Generation Faild..",code:404,status:'faild'});
        res.status(200).send({msg:"Login Succes",token:token,data:user,code:200});
    } catch (error) {
        if(error == 404) res.status(200).send({msg:"Username or password was wrong.",code:404,status:false});
        res.status(200).send({msg:'Internal server error',code:403});
    }
});

student.get('/check/u-name/:username',async(req,res)=>{
   try {
       const uname = await Student.findOne({username:req.params.username});
       if(!uname) res.status(200).send({msg:"Username not found in database",status:true});
       else res.status(200).send({msg:"Username is already taken by another user",status:false});
   } catch (error) {
        res.status(200).send({msg:"Internal Server Error.",code:403,errorMsg:error.message});
   } 
});

student.patch('/enroll-batch/:bid',isStudentAuthencated,async(req,res)=>{
    try {
        let student = await Student.findById(req.user[0]._id);
        if(student.status === false) return res.status(200).send({msg:"Dear Student your addmitions was not confirmed",status:false,code:404});
        student.batchId = student.batchId.concat([{bid:req.params.bid,status:false}]);
        student.batchStatus = true;
        await student.save();
        res.status(200).send({msg:"Batch Request is Successfully sended",student:student,status:true,code:201});
    } catch (error) {
        res.status(200).send({msg:"Internal server error"});
    }
});

student.post('/dlt-enrolled-batch/:bid',isStudentAuthencated,async(req,res)=>{
    try {
        let student = await Student.findById(req.user[0]._id);
        let isExist = false;
        let isPendingBatch = false;
        student.batchId.forEach((e)=>{
            if(e.status === false) isPendingBatch = true;
            if(e.bid===req.params.bid){
                isExist = true;
                return;
            }
        });
        isPendingBatch ? student.batchStatus = true : student.batchStatus = false;
        if(isExist)
        {
            await student.update({
                $pull:{
                    batchId:{
                        bid: req.params.bid,
                        status:false,
                    }
                }
            });
            await student.save();
            res.status(200).send({msg:"Batch was removed",status:true,code:200,student:student});
        }else{
            res.status(200).send({msg:"this batch id is not added in your list",status:false,code:404});
        }
    } catch (error) {
        res.status(200).send({msg:"internal server error",code:403,status:false});
    }
});

module.exports = student;