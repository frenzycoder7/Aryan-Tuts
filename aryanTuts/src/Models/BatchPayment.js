const mongoose = require('mongoose');

const BatchPaymetSchema = new mongoose.Schema({
    studentId:{
        type:String,        
    },
    batchId:{
        type:String,
        unique:true,
    },
    totalAmount:{
        type:String
    },
    first_installment:{
        type:String,
    },
    second_installment:{
        type:String
    },
    third_installment:{
        type:String
    },
    dues:{
        type:String
    }
},{
    timestamps:true
});


BatchPaymetSchema.methods.paidFirstInstallment = function(amount){
    let batchPayment = this;
    if(batchPayment.totalAmount < amount){
        batchPayment.first_installment = amount;
        return batchPayment.save().then(()=>{
            return batchPayment;
        });
    }else if(batchPayment.totalAmount == amount){
        batchPayment.first_installment = "disabled";
        batchPayment.second_installment = "disabled";
        batchPayment.third_installment = amount;
        batchPayment.dues = "0";
        return batchPayment.save().then(()=>{
            return batchPayment;
        });
    }else{
        return Promise.reject({msg:"You Have Enterd Big Amount"});
    }
}

BatchPaymetSchema.methods.paidSecondInstallment = function(amount){
    let batchPayment = this;
    if(batchPayment.totalAmount < amount){
        batchPayment.second_installment = amount;
        const some = batchPayment.first_installment + batchPayment.second_installment;
        const dues = batchPayment.totalAmount - some;
        if(dues === 0){
            batchPayment.third_installment = 'disabled';
            batchPayment.dues = '0';
        }
        batchPayment.dues = dues;
        return batchPayment.save().then(()=>{
            return batchPayment;
        });
    }else if(batchPayment.totalAmount == amount){
        return Promise.reject({msg:"You Have Enterd Big Amount"});
    }else{
        return Promise.reject({msg:"You Have Enterd Big Amount"});
    }
}

BatchPaymetSchema.methods.paidThirdInstallment = function(amount){
    let batchPayment = this;
    if(batchPayment.totalAmount < amount){
        const total = batchPayment.first_installment+batchPayment.second_installment+amount;
        if(total === batchPayment.totalAmount){
            batchPayment.third_installment = amount;
            batchPayment.dues = '0'
            return batchPayment.save().then(()=>{
                return batchPayment;
            });
        }else{
            return Promise.reject(500);
        }

    }else if(batchPayment.totalAmount == amount){
        return Promise.reject({msg:"You Have Enterd Big Amount"});
    }else{
        return Promise.reject({msg:"You Have Enterd Big Amount"});
    }
}


const BatchPayment = mongoose.model('BatchPayment',BatchPaymetSchema);
module.exports = BatchPayment;