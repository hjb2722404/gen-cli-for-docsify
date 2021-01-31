# gen-cli-for-docsify

这是一个用来为`docsify`自动生成站点侧边栏和项目更新日志的命令行工具

## 安装方法

```
$ npm install gen-cli-for-docsify -g

## 使用方法

### 生成侧边栏

```
$ gen sidebar doc
```

### 生成更新日志页面

```
$ gen log doc
```

#### 配置日志文件与格式

支持从多个不同格式的日志文件生成统一的版本日志细览页。

##### 配置支持：
* `package.json` 中新增名为 `'gen-cli-for-docsify'` 的属性
* `.gen-cli-for-docsifyrc` 配置文件
* `.gen-cli-for-docsifyrc.json` 或者 `.gen-cli-for-docsifyrc.yaml` 或者 `.gen-cli-for-docsifyrc.js` 或 `.gen-cli-for-docsifyrc.cjs` 文件
* 遵循 `CommonJS` 模块化规范导出一个对象的 `gen-cli-for-docsify.config.js` 文件 或 `gen-cli-for-docsify.config.cjs` 文件


##### 配置项

* `versionSrc`: 数组，日志文件源文件列表，每一个成员对象有以下属性：
  * `fileName`: 文件名
  * `versionReg`: 版本名称匹配符，程序最终会使用 `/^versionReg\s+/gi` 正则来匹配日志文件中的版本名称
  * `dateReg`: 日期正则，程序最终会使用 `/dateReg/gi` 来匹配日志文件中的日期标题

* `versionTarget` : 最终生成的版本细览页名称，要求以`.html`  扩展格式结尾
