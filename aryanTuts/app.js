const admin = require('./src/api/Admin');
const batch = require('./src/api/Batch');
const student = require('./src/api/Student');
const bodyParser = require('body-parser');

const app = require('express')();
const httpServer = require('http').createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(require('express-fileupload')());
require('dotenv').config({path:__dirname+'/.env'});

(async()=>{
    try {
        require('mongoose').connect(process.env.DB || 'mongodb://localhost/aryan',{
            useUnifiedTopology:true,
            useNewUrlParser:true,
        },(err)=>{
            if(err) throw err;
            else console.log('DB CONNECTION: =======> OK');
        });
    } catch (error) {
        console.log('DB Error');
    }
})();


app.use('/api/student',student);
app.use('/api/admin',admin);
app.use('/api/batch',batch);
app.use((req,res,next)=>{
    res.status(404).send({msg:"Page Not Found",code:404,status:false});
})
httpServer.listen(process.env.PORT || 3000,(err)=>{
    if(err) console.log('Server error');
    console.log('Server is started on http://localhost:'+process.env.PORT || 3000);
})