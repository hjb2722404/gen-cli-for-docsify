#!/usr/bin/env node

const program = require('commander');

program
    .usage('<command> [docsify文档目录名称]')
    .version(require('../package.json').version)
    .command('sidebar', '生成侧边栏文件')
    .command('log', '生成更新日志')
    .command('style', '生成更新日志时间轴样式')
    .parse(process.argv)