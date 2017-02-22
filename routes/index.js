var express = require('express');
var router = express.Router();


var ObjectID = require('mongodb').ObjectID;

router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
	var db = req.db;
	db.collection('post').find().toArray(function(err,csspseudos){
		if(err||!csspseudos.length){
			console.log('csspseudo err');
			res.json({
				success:false,
				err:err
			});
		}else{
			db.collection('post').find().toArray(function(err,syntexs){
				if(err||!syntexs.length){
					console.log('syntex err');
					res.json({
						success:false,
						err:err
					});
				}
				else{
					res.render('index',{title:'Express',csspseudos:csspseudos, syntexs:syntexs});
					var newUser = req.body;
					db.collection('user').insertOne(newUser,function(err,docs){
						console.log(docs);
//						if(err||!docs.length){res.json({success:false,err:err});}
//						else{res.json(docs);}
					});
					
				}
			});
			//res.render('index',{title:'Express', csspseudos : csspseudos});
		}
	});
});

//	router.get('/posts', function(req, res, next) {
//		res.render('post', { title: 'Express' });
//	});	
//	router.get('/csspseudo/:id', function(req, res, next) {
//		res.render('postdetail', { title: 'Express' });
//	});

	/*Read Operation List View and Detail View*/
	router.get('/api/csspseudo', function(req, res, next){
		var db = req.db;
		db.collection('post').find().toArray(function(err, docs){
			console.log(docs);
			if(err||!docs.length){res.json({success:false, err:err});}
			else{res.json(docs);}
		});
		
	});
	router.get('/api/csspseudo/:_id',function(req, res, next){
		var db = req.db;
		var new_id = new ObjectID(req.params._id); 
		db.collection('post').find({_id:new_id}).toArray(function(err,docs){
			console.log(docs);
			//console.log("aaa" , docs);
			if(err||!docs.length){
				res.json({success:false,err:err});
			}
			else{
				res.json(docs);
			}
		});
	});
	router.post('/api/csspseudocomment',function(req, res, next){
		var db = req.db;
		var newPost = req.body;
		db.collection('comments').insertOne(newPost,function(err,docs){
			console.log(docs);
			if(err||!docs.length){
				res.json({success:false,err:err});
			}
			else{
				res.json(docs);
			}
		});
	});
	router.get('/api/csspseudocomment/:_id',function(req,res,next){
		var db=req.db;
		//var newcomment_id = new ObjectID(req.params._id);
		//alert(newcomment_id);
		//{newcomment_id:req.params.postId}
		//var nid =req.params._id;
		var nid = req.params._id;
		db.collection('comments').find({postId:nid}).toArray(function(err,docs){
			console.log(docs);
			if(err||!docs.length){
				res.json({success:false,err:err});
			}
			else{
				console.log(docs);
				res.json(docs);
			}
		});
	});
	/*Create Operation*/
	router.post('/api/writecsspseudo',function(req, res, next){
		var db = req.db;
		var newPost = req.body;
		db.collection('post').insertOne(newPost,function(err,docs){
			console.log(docs);
			if(err||!docs.length){
				res.json({success:false,err:err});
			}
			else{
				res.json(docs);
			}
		});
	});
	router.post('/api/insertusers',function(req,res,next){
		var db=req.db;
		var newUser = req.body;
		db.collection('user').insertOne(newUser,function(err,docs){
			console.log(docs);
		});
	});

	/*Update Operation get and post*/
	router.get('/api/updatecsspseudo/:_id',function(req, res, next){
		var db = req.db;
		var newObjId = new ObjectID(req.params._id);
		db.collection('post').find({_id:newObjId}).toArray(function(err,docs){
			console.log(docs);
			if(err||!docs.length){
				res.json({success:false,err:err});
			}
			else{
				res.json(docs);
			}
		});
	});
	router.post('/api/updatecsspseudo/:_id',function(req, res, next){
		var db = req.db;
		var updatedPost = req.body;
		delete updatedPost._id;
		var newUpdObjId = new ObjectID(req.params._id);
		db.collection('post').update({_id:newUpdObjId}, updatedPost,function(err,docs){
			console.log(docs);
			if(err||!docs.length){
				res.json({success:false,err:err});
			}
			else{
				res.json(docs);
			}
		});
	});
	
	/*Delete Operation get and post*/
	router.get('/api/deletecsspseudo/:_id',function(req,res,next){
		var db=req.db;
		var newDelObjId = new ObjectID(req.params._id);
		db.collection('post').find({_id:newDelObjId}).toArray(function(err,docs){
			console.log(docs);
			if(err||!docs.length){
				res.json({success:false,err:err});
			}
			else{res.json(docs);}
		});
	});
	router.post('/api/deletecsspseudo/:_id',function(req,res,next){
		var db=req.db;
		var deletedPost = req.body;
		delete deletedPost._id;
		var newDelObjId = new ObjectID(req.params._id);
		db.collection('post').remove({_id:newDelObjId},deletedPost,function(err,docs){
			console.log(docs);
			if(err||!docs.length){
				res.json({success:false,err:err});
			}
			else{res.json(docs);}
		});
	});
	
module.exports = router;