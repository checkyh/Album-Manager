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
    db.filtered_list().then(function(result) {
        for (var i = 0; i < result.length; i++) {
            var valueid = i + 1;
            var item = "<option value=\"" + valueid + "\">" + result[i].path + "</option>";
            document.getElementById('header').innerHTML += item;
        }
        loadjscssfile("node_modules/materialize-css/dist/css/materialize.css", "css");
        loadjscssfile("node_modules/hammerjs/hammer.js", "js",function(){
          loadjscssfile("node_modules/materialize-css/dist/js/materialize.js", "js", function() {
              loadjscssfile("node_modules/select.js", "js")
          });
        });


    });
});
window.$(document).on("click",".carousel-item",function(){
  window.location.href="./result.html";
})
