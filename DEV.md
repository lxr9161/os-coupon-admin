## 项目说明

### 本地开发环境搭建
- 统一使用 vscode 编辑器
- 进到项目目录
- 安装npm包 命令: `npm install`
- 修改vue.config.js， 代理域名 `target` 值改为自己本地请求的域名 
- 修改.evn.development(改完后改文件请不要提交)， `VUE_APP_HOST` 值改为自己本地请求的域名
- 开启npm服务 命令: `npm run serve`

### 配置
> .env 和 .env.development 文件里的配置想说明

`VUE_APP_HOST ` api请求域名

### 部署方式
- 项目打包命令 `npm run build`
- git提交打包文件
> 打包文件位于 dist目录下，为部署方便，把打包的文件也放在代码库里了


### vue代码规范

#### **`代码规范很重要！！！`**

> 使用eslint验证代码格式，[参考链接](https://juejin.im/post/59097cd7a22b9d0065fb61d2#heading-8) 相关可查看.eslintrc 文件

* 缩进`2`空格
* 语句后不使用 `;`
* if条件遇到相等判断时使用 `===`
* vue文件使用驼峰命名，首字母小写，如果vue文件是组件则首字母大写
* 变量名使用以小写字母开头的驼峰
* ...

### 请求说明

> 使用 axios ，请求地址默认带有`/api`，转发到后端会自动去除`/api`。
> 配置信息可见 main.js
