let fs = require('fs');
var path = require('path');
let root_path = process.argv[2];
let w_file = '_sidebar.md';
let cosmiconfig = require('cosmiconfig');
let config;
let explorer = cosmiconfig.cosmiconfig('gen-cli-for-docsify')
explorer.search().then( result => {
    config = result.config;
    let w_content = getAllFiles(root_path);
    writeLine(w_content); 
}, err => {
    console.log('读取配置文件出错：');
    console.log(err);
});

function getAllFiles(root) {
    var res = [], 
        files = fs.readdirSync(root);
    files.forEach(function(file){
        let pathname =  root + '/' + file,
            stat = fs.lstatSync(pathname);
        if (isExcludeFile(file)) {
            return;
        }
        if (!stat.isDirectory()) {
            docTitle = file.replace('.md', '').replace(/\u0020/gi,'-').replace(/\u200b/gi,'-').replace(/\u3000/gi,'-');
            tmpname = '  * [' + docTitle + '](' + root + '/' + docTitle + '.md)',
            res.push(tmpname.replace(root_path, ''))
        } else {
            let categoryName = getCat(file);
            tmpname = '* ' + categoryName;
            res.push(tmpname.replace(root_path, ''));
            res = res.concat(getAllFiles(pathname));
        }
    });
    return res;
}

function isExcludeFile(file){
    let excludeFiles = config.excludeFiles;
    return excludeFiles.indexOf(file) > 0;
}

function getCat(dir){
    return config.catMap[dir] || '未分类';
}

function writeLine(line){
    line = line.join('\n');
    fs.readFile(root_path + '/' + w_file, function(err,data){
        if (err && err.errno == 33) {
            fs.open(root_path + '/' + w_file, 'w', 0666, function(e, fd){
                if (e) throw e;
                fs.write (fd, line, 0, 'utf8', function(e){
                    if(e) throw e;
                    fs.closeSync(fd);
                })
            })
        } else {
            fs.writeFileSync(root_path + '/' + w_file, line, function(e){
                if(e) throw e;
            });
        }
    });
}

function readFirstLine(filename) { 
    let rs = '';
    var fd = fs.openSync(filename, 'r');
    var bufferSize = 1024;
    var buffer = new Buffer(bufferSize);
    
    var leftOver = '';
    var read, line, idxStart, idx;
    index = 1;
    while ((read = fs.readSync(fd, buffer, 0, bufferSize, null)) !== 0) {
      leftOver += buffer.toString('utf8', 0, read);
      idxStart = 0;
      while ((idx = leftOver.indexOf("\n", idxStart)) !== -1) {
        line = leftOver.substring(idxStart, idx);
        if ( index === 1) {
            rs = line;
            fs.closeSync(fd);
            return rs;
        } else {
            return;
        }
      }
      leftOver = leftOver.substring(idxStart);
    }
}


