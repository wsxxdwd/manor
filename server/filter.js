
exports.authorize = function(req,res,next){
	if(!req.session.uid){
		res.redirect('/');
	}else{
		next();
	}
}
exports.authorizeAdmin = function(req,res,next){
	if(req.params.page == "/admin/index"){
		next();
	}else{
		if(!req.session.aid){
			res.redirect('/admin/index');
		}else{
			next();
		}
	}
}