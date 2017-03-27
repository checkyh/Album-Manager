var Datastore = require('nedb');
var fs = require('fs');
var db = new Datastore({
    filename: 'lib/photodb',
    autoload: true
});
var tagdb = new Datastore({
    filename: 'lib/tagdb',
    autoload: true
});
var temptag = new Datastore({
    filename: 'lib/temptag',
    autoload: true
});
var Q = require('q');

function init() {
    var defer = Q.defer();
    // Using a unique constraint with the index
    tagdb.ensureIndex({
        fieldName: 'tag',
        unique: true
    }, function(err) {
        if (err) {
            console.error(err);
            defer.reject(err);
        }
    });
    db.ensureIndex({
        fieldName: 'path',
        unique: true
    }, function(err) {
        if (err) {
            console.error(err);
            defer.reject(err);
        }
    });
}

function add(ret) {
    var defer = Q.defer();
    db.insert(ret, function(e, v) {
        if (e) {
            console.error(e, v);
            defer.reject(e)
        } else {
            defer.resolve(v);
        }
    });
    return defer.promise;
}

function list() {
    var defer = Q.defer();
    db.find({}).sort({
        created: -1
    }).skip().exec(function(err, list) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(list);
        }
    });
    return defer.promise;
}

function search(word) {
    var reg = new RegExp(word, 'i');
    var defer = Q.defer();
    db.find({
        title: {
            $regex: reg
        }
    }, function(err, docs) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(docs)
        }
    });
    return defer.promise;
}

function tag() {
    var defer = Q.defer();
    tagdb.find({}).sort({
        created: -1
    }).skip().exec(function(err, list) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(list);
        }
    });
    return defer.promise;
}

function addtag(tagname) {
    var defer = Q.defer();
    tagdb.insert({
        tag: tagname
    }, function(e, v) {
        if (e) {
            console.console.error(e, v);
            defer.reject(e);
        } else {
            defer.resolve(v);
        }

    });
    return defer.promise;
};

function writetag(tagname) {
    temptag.update({
        id: 1
    }, {
        $set: {
            tag: tagname
        }
    }, function(e, v) {
        console.log(e, v);
    });
};

function gettag() {
    var defer = Q.defer();
    temptag.find({
        id: 1
    }).skip().exec(function(err, list) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(list);
        }
    });
    return defer.promise;
};

function filtered_list() {
    return gettag().then(function(result){
      var tagname=result[0].tag;
      var defer = Q.defer();
      db.find({
          tag: tagname
      }).sort({
          created: -1
      }).skip().exec(function(err, list) {
          if (err) {
              defer.reject(err);
          } else {
              defer.resolve(list);
          }
      });
      return defer.promise;
    });
};

exports.add = add;
exports.list = list;
exports.search = search;
exports.init = init;
exports.tag = tag;
exports.addtag = addtag;
exports.writetag = writetag;
exports.filtered_list = filtered_list;
