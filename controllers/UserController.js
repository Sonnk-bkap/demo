const bodyParser=require('body-parser');
const User=require('../models/User');
const bcrypt =require('bcrypt');
var UserController={
    dangky:(req,res)=>{
        res.render('dangky');
    },
    create:(req,res)=>{
        bcrypt.hash(req.body.pass,parseInt(10)).then((passmoi)=>{
            var email=req.body.email;
            User.create(({email,passmoi}),(err,data)=>{
            if(err)
                res.send(err);
            else
                res.render('login');
        })
    });
    },
   
    login:(req,res)=>{
        res.render('login');
    },
    dangnhap:(req,res)=>{
        //Kiểm tra đăng nhập
        User.check_login(req.body.email,req.body.pass,(err,data)=>{
        if(err)
            res.send(err);
        else
            {
                req.session.user=data;
                res.redirect('/home');
            }
    });
    
    }
}
module.exports=UserController;