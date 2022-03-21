# 优惠券小程序-管理后台
## 1.介绍
优惠券小程序控制后台。目前后台提供的功能: 
- 首页Banner管理 支持跳转其他小程序、跳转内部其他页面、H5页面(个人小程序不支持)
- 优惠券管理 
- 抽奖配置
- 小程序配置管理
## 2.本地开发环境搭建
- 统一使用 vscode 编辑器
- 进到项目目录
- 安装npm包 命令: `npm install`
- 修改vue.config.js， 代理域名 `target` 值改为自己本地请求的域名 
- 修改.evn.development(改完后改文件请不要提交)， `VUE_APP_HOST` 值改为自己本地请求的域名
- 开启npm服务 命令: `npm run serve`
### 2.1 配置
> .env 和 .env.development 文件里的配置想说明

`VUE_APP_HOST ` api请求域名

### 2.2 部署方式
- 项目打包命令 `npm run build`
- git提交打包文件
> 打包文件位于 dist目录下，为部署方便，把打包的文件也放在代码库里了


### 2.3 vue代码规范

#### **`代码规范很重要！！！`**

> 使用eslint验证代码格式，[参考链接](https://juejin.im/post/59097cd7a22b9d0065fb61d2#heading-8) 相关可查看.eslintrc 文件

* 缩进`2`空格
* 语句后不使用 `;`
* if条件遇到相等判断时使用 `===`
* vue文件使用驼峰命名，首字母小写，如果vue文件是组件则首字母大写
* 变量名使用以小写字母开头的驼峰
* ...

### 2.4 请求说明

> 使用 axios ，请求地址默认带有`/api`，转发到后端会自动去除`/api`。
> 配置信息可见 main.js

## 3.关联项目
- [小程序](https://github.com/lxr9161/os-coupon-miniprogram)
- [后端接口](https://github.com/lxr9161/os-coupon-api)

-----
开源版可能存在一些问题，欢迎吐槽。也欢迎大家做提出一些建议或意见。

技术交流可以扫码添加我个人的微信，也可以扫码进微信群
- 我个人的微信
<div>
  <img src="https://user-images.githubusercontent.com/13703050/155838542-d63fefb9-7f1a-4e46-a47c-745cbff62c36.JPG" width="250"/>
</div>

- 微信群
<div>
   <img src="https://user-images.githubusercontent.com/13703050/159154826-834f55e3-c886-4b37-812f-5ae0ce249f57.JPG" width="250"/>
</div>

