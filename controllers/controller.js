exports.index = (req,res) => {
    try{
        // Check if req.cookies exists and then check for userJwtAuth and adminJwtAuth cookies
        if (req.cookies && req.cookies.userJwtAuth) {
            res.render('user/index', { user: true });
        } else if (req.cookies && req.cookies.adminJwtAuth) {
            res.render('admin/admin');
        } else {
            res.render('user/index', { user: false });
        }
    }catch(e){
        console.log(e)
        res.status(500).send("Error");
    }
}