const cpFile = require('cp-file').sync;
const {cwd, exists, pwd, resolve} = require('../lib/util')
let path = '';
path = cwd(path || '.')
const target = file => resolve(path, file)
const layuijs = exists(cwd('layui/layui.js')) || pwd('layui/layui.js')
const layuicss = exists(cwd('layui/css/layui.css')) || pwd('layui/css/layui.css')
const fontEot = exists(cwd('layui/font/iconfont.eot')) || pwd('layui/font/iconfont.eot')
const fontSvg = exists(cwd('layui/font/iconfont.svg')) || pwd('layui/font/iconfont.svg')
const fontTtf = exists(cwd('layui/font/iconfont.ttf')) || pwd('layui/font/iconfont.ttf')
const fontWoff = exists(cwd('layui/font/iconfont.woff')) || pwd('layui/font/iconfont.woff')
const fontWoff2 = exists(cwd('layui/font/iconfont.woff2')) || pwd('layui/font/iconfont.woff2')
cpFile(layuijs, target('doc/layui/layui.js'));
cpFile(layuicss, target('doc/layui/css/layui.css'));
cpFile(fontEot, target('doc/layui/font/iconfont.eot'));
cpFile(fontSvg, target('doc/layui/font/iconfont.svg'));
cpFile(fontTtf, target('doc/layui/font/iconfont.ttf'));
cpFile(fontWoff, target('doc/layui/font/iconfont.woff'));
cpFile(fontWoff2, target('doc/layui/font/iconfont.woff2'));
