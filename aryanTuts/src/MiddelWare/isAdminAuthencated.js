const Admin = require('./../Models/Admin');

const isAdminAuthencated = async(req,res,next) => {
    try {
        const token = req.header('admin_auth');
        const admin = await Admin.findAdminByToken(token);
        if(!admin) res.status(200).send({msg:"token Expire"});
        else{
            req.admin = admin;
            req.token = token;
            next();
        }
    } catch (error) {
        res.status(500).send({msg:"internal server error"});
    }
}

module.exports = isAdminAuthencated;