
const conn=require('../database/connect');
const bcrypt =require('bcrypt');
var User={

    create:(data,callback)=>{
        return conn.query(sql="INSERT INTO user(fullname, email, password, active) VALUES ('"+data.fullname+"','"+data.email+"','"+data.passmoi+"',"+(data.active=='on'?1:0)+")",callback);

    } , 
    check_login:(email,pass,callback)=>{
        var sql="select * from user where email='"+email+"'";
        conn.query(sql,(err,data)=>{
            if(data[0])
            {
                //Check đến pass
                bcrypt.compare(pass,data[0].password,(loi,result)=>{
                    if(result)//Đăng nhập thành công
                    {
                        return callback(null,data[0]);
                    }
                    else
                    {
                        return callback(loi,null);
                    }
                })
                
  
            }
            else
                {
                    //Đăng nhập không thành công
                    let loi="Sai thông tin đăng nhập";
                    return callback(loi,null);
                }
        })
    },

}
module.exports=User;