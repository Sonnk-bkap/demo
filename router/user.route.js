const UserController=require('../controllers/UserController');
var UserRoute=function(app){
        app.get('/dangky',UserController.dangky);
        app.post('/dangky',UserController.create);
        app.get('/login',UserController.login);
        app.post('/login',UserController.dangnhap);
}
module.exports=UserRoute;
