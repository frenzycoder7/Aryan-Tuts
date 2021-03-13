const Student = require('./../Models/Student');

const isStudentAuthencated = async(req,res,next) => {
    try {
        const token = req.header('auth');
        const user = await Student.findStudentByToken(token);
        if(!user) res.status(200).send({msg:"Token Not found Authencation Faild",code:404,status:'Faild'});
        else{
            req.user = user;
            req.token = token;
            next();
        }

    } catch (error) {
        res.status(500).send({msg:"internal server error"});
    }
}

module.exports = isStudentAuthencated;