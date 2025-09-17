# 快速开始
理论上全平台通用, 安装了 [Python](https://www.python.org) >= **3.12** 即可
## 部署
1. Clone 本仓库 (建议先 Fork / Use this template)

```shell
git clone https://github.com/MacroSTAR-MS/Lunar_Bot.git
```
2. 安装依赖  [requirements.txt](https://github.com/MacroSTAR-MS/Lunar_Bot/blob/main/requirements.txt)

```shell
pip install -r requirements.txt
```
国内服务器可使用清华源或者其他源，例如
```shell
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

3. 安装 **VC++**

有一些用户的 Windows 系统中可能没有 ```Visual C++ Redistributable``` 会导致 PySide6 报错：

```
from Shiboken6.Shiboken import
ImportError: DLL load failed while importing Shiboken: 找不到指定的模块
```

可以通过 [安装 Visual C++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170) 解决此类问题。

请注意，如果您的电脑系统是 Linux 或已经安装 ```Visual C++ Redistributable``` ，则无需重复安装或修复。

4. **配置设置**

启动设置向导

```shell
python SetupWizard.pyw
```

然后，打开 **核对并应用设置** 页面，点击 **应用** ，看到页面标题显示 “已成功保存” 即表面设置核验无问题，并已经保存。

若出现错误，请浏览下方的设置内容文本框找到报错详细信息，并根据报错提示修改您的配置。

**建议完成其中的每一个条目以确保程序能正常运行。**

> [!TIP]
> 
> Linux (没有桌面) 的用户可先在 Windows 上启动配置程序,保存配置后将根目录下的 ```appsettings.json``` ```config.json``` 和 ```prerequisites.py``` 复制到服务器即可


## 使用
1. 启动协议端

如果您是 Windows 用户，请双击 ```Lagrange.OneBot.exe```；

如果您是 Linux 用户，请在程序根目录处打开终端，运行
```shell
chmod +x ./Lagrange.OneBot
./Lagrange.OneBot
```

#### 登录协议端

首次打开协议端或者上次退出登录之后需要登录你的QQ账号。

请等待协议端的命令提示符窗口显示一个二维码，立即使用手机进行扫码登录，并勾选**下次自动登录**，即可完成机器人QQ账号绑定。

#### 退出登录协议端

请关闭浅月和协议端的命令提示符窗口，然后在QQ机器人的根目录下，删除所 ```ketstore.json``` 文件，即算作退出登录。下次启动协议端，请参照上一点进行登录。

2. 启动主程序

在 ```SetupWizard.pyw``` 中打开 **核对并应用设置** 页面，点击 **启动吧，我的浅月！** 即可启动主程序。**注意不要关闭主程序和协议端的命令提示符窗口**

或者，您也可以在程序根目录打开终端，并执行：
```shell
python main.py
```
看到 ℹ️ INFO 成功建立连接 的日志，即表明与协议端对接成功。

ℰ𝓃𝒿ℴ𝓎 It!