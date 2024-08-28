
var authMiddleware={
    authcheck:(req,res,next)=>{
        if(req.session.user)//tồn tại session user (đã đăng nhâp)
        {
            res.locals.login=req.session.user;
            next();
        }
        else{
            res.redirect('/login');
        }
    }
}
module.exports=authMiddleware;