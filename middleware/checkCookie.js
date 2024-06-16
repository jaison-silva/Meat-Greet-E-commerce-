function adminJwtAuth(req, res, next){
    if(req.cookie){
        next()
    }else{
        res.redirect('/admin')
    }
}

function userJwtAuth(req, res, next){
    if(req.cookie){
        next()
    }else{
        res.redirect('/login')
    }
} 