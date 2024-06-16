exports.index = (req,res) => {
    try{
        if(req.cookie.userJwtAuth){
            res.render('user/index',{user:true});
        }else if(req.cookie.adminJwtAuth){
            res.render('admin/admin')
        }else{
            res.render('user/index',{user:false});
        }
    }catch(e){
        console.log(e)
        res.status(500).send("Error");
    }
}