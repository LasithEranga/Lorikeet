'use strict';

const osenv = require('osenv');
const async = require('async');
const path = require('path');
const fs = require('fs');



function getUsersHomeFolder(){
    return osenv.home();
}

function getFilesInFolder(folderpath, cb){
    fs.readdir(folderpath, cb);
}

function inspectAndDescribeFile(filepath, cb){
    let result = {
        file:path.basename(filepath),
        path:filepath, type:''
    };
    fs.stat(filepath, (error, stat)=>{
        if(error){
            cb(error);

        }else{
            if(stat.isFile()){
                result.type = 'file';

            }
            if(stat.isDirectory()){
                result.type = 'directory';

            }
            cb(error,result);
        }
    });
}


function inspectAndDescribeFiles(folderpath, files, cb){
    async.map(files, (file, asyncCb)=>{
        let resolveFilePath = path.resolve(folderpath,file);
        inspectAndDescribeFile(resolveFilePath, asyncCb);
    }, cb);
}

function displayFile(file){
    const mainArea = document.getElementById('main-area');
    const template = document.querySelector('#item-template');
    let clone = document.importNode(template.content, true);
    clone.querySelector('img').src = `images/${file.type}.png`;
    clone.querySelector('.filename').innerText = file.file;
    mainArea.appendChild(clone);
}

function displayFiles(err, files){
    if(err){
        return alert('Sorry we could not find your files');
    }
    files.forEach(displayFile);
}
function main(){
    let folderpath = getUsersHomeFolder();
    getFilesInFolder(folderpath, (err, files)=>{
        if(err){
            return alert("Sorry we could not find your home");

        }
        inspectAndDescribeFiles(folderpath,files, displayFiles);
    });
}

main();