let fs = require('fs');
let cosmiconfig = require('cosmiconfig');
let root_path = process.argv[2];
let w_file;
let config;
let data = [];
let contentData = [];
let explorer = cosmiconfig.cosmiconfig('gen-cli-for-docsify')
explorer.search().then( result => {
    config = result.config;
    w_file= config.versionTarget;
    getData(config.versionSrc).then(function() {
        contentData = data;
        let contentStr = getContentStr(contentData);
        let w_content = getContent(contentStr);
        writeLine(w_content);
    });
}, err => {
    console.log('读取配置文件出错：');
    console.log(err);
});
let w_file_header = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>更新日志</title>
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <link rel="stylesheet" href="./layui/css/layui.css"  media="all">
  
  <!-- 注意：如果你直接复制所有代码到本地，上述css路径需要改成你本地的 -->
  <style>
    body {
        padding-left:30px;
        padding-top: 30px;
    }
  </style>
</head>
<body>
    <h1>更新日志</h1>
    <div id="content">`;

let w_file_footer = `</div>
<script src="./layui/layui.js" charset="utf-8"></script>
</body>
</html>`;


function writeLine(line){
    fs.readFile(root_path + '/' + w_file, function(err,data){
        if (err && err.errno == 33) {
            fs.open(root_path + '/' + w_file, 'w', 0o666, function(e, fd){
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

function getContentData(version) {
    let filename = version.fileName;
    let versionReg = version.versionReg;
    let dateReg = version.dateReg;
    return new Promise((resolve, reject) => {
        let versionIndex = -1;
        let dateIndex = 0;
        var fd = fs.openSync(filename, 'r');
        var bufferSize = 1024;
        var buffer = Buffer.alloc(bufferSize);
        
        var leftOver = '';
        var read, line, idxStart, idx;
        let index = 1;
        while ((read = fs.readSync(fd, buffer, 0, bufferSize, null)) !== 0) {
          leftOver += buffer.toString('utf8', 0, read);
          idxStart = 0;
          while ((idx = leftOver.indexOf("\n", idxStart)) !== -1) {
            line = leftOver.substring(idxStart, idx);
            let vReg = new RegExp('^' + versionReg + '\\s+', 'gi');
            if (vReg.test(line)){
                let versionTitle = line.split(versionReg)[1].trim();
                let version = [];
                version.push(versionTitle);
                data.push(version);
                versionIndex++;
                dateIndex = 0;
            } else {
                let dReg = new RegExp(dateReg, 'gi');
                if (dReg.test(line)) {
                    let dateTitle = line.replace(/\D/g,'').replace(/-/gi,'').trim();
                    let dateTitleArr = dateTitle.split('');
                    dateTitleArr.splice(4, 0, '年');
                    dateTitleArr.splice(7, 0, '月');
                    dateTitleArr.splice(10, 0, '日');
                    let dateRecord = [];
                    dateRecord.push(dateTitle);
                    dateRecord.push([]);
                    data[versionIndex].push(dateRecord);
                    dateIndex++;
                } else {
                    if (versionIndex >=0 && dateIndex >=0) {
                        let record = line.trim();
                        if (record !== '' && data && data[versionIndex] && data[versionIndex][dateIndex] && data[versionIndex][dateIndex][1]) {
                            record = filterRecord(record);
                            data[versionIndex][dateIndex][1].push(record);
                        }
                    }
                }
            }
            idxStart = idx + 1;
            index++;
          }
          leftOver = leftOver.substring(idxStart);
        }
        resolve(data);
    });   
}

function filterRecord(record) {
    return record
            .replace(/^\s*-\s*/gi,'')
            .replace(/^\s*\*\s*/gi, '')
            .replace(/\*{2}[^\*]*:\*{2}\s*/gi,'')
            .replace(/\(\[\]\([^\)]*\)\)$/gi,'');
}

function getContent(contentStr){
    return w_file_header + contentStr + w_file_footer;
}

function getContentStr(contentData){
    let data = contentData;
    let versionHtmlStr = '';
    for(let i=0; i < data.length; i++) {
        let version = data[i];
        if (version.length === 1) {
            continue;
        }
        versionHtmlStr += '<div class="version">';
        for(let j=0; j<version.length; j++){
            let versionItem = version[j];
            if (versionItem.length === 2 && !versionItem[1].length) {
                continue;
            }
            if(j ===0) {
                versionHtmlStr += '<fieldset class="layui-elem-field layui-field-title" style="margin-top: 30px;">';
                versionHtmlStr += `<legend>${versionItem}</legend>`;
                versionHtmlStr += '</fieldset>';
                versionHtmlStr += '<ul class="layui-timeline">';
            } else {
                for (let m=0; m < versionItem.length; m++) {
                    let dateRecord = versionItem[m];
                    if (m ===0){
                        versionHtmlStr += '<li class="layui-timeline-item">';
                        versionHtmlStr += '<i class="layui-icon layui-icon-time"></i>';
                        versionHtmlStr += '<div class="layui-timeline-content layui-text">';
                        versionHtmlStr += `<h3 class="layui-timeline-title">${dateRecord}</h3>`;
                        versionHtmlStr += '<ul>';
                    } else {
                        for (let n = 0; n < dateRecord.length; n++) {
                            let record = dateRecord[n];
                            versionHtmlStr += `<li>${record}</li>`;
                        }
                        versionHtmlStr += `</ul>
                                </div>
                            </li>`;
                    }
                }
                
            }
        }
        versionHtmlStr += '</ul>';
        versionHtmlStr += '</div>';
    }
    return versionHtmlStr;
}

function getData(versions) {
    return new Promise((resolve, reject) => {
        let versionLength = versions.length;
        versions.forEach(version => {
            getContentData(version).then(function(data){
                versionLength--;
                if (versionLength ===0 ) {
                    resolve(data);
                }
            });
        });
    })
}
 