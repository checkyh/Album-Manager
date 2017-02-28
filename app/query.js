var Datastore = require('nedb')
var db = new Datastore({ filename: 'lib/photodb', autoload: true });
var tagdb = new Datastore({filename:'lib/tagdb', autoload:true});
var Q = require('q');

function init(){
    var defer=Q.defer();
    // Using a unique constraint with the index
    tagdb.ensureIndex({ fieldName: 'tag', unique: true }, function (err) {
      if(err){
        console.error(err);
        defer.reject(err);
      }
    });
    db.ensureIndex({ fieldName: 'path', unique: true }, function (err) {
      if(err){
        console.error(err);
        defer.reject(err);
      }
    });
}

function add(ret) {
    var defer = Q.defer();
    db.insert(ret, function (e, v) {
        if (e) {
            console.error(e, v);
            defer.reject(e)
        }
        else {
            defer.resolve(v);
        }
        }
    );
    return defer.promise;
}
function list() {
    var defer= Q.defer() ;
    db.find({}).sort({created: -1}).skip().exec(function (err, list) {
       if(err)
       {
           defer.reject(err);
       }
        else
       {
           defer.resolve(list);
       }
    });
    return defer.promise ;
}
function seach(word) {
    var reg = new RegExp(word, 'i');
    var defer= Q.defer() ;
    db.find({title: {$regex: reg}}, function (err, docs) {
       // console.log(err,docs) ;
        if(err)
        {
            defer.reject(err) ;
        }
        else
        {
            defer.resolve(docs)
        }
    });
    return defer.promise ;
}
function categorylist(category1, callback) {
    var defer= Q.defer() ;
    db.find({column: category1}).sort({created: -1}).skip().exec(function (err, list) {
        if(err)
        {
            defer.reject(err) ;
        }
        else
        {
            defer.resolve(list)
        }
    });
    return defer.promise ;
}
function hotlist() {
    var defer = Q.defer();
    db.find({}).sort({yuedu: -1}).skip().exec(function (key, list) {
        if (err) {
            defer.reject(e);
        }
        else {
            defer.resolve(list)
        }
    });
    return defer.promise;
}
function newlist() {
    var defer = Q.defer();
    db.find({}).sort({created: -1}).skip().exec(function (err, list) {
        if (err) {
            defer.reject(err);
        }
        else {
            defer.resolve(list);
        }
    });
    return defer.promise;
}
function tag(){
  var defer= Q.defer() ;
  tagdb.find({}).sort({created: -1}).skip().exec(function (err, list) {
     if(err)
     {
        defer.reject(err);
     }
      else
     {
        defer.resolve(list);
     }
  });
  return defer.promise ;
}

function addtag(tagname){
  var defer=Q.defer();
  tagdb.insert({tag:tagname},function(e,v){
    if(e){
      console.console.error(e,v);
      defer.reject(e);
    }
    else{
      defer.resolve(v);
    }

  });
  return defer.promise;
}
exports.add = add;
exports.list = list;
exports.newlist = newlist;
exports.seach = seach;
exports.init = init;
exports.tag= tag;
exports.addtag=addtag;
