# SSH 配置笔记

其实我早就配好了..... 闲着无聊, 记记笔记.

最近看到一些人的服务器被不知名的黑阔尝试用暴力破解root密码, 于是想到还好的之前把服务器的 ssh 密码登录关掉了..

##### 关闭密码登录

把 `/etc/ssh/sshd_config` 里的这个`PasswordAuthentication` 改成 `no`就好了.

##### 生成密钥

生成密钥用 ssh-keygen 命令

```shell
ssh-keygen # 命令
# 参数: 
-b  # 指定密钥长度； 
-e  # 读取openssh的私钥或者公钥文件； 
-C  # 添加注释； 
-f  # 指定用来保存密钥的文件名； 
-i  # 读取未加密的ssh-v2兼容的私钥/公钥文件，然后在标准输出设备上显示openssh兼容的私钥/公钥； 
-l # 显示公钥文件的指纹数据； 
-N  # 提供一个新密语； 
-P  # 提供（旧）密语； 
-q  # 静默模式； 
-t  # 指定要创建的密钥类型。
```

一般来说我们只会用到其中几个参数, 比如`-t`, `-b`, `-f`, `-C`

比如我要专门对我的这台服务器生成一个密钥: 

```shell
ssh-keygen -t rsa -f ali_ssh_key -C '阿里云登录密钥'
```

运行后会询问你是否加密, 建议加密.

一般来说, 加密方式有 rsa和 dsa, 这两种方式, 我其实也不懂这两种加密方式有什么区别, 只是感觉大家都用的 rsa

把密钥存到文件 `ali_ssh_key`, 这会生成一对文件: 一个是 `ali_ssh_key` 保存着私钥, 另一个是 `ali_ssh_key.pub` 保存着公钥. ali_ssh_key.pub 里面, 最后一句就是 `-C`参数的内容, 用于方便自己区分密钥.



##### 将公钥加入到主机上

+ 手动加入到主机中

  复制公钥贴到云主机的 ~/.ssh/authorized_keys里面, 一行一个公钥.

+ 用 `ssh-copy-id`

  ```shell
  ssh-copy-id -i ali_ssh_key root@todoit.me # -p + 端口, 一般默认的就可以
  ```

  ssh-copy-id 其实干的事情是和上面说的手动改是一样的, 但是不用手动复制而已..



然后就可以不用密码愉快得登录主机了~~

### 但是

手里的服务器多了, 难免会觉得记不住域名或者每次都要输一长串域名,越来越不愉快了, 所以想着用什么办法解决一下这个问题.

## alias

最开始的时候, 我是用 alias 去解决重复输入域名或者 ip 的问题的.

比如我的这台阿里云服务器, 我这样写了一个 alias :

```shell
alias sshali='ssh root@todoit.me'
```

把这一句加到 `.bashrc` 或者 `.zshrc`里面去以后就可以很方便的输入 sshali 登录这台服务器了, 但是这样的话平时用 scp 上传下载东西的时候还是要输 ip 或者域名.

于是看到了 .ssh/config这个愉快的东西

### ssh config

`ssh config` 可以方便我们管理自己的密钥, 登录主机, 可以给主机起别名

这个配置, 需要放在自己的电脑上的`~/.ssh/config`里

例如

```shell
Host ali  						   # 主机名
    HostName todoit.me  			# 指定主机域名或者 ip 地址
    User root					    # 登录用户名
    Port 22					       # 主机 sshd 端口
    IdentityFile ~/.ssh/ali_ssh_key  # 登录验证的私钥
```

这样, 就能愉快地用`ssh ali`登录我的这个主机了.

对不同的主机, 用不同的私钥登录也是很方便的. 比如再生成一个密钥去登录腾讯云2333333

这样 scp 也可以直接用:

```shell
scp  helloworld.sh ali:/xxx/xxx
```

ssh 还有其他神奇的玩法了.. 我的玩法就到这里了..



### 参考

[ssh keys archlinux wiki](https://wiki.archlinux.org/index.php/SSH_keys_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))

[SSH 简化配置](https://gold.xitu.io/entry/5704cf8e71cfe4005dc76f18)

