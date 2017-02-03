# 为什么我的跨域 AJAX 发了两个请求?

最近在做一个 VUE 的项目的时候, 和后端的小伙伴对接口, 想方便开发, 于是要求后端的小伙伴在所有的接口都加上跨域的许可 (Access-Control-Allow-Origin)

(后来事实证明这不是一个很好的解决方案, 因为 vue-cli 提供了 proxy-table 作为 AJAX请求的代理, 只需要配置一下就好, 编译上线也不要改动代码)

however, 经过这次折腾, 学到了preflight request的姿势



## preflight request 预请求

当你在跨域的情况下发送一个非**简单请求**时:

**浏览器预先发送一个 OPTIONS 请求, 来查明这个跨站请求对于目的站点是不是安全可接受的** 当服务端对 OPTIONS 请求返回表示支持跨域请求的 Origin, method, headers 时, 浏览器才会发送你所需要的真正的跨域请求

##### 什么是简单请求

+ 只使用 GET, HEAD 或者 POST 请求方法。如果使用 POST 向服务器端传送数据，则数据类型 (Content-Type) 只能是 `application/x-www-form-urlencoded`, `multipart/form-data 或 text/plain`中的一种。
+ 不包含自定义请求头



##### 举个栗子🌰

###### 1. 发送预请求

我实际向服务端提交一个跨域的POST 请求, 请求的 Content-Type 是application/json, 这是一个非简单请求, 所以浏览器会发送一个 method 为 OPTIONS的预请求, 到服务端查询是否支持该跨域请求

请求信息: 

```
Request URL: http://stu.dev/post
Request Method:OPTIONS
Access-Control-Request-Headers:content-type
Access-Control-Request-Method:POST
Origin:http://localhost:8080
```

OK, 注意后面三行 

`Access-Control-Request-Headers`: 在发出预检请求时带有这个头信息, 告诉服务器在实际请求时会使用的请求方式

`Access-Control-Request-Headers`: 在发出预检请求时带有这个头信息, 告诉服务器在实际请求时会携带的自定义头信息. 如有多个, 可以用逗号分开.

`Origin`:  表明发送请求或者预请求的域

###### 2. 服务端响应预请求

```
Access-Control-Allow-Headers:Content-Type
Access-Control-Allow-Origin:*
Allow:GET,HEAD,POST
```

服务端需要对预请求里对应的三个头进行响应: 

`Access-Control-Allow-Headers:Content-Type`: 表明服务端支持该跨域请求(实际请求)的请求头, 对应预请求里的`Access-Control-Request-Headers:content-type`

`Access-Control-Allow-Origin:*`: 表明服务端支持跨域响应的域, 对应对应预请求里的`Origin`

`Allow:GET,HEAD,POST` 表明服务端支持该跨域请求的 Method

**预请求的所有跨域头得到允许以后(及以上三个请求头一一对应), 浏览器才会发送实际请求, 所以服务端要根据预请求响应这三个请求头**

###### 3. 发送实际请求.

###### 4. 响应实际请求.



## 最后

### 解决办法

如果你的跨域请求失败, 原因是预请求得不到正确响应

1. 检查预请求, (那个 options 请求)的三个请求头`Origin`, `Access-Control-Allow-Headers`, `Access-Control-Request-Method`

2. 服务端分别加上

   `Access-Control-Allow-Origin: <预请求的 Origin 内容 | * >`, 

   `Access-Control-Request-Headers:<预请求的Access-Control-Request-Headers内容>`

   `Allow:<预请求的Access-Control-Request-Method的内容>`

   这几个响应头



over.

