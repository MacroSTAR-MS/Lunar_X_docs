# 配置 AI 功能
Lunar X aichat插件 已支持 OpenAI ChatGPT/Google Gemini/DeepSeek模型，这些模型有不同的请求方式(但都支持OpenAI格式请求)，可能需要用户进行额外的配置。本文将指引你如何配置AI功能。
## 配置 OpenAI ChatGPT 
**1. 完成安装环境**

确保已经安装 OpenAI 库，可以在终端中输入以下命令以检查可用性：
```shell
pip show openai
```

如果已经安装，但是版本号小于 1.60.2 ，可以通过以下命令更新 OpenAI 库：
```shell
pip install --upgrade openai>=1.60.2 
```

如果提示 Error 可以通过以下命令安装 OpenAI 库：
```shell
pip install openai>=1.60.2 
```

如果提示网络问题，请使用镜像安装：
```shell
pip install openai>=1.60.2 -i https://pypi.tuna.tsinghua.edu.cn/simple
```

安装完成后即已经完成安装环境。

**2. 填写 API Key**

你需要 API Key 才能正常使用 ChatGPT 。我们使用了国内的中转 API 提供商提供的 ChatGPT 中转 API，因此用户******无需挂上代理******。

同时，我们的中转 API 提供商正在发放免费的 API Key ，您可以  [在这里直接免费获取](https://github.com/popjane/free_chatgpt_api) 。

获取到 API Key 之后，在 ```SetupWizard.pyw``` 中的 “AI 设置” 页面填写

![image](https://github.com/user-attachments/assets/c8419c0a-4fae-4d41-b8f6-b0e79f83bbc8)

成功应用设置后，你就可以开启你的 ChatGPT 畅聊之旅啦！

## 配置 Google Gemini
**1. 完成安装环境**

确保已经安装 google-generativeai 库，可以在终端中输入以下命令以检查可用性：
```shell
pip show google-generativeai
```

如果已经安装，但是版本号不是 0.7.2 ，可以通过以下命令替换 google-generativeai 库：
```shell
pip uninstall google-generativeai
pip install google-generativeai==0.7.2
```

如果提示 Error 可以通过以下命令安装 google-generativeai 库：
```shell
pip install google-generativeai==0.7.2
```

如果提示网络问题，请使用镜像安装：
```shell
pip install google-generativeai==0.7.2 -i https://pypi.tuna.tsinghua.edu.cn/simple
```

安装完成后即已经完成安装环境。

**2. 挂上代理**

简儿使用 Google 官方的 ```google-generativeai``` 库进行对话，因此在**中国大陆**的用户必须使用代理才能正常连接 Google Gemini 服务。

为了避免不必要的麻烦，请用户自行 [在网络上搜索](https://1-yuan.org/) 代理并配置。

因为代理造成的任何问题我们概不负责。

**3. 获取 API Key**

1. **登录 Google 账户**

注册前建议使用美国节点访问，登录到[Google 主页](https://www.google.com/)，右上角有个注册按钮。

![image015](https://github.com/user-attachments/assets/3147bffd-3412-4f05-8db7-9d810bc1ea4e)

2. **访问 “Google AI Studio”**

您可以[在此处](https://ai.google.dev/)找到该登陆页面。然后，点击 “Gemini API “标签或点击 “了解有关 Gemini API 的更多信息 “按钮。

![image016](https://github.com/user-attachments/assets/dfd02885-f013-451f-bb81-b545dab0d90a)

3. **点击 “在 Google AI Studio 获取 API 密钥”**

点击页面中央的按钮获取API秘钥

![image017](https://github.com/user-attachments/assets/e0e62423-4f42-4f0f-828f-d586cbffb3b9)

4. **审批服务条款**

页面会弹出一个窗口，要求您选择是否同意 Google API 服务条款和 Gemini API 附加服务条款。

您可以选择性地订阅电子邮件通知，以便获取Google AI的最新动态，并参与Google AI的特定研究项目，虽然这不是强制要求的。

![image018](https://github.com/user-attachments/assets/bf6fc7b9-e263-4f37-99dd-3c259470e4d1)

勾选第一个方框，其它方框也可以选择性的勾选，然后点击继续。

5. **创建API密钥**

现在您可以点击 “创建 API 密钥”

![image019](https://github.com/user-attachments/assets/c1d2171c-e26e-404f-a997-98b4da8a43cc)

然后，选择在新项目中或通过现有项目创建 API 密钥。

![image020](https://github.com/user-attachments/assets/584a1bf1-1f9c-43e9-ac83-0d03c951f42d)

选择其中一个选项后，API 密钥就会自动生成！

![image021](https://github.com/user-attachments/assets/f477ea54-8029-445f-ab87-570643099c71)

一定要谨记将此 API 密钥存储在安全的位置，以防止未经授权的访问。

**4. 填写 API Key**

获取到 API Key 之后，在 ```SetupWizard.pyw``` 中的 “AI 设置” 页面填写

![image](https://github.com/user-attachments/assets/5395ede4-9d78-496f-a02b-a344adba7db7)

成功应用设置后，你就可以开启你的 Gemini 畅聊之旅啦！

## 配置 DeepSeek
**1. 完成安装环境**

确保已经安装 OpenAI 库,DeepSeek支持OpenAI格式请求，可以在终端中输入以下命令以检查可用性：
```shell
pip show openai
```

如果已经安装，但是版本号小于 1.60.2 ，可以通过以下命令更新 OpenAI 库：
```shell
pip install --upgrade openai>=1.60.2 
```

如果提示 Error 可以通过以下命令安装 OpenAI 库：
```shell
pip install openai>=1.60.2 
```

如果提示网络问题，请使用镜像安装：
```shell
pip install openai>=1.60.2 -i https://pypi.tuna.tsinghua.edu.cn/simple
```

安装完成后即已经完成安装环境。

**2. 填写 API Key**

你需要 API Key 才能正常使用DeepSeek,可以去DeekSeek开发平台申请

获取到 API Key 之后，在 ```SetupWizard.pyw``` 中的 “AI 设置” 页面填写

![image](https://github.com/user-attachments/assets/c8419c0a-4fae-4d41-b8f6-b0e79f83bbc8)

成功应用设置后，你就可以开启你的 DeepSeek 畅聊之旅啦！
## 是否支持更多 AI 模型？

我们会在未来的更新中持续增加支持的模型，有望支持如Ch····LM 等模型，可以期待一波哦！

也欢迎各位大佬们更改Lunar的代码！(๑•̀ㅂ•́)و✧

## 疑问：我的代理需要一会儿开一会儿关吗？
**答：不需要，一直开着就好。**