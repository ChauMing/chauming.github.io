# git子模块

### 前情提要

最近在开发中遇到了一个问题: 

 我的写的一个 thinkphp 项目, 这个项目是用 git 做版本控制的, 它依赖了一个github 上开源的php类库request, 本来我应该用 composer 去管理这些依赖的, 但是懒惰的我直接在我的项目clone 了这个项目.然后引入它进行使用

但是, 我在我的服务器上部署(直接从 github clone )这个项目的时候, 发生了一个问题: 

**找不到request这个类库了**

我检查了一下项目目录, 发现 request 的文件夹是在的, 不过所有的文件都不在文件夹里面

然而request的 .gitignore是在的, 我检查了一下它的.gitignore文件, 认为是.gitignore造成的问题, 然而, .gitignore只在我的项目目录下有效才对

于是我捉急的 google 了一下:  `git 仓库 里面 还有 仓库` 结果得到一堆无关的答案, 什么如何创建仓库之类的..

机智的我, 把关键字改了一改: `git repo containing git repo `

结果: ![search_result](http://www.todoit.me/static/search_result.png)

**~~我真是太机智了~~**

**为什么我在服务器clone整个repo时, 子模块没有被 clone 下来?**

**答案是: 当你在克隆这样的项目时，默认会包含该子模块目录，但其中还没有任何文件 **



### 以下是正文: 



### 什么是子模块?

在开发过程中, 我们经常遇到这样的问题: 你的项目目录中包含了其他的项目目录, 或许它是一个第三方库, 或者是你独立开发的, 那么现在问题来了：你想要把它们当做两个独立的项目，同时又想在一个项目中使用另一个怎么办?

Git 通过子模块来解决这个问题。 子模块允许你将一个 Git 仓库作为另一个 Git 仓库的子目录。 它能让你将另一个仓库克隆到自己的项目中，同时还保持提交的独立。





## 如何使用子模块?

#### 在一个repo中创建一个子模块

假定我们已经有一个主项目目录 major

我们可以通过

```shell
git submodule add <remote>
```

添加子模块

e.g: 

```shell
git submodule add git@github.com:GiantMing/sub.git
```

它会把子模块 clone 到当前项目目录下, 并添加`.gitmodules`

```shell
[submodule "sub"]
	path = sub
	url = git@github.com:GiantMing/sub.git
```

path 是子模块的目录, url 就是子模块的remote 地址了

**注意: `.gitmodules`受到版本控制的。也就是说它会和该项目的其他部分一同被拉取推送。 这就是克隆该项目的人知道去哪获得子模块的原因。**

如果你需要把子模块添加到其他目录: 

```shell
git submodule add git@github.com:GiantMing/sub.git /path/you/want
```

#### 提交子模块

如果我们运行

```shell
git add sub
git commit -m 'add sub'
```

会发现

```shell
[master e87194b] add sub
 2 files changed, 4 insertions(+)
 create mode 160000 sub
```

我们看到 sub 记录的是`160000` 模式。 这是 Git 中的一种特殊模式，它本质上意味着你是将一次提交记作一项目录记录的，而非将它记录成一个子目录或者一个文件。**这意味着sub 并不会像普通的文件一样被父级仓库 track **



#### 克隆含有子模块的项目

前面说到: 

> 当你直接 git clone 一个包含子模块的项目时, 默认会包含该模块的目录, 但不会包含任何文件.

那么怎么把子模块也 clone 下来?

你必须运行两个命令：`git submodule init` 用来初始化本地配置文件，而 `git submodule update` 则从该项目中抓取所有数据并检出父项目中列出的合适的提交。

```shell
$ git submodule init
Submodule 'sub' (git@github.com:GiantMing/sub.git) registered for path 'sub'

$ git submodule update
Cloning into 'sub'...
remote: Counting objects: 3, done.
remote: Total 3 (delta 0), reused 3 (delta 0), pack-reused 0
Receiving objects: 100% (3/3), done.
Checking connectivity... done.
Submodule path 'sub': checked out '274194fdaab92394a7c15cdac2f10561f7ac11ee'
```

现在 clone 下来的 repo 就和刚才提交上去的一样了

其实还有更加简单 clone 子模块的办法

```shell
git clone --recursive git@github.com:GiantMing/major.git
```

`--recursive`会自动初始化并更新仓库中的每一个子模块.



#### 拉取子模块的上游修改

进入子模块所在目录

```shell
git pull
```

如果你太懒了, 不想进到子模块里面去

```shell
git submodule update --remote <submodule-name>  # 不加<submodule-name> 的话默认更新全部
```

Git 将会进入子模块然后抓取并更新

此命令默认会假定你想要更新并 `checkout` 到子模块仓库的 `master` 分支。

如果你想换其他分支, 

```shell
git config -f .gitmodules submodule.<submodule-name>.branch <branch-name> 
# <submodule-name> <branch-name>
# 或者直接修改项目目录内的 .gitmodules
# 或
git config submodule.<submodule-name>.branch <branch-name> 
# 区别是 不带-f .gitmodules 只更改了你自己的~/.gitconfig 文件只对自己生效, 所以推荐第一种
```



```shell
[submodule "sub"]
	path = sub
	url = git@github.com:GiantMing/sub.git
	branch = <branch-name> # 这里是你想要的分支名
```

+ 查看子模块的 status

  如果你开启了`status.submodulesummary`

  ```shell
  git config status.submodulesummary 1 # 开启子模块更新摘要
  # 或者直接修改项目目录下.git/config
  # 加上
  [status]
  	submodulesummary = 1
  ```

  可以通过`git status`查看子模块的status



#### 发布子模块的变动

因为项目是依赖于子模块的, 所以你应该不会想主模块和子模块都提交了变动时主模块 push 上去, 而子模块保持你修改前的版本的

`git  push` 的` --recurse-submodules` 参数可以帮助你解决这种烦恼

` --recurse-submodules`有两个值 `check` 和 `on-demand`

例如: 

```shell
git push --recurse-submodules=check
```

会检查你的子模块是否有修改并且发布变动, 如果有修改但是没有发布出去, 本次 push 就会失败

同时, 它会建议你这样做

1. 进入到子模块的模块, 一个个`git push` 上去
2. 或者`git push --recurse-submodules=on-demand`

`on-demand`参数会在主模块推送更新之前推送掉子模块, 如果子模块推送失败, 则主模块也会推送失败



### 子模块技巧

+ 子模块遍历 `git submodule foreach`

  ```shell
  git submodule foreach 'git status'
  ```

  进入到子模块中运行`git status`





## 总结一下

说到了这里, 我们再回到文章的开头看看

子模块是: 

>  作为一个仓库子目录的仓库. 它能让你将另一个仓库克隆到自己的项目中，**同时还保持提交的独立.**

所以, 我们可以将子模块当做一个独立的仓库使用

但是, 为了别人用你的项目的时候, 很方便的 clone 项目, 用子模块应该是比较合适的处理方法



好像解决了我多年的问题:

+ github 上 的 repo里为什么会有灰色的打不开的文件夹?

  因为子模块默认是不传上去的







## 疑问

其实我还是有一个疑问的,

经过我反复的提交测试发现: 

如果子模块是一个空的 repo, 直接 clone 到主模块下, 然后进入子模块修改一些东西, 再提交主模块, 是会把子模块整个提交到仓库中的, 这算不算 git 的一个 bug ?

 (因为在其他情况下`git clone `, `git submodule add <submodulename>`都不能将子模块提交到 repo 中)



### 说在最后

折腾了大半天, 其实我最初的问题已经用最简单粗暴的方法解决了, ( 我把子模块整个 scp 到我的服务器上了

为什么不用 composer install , 服务器装了半天都没装上 composer ( wget 半天 get 不到....

感谢这个有包管理和版本控制的时代, maven, gem, composer, npm, yarn, 他们真的是很棒的东西,为我们处理了项目繁琐的库依赖, 和库升级带来的麻烦😛.