const express=require('express');
const app=new express();
app.set('view engine','ejs');
const mysql=require('mysql');
const bodyParser=require('body-parser');
const Joi =require('joi');
const multer=require('multer');
const session=require('express-session');
const path =require('path');
const authMiddleware = require('./middlewares/authMiddleware');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(session({
    secret:'ABC44445@aab',
    resave:true,
    saveUninitialized:false
}));
app.use((req,res,next)=>{
    res.locals.login=req.session.user;
    next();
})
app.get('/',(req,res)=>{
    res.send('Xin chào các bạn đến với Express');
});

var conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'qlhh'
});
//Kết nối tới mysql
conn.connect(function(err){
    if(err) throw err;
    console.log("Kết nối thành công");
})   

app.get('/home',(req,res)=>{
    //Lấy dữ liệu từ mysql
    var tieude="Shop ban hang";
    res.render('trangchu',{tieude:tieude});
});

app.get('/logout',(req,res)=>{
    //gán session bằng null
    req.session.user=null;
    res.redirect('/home');
});
app.get('/cate',(req,res)=>{
    var sql="select * from Category limit 4";
    var tieude="Quản lý nhóm loại sản phẩm";
    conn.query(sql,(err,cate)=>{
        if(err) throw err;
        res.render('Category/Danhsach',{cat:cate,tieude:tieude});
    });
})
app.get('/cate/them',(req,res)=>{
    res.render('Category/AddCate');
})
app.get('/cate/edit/:id',(req,res)=>{
    var sql="select * from Category where id="+req.params.id;
    conn.query(sql,(err,cate)=>{
        if(err) throw err
        res.render('Category/EditCate',{cat:cate[0]});
    })
    
})
app.get('/cate/delete/:id',(req,res)=>{
    var sql="delete from Category where id="+req.params.id;
    conn.query(sql,(err,cate)=>{
        if(err) throw err
        res.redirect('/cate');
    })
})
//cấu hình nơi lưu file hình ảnh

const Luutru=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./img');
    },
    filename:(req,file,callback)=>{
        file= `${file.originalname}`;
        callback(null,file);
    }
})
//Khai báo biến upload để thực thi
var upload=multer({storage:Luutru});
app.post('/cate/luu',upload.single('images'),(req,res)=>{
    const Schema=Joi.object().keys({
        name:Joi.string().required().messages({'string.empty':'Tên nhóm không được trống'}),
        ord:Joi.string().required().messages({'string.empty':'Thứ tự không được trống'})
    });

    const {error}=Schema.validate(req.body,Joi.options);
    if(error)
    {
        res.render('Category/AddCate',{err:error.details});
    }
    else
    {
        var sql="INSERT INTO category (name,ord,status) VALUES ('"+req.body.name+"',"+req.body.ord+",0)";
        conn.query(sql,(err,cate)=>{
            if(err) throw err
            res.redirect('/cate');
        })
    }
})
require('./router/user.route')(app);
app.get('/menu',(req,res)=>{
    var data={hoten:"Tuấn Nguyễn"};
    var menu=[{name:"Gà rán"},{name:'Thịt quay'},{name:'Bò khô'}];
    res.render('home',{name:menu,hoten:data});
});
app.get('/trangchu',(req,res)=>{
    res.sendFile(__dirname+"/Home.html");
});
app.get('/san-pham/them',(req,res)=>{
    res.sendFile(__dirname+"/Sanpham/Them.html");
});
app.get('/hinh-anh',(req,res)=>{
    res.sendFile(__dirname+"/Sanpham/Them.html");
});
app.listen(3000,()=>{
    console.log("Server được khởi tạo");
});