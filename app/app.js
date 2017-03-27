import os from 'os'; // native node.js module
import {
    remote,
    ipcRenderer
} from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import fs from 'fs';
import path from 'path';
import env from './env';

var app = remote.app;
var db = require('./query');
var createPA = function(path) {
    ipcRenderer.send('createPA', val);
};
var Dialogs = require('dialogs');
var dialogs = Dialogs({});
document.getElementByClassName
window.$(document).on("click", "#MTag", function() {
    dialogs.prompt('Change Tags',  function(ok) {});
});
window.$(document).on("click", "#selected", function() {
    var val = window.$(this).data('tag');
    db.writetag(val);
});
window.$(document).on("click", "#Create", function() {
    ipcRenderer.send('createPA');
})

function loadjscssfile(filename, filetype, callback) {
    if (filetype == "js") {
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("async", "text/javascript");
        fileref.setAttribute("src", filename);

    } else if (filetype == "css") {
        var fileref = document.createElement('link');
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }
    if (callback != null) {
        fileref.onload = fileref.onreadystatechange = function() {
            if (fileref.ready) {
                return false;
            }
            if (!fileref.readyState || fileref.readyState == "loaded" || fileref.readyState == 'complete') {
                fileref.ready = true;
                callback();
            }
        }
    }
    if (typeof fileref != "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
};
document.addEventListener('DOMContentLoaded', function() {
    db.init();
    db.tag().then(function(result) {
        for (var i = 0; i < result.length; i++) {
            var divElement = "<div class=\"filter\" data-filter=\"." + result[i].tag + "\">" + result[i].tag + "</div>";
            document.getElementById('tag-column').innerHTML += divElement;

        }
        db.list().then(function(result) {
            for (var i = 0; i < result.length; i++) {
                var item = "<div class=\"mix " + result[i].tag + "\"><div class=\"main\"><img src=\"" + result[i].path + "\"><div class=\"desc\"><div class=\"text\">Title:" + result[i].name + "<br>Path:" + result[i].path + "<br>Tags:" + result[i].tag + "<br></div> <a id=\"selected\" data-tag=\"" + result[i].tag + "\" class=\"waves-effect waves-light btn\" href=\"#modal1\">Select</a></div></div><div class=\"details\"><div class=\"title\">" + result[i].name + "</div><div class=\"skills\">" + result[i].tag + "\"</div></div>"
                document.getElementById('items').innerHTML += item;
            }
            loadjscssfile("node_modules/hammerjs/hammer.js", "js", function() {
                loadjscssfile("node_modules/materialize-css/dist/js/materialize.js", "js", function() {
                    loadjscssfile("node_modules/jquery.mixitup.js", "js", function() {
                        loadjscssfile("node_modules/main.js", "js", function() {
                            loadjscssfile("node_modules/modals.js", "js");
                        });
                    });
                });
            });
            loadjscssfile("css/normalize.css", "css");
            loadjscssfile("node_modules/materialize-css/dist/css/materialize.css", "css");
            loadjscssfile("node_modules/material-design-icons/iconfont/material-icons.css", "css");
            loadjscssfile("css/gallery.css", "css");
            loadjscssfile("css/style.css", "css");
        });

    });
});

var loadDirectory = function(dir, file) {
    fs.readdir(dir, function(err, files) {
        if (files && files.length) {
            var tagarray = dir.split("\\");
            var tagname = tagarray[tagarray.length - 1];
            db.addtag(tagname);
            for (var i = 0; i < files.length; i++) {
                if (path.extname(files[i]).toLowerCase() === '.jpg' || path.extname(files[i]).toLowerCase() === '.png' || path.extname(files[i]).toLowerCase() === '.gif' || path.extname(files[i]).toLowerCase() === '.webp') {
                    var src = dir + '\\' + files[i];
                    db.add({
                        name: path.basename(files[i]),
                        path: src,
                        tag: tagname
                    });
                    console.log({
                        name: path.basename(files[i]),
                        path: src,
                        tag: tagname
                    });
                }
            };
        };
    });
};

var loadFiles = function(files) {
    console.log(files);
    if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
            if (path.extname(files[i].path || files[i]).toLowerCase() === '.jpg' || path.extname(files[i].path || files[i]).toLowerCase() === '.png' || path.extname(files[i].path || files[i]).toLowerCase() === '.gif' || path.extname(files[i].path || files[i]).toLowerCase() === '.webp') {
                var src = files[i].path || files[i];
                db.add({
                    name: path.basename(files[i]),
                    path: src,
                    tag: 'default'
                });
                console.log({
                    name: path.basename(files[i]),
                    path: src,
                    tag: 'default'
                });
            }
        };
    };

};

ipcRenderer.on('openDirectory', function(event, directory) {
    if (directory && directory.length) {
        loadDirectory(directory[0]);
    }
});

ipcRenderer.on('openedFiles', function(event, arg) {
    if (arg && arg.length) {
        loadFiles(arg);
    }
});
