
module.exports.loadHomePage = function(req, res, next) {
	res.render('index', {title: 'Chat'});
};

