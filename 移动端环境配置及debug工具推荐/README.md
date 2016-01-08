# 移动端切图环境配置(工具推荐)
  
   随着移动端页面的需求越来越大，作为页面仔的我，不得不面对移动端页面的**大坑**，因为最近准备要写一个微信端h5的页面，然而我已经有一个多月的时间没有写过前端的东西了，所以我着手做了一下移动端切图的准备。总结了一些方法(其实就是推荐一些工具而已)

   下面就困扰页面仔的两个问题进行说明：

  - 视觉设计图px与rem的相互转换
	
	手机端屏幕分辨率** 千奇百怪 ** 手机厂商个dpr也各不相同，作为一个页面仔的我，被视觉姐姐用刀架在脖子上要求实现和设计图纸尽可能的一样的页面。** 使用rem作为单位势在必行 **

	- 使用<a href="https://github.com/amfe/lib-flexible">flexibleJs</a>
	  只需在html里引入 ` flexible.js `文件，原理不多介绍，可自行百度。

	    它让移动端页面中1rem总是等于宽度的十分之一，也就是说 `10rem`就是全屏（好像是废话）。

	    比如`iphone6`的实际分辨率是`375px`， `dpr`是`2`所以物理分辨就是`750px`，所以这个时候页面中`1rem`就是`75px`，

	    如果从视觉那里拿到了一张宽度是`750px`的设计稿，我们用在电脑上用`markman`量得一个`div`块的宽度是`375px`，那么在页面中我们需要把375px转化成rem是多少呢？

	    老夫掐指一算，`1rem == 75px,375px == 5rem` OK我们只需要这样：`div{width:5rem;}`，

	    有了`flexibleJs`无论在什么分辨率的手机上我们得到的这个div块总是等于屏幕的一半宽的，这部就是我们想要的结果吗？
	  
	- <a href="https://www.npmjs.com/package/px2rem">px2rem</a>
	  像上面一样，我们需要把量得的px转化成rem，老是自己计算转换挺累的，于是，所以我们可以用px2rem这个工具去帮我们把css中的px转换成rem，使用px2rem可以把px按设定的比例转换成rem.
	  使用方法.

		` npm install px2rem -g // 安装px2rem`

		`px2rem build test.css -u 75 // 将test.css中的px转换成rem比例为75：1，编译完成后的css输出到test.debug.css中`
		
	  默认的75的缩放，就是说在test.css中width:75px编译完了在test.debug.css中得到的就是1rem。

	  如果不想将test.css中的所有px转换成rem只需在后面添加一个注释` /*px*/ `(文字不推荐用rem，因为会有模糊的情况)px2rem的更多用法点<a href="https://www.npmjs.com/package/px2rem">这里</a>
	


  - 移动端页面的测试环境
  	不得不说一下移动端的测试，举例几个手机端调试页面的工具

  	- chrome devtools上的那个小手机
		这个不说了，是个前端都会这个。。。

	- chrome 远程调试
		这个方法我觉得太麻烦了，并不推荐，而且我尝试过，没有成功，也没看到谁成功使用过这种方法，如果你非要用，<a href="http://blog.csdn.net/freshlover/article/details/42528643">点这里</a>

	- vps上传调试
		我不懂该如何命名这个方法，把页面上传到vps上，用手机端访问。。有vps的可以试试，这个方法还是可以接受的，但是首先，你要有一个vps

	- <a href="http://www.browsersync.cn/">Browsersync</a>
		上面bb那么多，其实我主要就是想推荐这个工具。

		顾名思义，它浏览器同步工具，它是依赖于nodejs的工具，启动服务后，在局域网内建立起一个基于socket的服务，手机端和电脑处在同一个局域网下（比如，在网校连着同一个wifi，或者电脑开了个热点手机用）就可以使用。

		它会自动监听所有文件的变动，然后自动刷新页面，它不仅可以用作手机端的调试，还可以作为一个类似于sublime和chrome上使用的livereload插件实时刷新页面，

		简单好用，让我们开始吧：

		+ 安装
			` npm install browser-sync`

			win党安装这个包的时候可能会出问题，原因可能是缺少Visual C ++ 运行时库。

		+ 在项目根目录下启动服务
			` browser-sync start --server --files="*"`

			开始启动服务，并监听所有文件的变动。

			命令运行以后，会自动使用你的默认浏览器打开index.html页面，并在cmd里返回几个可接入的ip地址，手机端访问UI External的那个ip就可以了，当你改动了文件，就会刷新页面
			<a href="http://www.browsersync.cn/docs/command-line/">更多使用方法</a>

			有没有简单好用？  （斜眼

** 上面介绍了几个工具，感觉挺好用的，但是要用命令行啊，写代码打开那么多小黑窗还要输命令，我整个人都*&……￥%& 了，为了简化工作，下面介绍两种方法：**
## gulp grunt webpack等前端构建工具
构建前端构建工具这东西真是不好玩，学了一个过几个月就不流行了。。。

拿gulp举例，
目录结构：
			├─less
			└─public
			 &nbsp;&nbsp;     ├─css
			 &nbsp;&nbsp;     ├─images
			 &nbsp;&nbsp;     └─js

gulpfile.js:
启动browsersync服务，监听所有文件，less文件改动时，自动编译，补全前戳，px->rem修改rootValue可以修改px转换成rem的比例

	var gulp = require("gulp"),
		path = require("path"),
		px2rem = require("gulp-px2rem"),

		// browserSync
		browserSync = require('browser-sync').create(),
		reload = browserSync.reload,

		// require less的编译，及使用autoprefix的自动补全前戳
		less = require("gulp-less"),
		LessPluginAutoPrefix = require('less-plugin-autoprefix'),
	    autoprefix= new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });

		// 监听文件改动
		gulp.task("default", function() {
			browserSync.init({
				server: {
					baseDir: "public"
				}
			});
			gulp.watch("less/*.less", ["styles"]);
			gulp.watch("public/*.html").on("change", reload);
			gulp.watch("public/css/*.css").on("change", reload);
			gulp.watch("public/images/*.jpg").on("change", reload);
			gulp.watch("public/images/*.png").on("change", reload);
		});

		// gulp.task("browser-sync", function() {
			
		// });

		gulp.task("styles", function() {
			return gulp.src("./less/*.less")
				.pipe(less({
					plugins: [autoprefix]
				}))
				.pipe(px2rem({replace: true, rootValue: 75}))
				.pipe(gulp.dest("./public/css"));
		});

直接在命令行输入gulp以上服务就可以启动了


gulp确实很不错,但是写写就忘了，各种查插件的用法。有时我们并不需要这么多功能,不如我们把这些命令放在sublime 的build-system里面试试

## 将px2rem less browser-sync集成到sublime的build-system中

最近看了sublime的build-system的<a href="http://sublime-text.readthedocs.org/en/latest/reference/build_systems.html">文档</a>，发现它很强大，以前用来编译nodejs都是查教程的，没自己写过build-system
less&px-css&rem.sublime-build:
	
	{
		"cmd": ["lessc", "$file", ">", "${file_path}/${file_base_name}.css", 
			"&", "px2rem", "build", "${file_path}/${file_base_name}.css", "-u", "64"],
		"file_regex": "^[ ]*File \"(...*?)\", line ([0-9]*)",
		"encoding": "utf-8",
		"shell": true,
		"variants":
		[
			{
				"name": "scale-75",
				"cmd": ["lessc", "$file", ">", "${file_path}/${file_base_name}.css", 
					"&", "px2rem", "build", "${file_path}/${file_base_name}.css", "-u", "75"],
			},
			{
				"name": "scale-108",
				"cmd": ["lessc", "$file", ">", "${file_path}/${file_base_name}.css", 
					"&", "px2rem", "build", "${file_path}/${file_base_name}.css", "-u", "108"],
			},
		]
	}

可以將写好的xxx.less，ctrl+b一键编译到xxx.debug.css里面，默认比例64，支持64 75 108三种比例，ctrl+shift+b可以选择

browserSync.sublime-build:

	{
	"cmd": ["browser-sync", "start", "--server", "--files='$file_path/*'"],
	"shell":true
	}

在index.html按ctrl+b，启动服务

sublime插件和编译系统简直好用的不要不要的,顺便推荐一个aotuprefixer插件自动补全前戳(呃..gulp也有)
<a href="https://packagecontrol.io/browse">更多插件</a>

