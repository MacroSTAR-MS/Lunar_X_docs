# Lunar X 框架基础配置与用户组管理文档

## 一、 文件结构与存储位置

Lunar X 框架的配置信息在两个文件中，实现了核心配置与权限配置的分离。

| 文件名 | 存储内容 | 存储位置 |
| :--- | :--- | :--- |
| **`config.json`** | 框架核心参数、连接设置、Bot 身份信息、日志设置，以及**最高权限用户（Root User）**。 | 框架运行目录根目录 |
| **`admin114.json`** | 框架的**超级用户列表**和**管理员用户列表**。 | 框架运行目录根目录 |

---

## 二、 `config.json` 核心配置详解

`config.json` 包含了 Bot 运行所需的全局性、基础性参数。

| 配置项 | 类型 | 描述 | 示例值 |
| :--- | :--- | :--- | :--- |
| `bot_qq` | `int` | **Bot 自身的 QQ 号。** 框架用于识别自身身份。 | `123456789` |
| `token` | `str` | **连接令牌。** 用于 Bot 连接 WebSocket 服务器时的身份验证。 | `"114514"` |
| `ws_server` | `str` | **WebSocket 服务器地址。** Bot 将连接到此地址以接收消息和发送指令（通常是 OneBot 客户端地址）。 | `"ws://127.0.0.1:3803"` |
| `trigger_keyword` | `str` | **命令触发符。** 用户输入以此字符开头时，框架会尝试解析为命令。 | `"$"` |
| `root_user` | `int` | **框架的最高权限用户 ID。** 仅此一人，拥有对框架的绝对控制权。 | `1348472639` |
| `bot_name` | `str` | Bot 的中文名称。 | `"Lunar X"` |
| `bot_name_en` | `str` | Bot 的英文名称。 | `"Lunar X"` |
| `log_level` | `str` | 日志输出级别（如 `INFO`, `DEBUG`, `WARNING`）。 | `"INFO"` |
| `auto_reload_plugins` | `bool` | 是否开启插件自动重载功能。 | `true` |

### 示例 (`config.json`)

```json
{
  "auto_reload_plugins": true,
  "bot_name": "Lunar X",
  "bot_name_en": "Lunar X",
  "bot_qq": 123456789,
  "log_level": "INFO",
  "root_user": 1348472639,
  "token": "114514",
  "trigger_keyword": "$",
  "ws_server": "ws://127.0.0.1:3803"
}
```

---

## 三、 `admin114.json` 用户组配置详解

`admin114.json` 文件专门用于定义除 `root_user` 之外的权限用户列表。

### 权限等级划分

权限等级由高到低大致为：

1.  **Root User** (`config.json` -> `root_user`)：最高权限。
2.  **Super Users** (`admin114.json` -> `super_users`)：次高权限，通常可执行大部分管理命令。
3.  **Manager Users** (`admin114.json` -> `manager_users`)：普通管理权限，通常用于群管理或特定功能管理。

### 配置项说明

| 配置项 | 类型 | 权限等级 | 描述 |
| :--- | :--- | :--- | :--- |
| `super_users` | `List[int]` | 次高 | **超级用户 QQ 号列表。** 拥有对 Bot 的高级控制权。 |
| `manager_users` | `List[int]` | 中 | **管理员用户 QQ 号列表。** 拥有对 Bot 的中级控制权。 |

### 示例 (`admin114.json`)

```json
{
  "manager_users": [
    114514,  // 示例：普通管理员 114514
    84450   // 示例：普通管理员 84450
  ],
  "super_users": [
    2473768771 // 示例：超级用户 夏辉
  ]
}
```

---

## 四、 基础配置流程总结

要成功启动并配置 Lunar X 框架，您需要完成以下步骤：

1.  **配置 `config.json`：**
    *   将 `bot_qq` 更改为您的 Bot 实际 QQ 号。
    *   根据您的 OneBot 客户端配置，设置正确的 `ws_server` 和 `token`。
    *   将 `root_user` 设置为您本人的 QQ 号。
3.  **启动框架：** 确保 OneBot 客户端（如 Go-CQHttp）已启动并连接到 QQ 服务器，然后启动 Lunar X 框架。框架将尝试连接到 `ws_server` 地址。
如果你配置的正常，应该可以看到如下日志:
[2025-09-27 07:01:45.485] ℹ️ INFO 尝试连接至WebSocket服务器 ws://127.0.0.1:3803(尝试 1/5)
[2025-09-27 07:01:45.553] ✅ SUCCESS WebSocket连接成功