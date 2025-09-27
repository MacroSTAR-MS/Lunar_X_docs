# Lunar X 插件规范文档


本文档基于 Lunar X 框架的源代码整理，详细描述了插件的开发规范、事件模型、消息处理机制、用户权限管理以及可用的 Bot API 接口，旨在作为全面的开发者参考手册使用。

## 目录

1.  插件基础与元数据
2.  事件处理核心函数与流程
3.  消息事件处理与内容获取 (重点)
4.  消息段构造与发送 (`lunar.msg`)
5.  LunarBot API 接口 (`lunar` 对象)
6.  权限管理与用户组判断 (重要)
7.  事件类型完整列表


## 一、 插件基础与元数据

插件通常是一个 Python 文件（`.py`）或包含 `setup.py` 的目录，位于 `plugins` 文件夹内。

### 1. 插件元数据（必须在插件文件中定义）

| 参数名 | 类型 | 必须 | 描述 | 示例值 |
| :--- | :--- | :--- | :--- | :--- |
| `TRIGGHT_KEYWORD` | `str` | 是 | 插件的触发关键词。如果消息以 Bot 配置的触发符 + 该关键词开头，则触发插件。设置为 `'Any'` 则对所有事件（包括非消息事件）都进行触发。 | `'help'`, `'Any'`, `'天气'` |
| `PLT_ST` | `int` | 否 | 插件的优先级。数字越小，优先级越高，越早处理事件。**默认值为 `999`**。 | `10`, `100`, `999` |
| `HELP_MESSAGE` | `str` | 否 | 插件的帮助信息，用于 Bot 的帮助命令展示。 | `'查询当前城市天气'` |

### 2. 插件生命周期与事件处理函数

插件通过实现以下异步函数来响应事件：

| 函数名 | 参数签名 | 描述 | 返回值 |
| :--- | :--- | :--- | :--- |
| `on_message` | `async def on_message(event: Event, lunar: LunarBot)` | **主要事件处理函数。** 当事件满足 `TRIGGHT_KEYWORD` 定义的触发条件时被调用。 | `bool`。返回 `True` 表示事件已被处理并**阻断**后续插件继续处理；返回 `False` 或不返回则事件继续传递。 |
| `on_lunar_event` | `async def on_lunar_event(event: Event, lunar: LunarBot)` | **框架事件处理函数。** 专门用于处理框架级别的生命周期事件，如 `LunarStartListen` 和 `LunarStopListen`，以及所有非消息事件（如通知、请求）。 | `bool`。返回 `True` 表示事件已被处理并**阻断**后续插件继续处理。 |

## 二、 事件处理核心函数与流程

### 1. 事件处理流程

1.  **消息预处理：** 检查消息是否以 Bot 配置的 `trigger_keyword`（例如 `/`）开头。
2.  **命令解析：** 如果是命令，解析出 `event.command` 和 `event.args`。
3.  **插件筛选：** 插件管理器遍历所有已加载插件，检查 `TRIGGHT_KEYWORD` 是否匹配。
4.  **优先级排序：** 按 `PLT_ST` 优先级（数字越小越优先）排序。
5.  **调用 `on_message`：** 按顺序调用插件的 `on_message` 函数。
6.  **阻断机制：** 如果任何插件的 `on_message` 返回 `True`，则事件处理停止，后续插件不再被调用。

> [!Tip]
>当插件为永久触发插件(即TRIGGHT_KEYWORD为Any)，请务必通过if isinstance(event, Events.事件类型):来判断是否你需要的事件，防止报错，具体事件类似有哪些请参考下文[事件类型完整列表](#七-事件类型完整列表)


### 2. 日志记录（推荐方式）

**Lunar X 框架会自动重定向插件内的 `print()` 函数**，但推荐使用 `lunar.plugin_logger` 以获得更专业的日志控制。

```python
# 推荐使用 lunar.plugin_logger
lunar.plugin_logger.info("使用专用 logger 输出信息。")
lunar.plugin_logger.error("这是一个错误日志。")
```

## 三、 消息事件处理与内容获取 (重点)

当 `on_message` 收到消息事件 (`MessageEvent` 及其子类) 时，开发者应关注以下属性：

### 1. 消息事件核心属性（`MessageEvent`）

| 属性 | 类型 | 描述 | 开发者使用方式 |
| :--- | :--- | :--- | :--- |
| `user_id` | `int` | 消息发送者 QQ 号。 | `event.user_id` |
| `group_id` | `Optional[int]` | 仅群消息事件有。 | `event.group_id` |
| `message` | `List[BaseSegment]` | **已解析的消息段列表。** 包含文本、图片、@等元素。 | `event.message` |
| `raw_message` | `str` | 原始消息字符串（CQ 码格式）。 | `event.raw_message` |
| `get_text()` | `str` | 获取消息的**纯文本内容**（包含 `@` 消息的文本）。 | `event.get_text()` |

### 2. 命令/关键词解析属性

这些属性由框架在消息事件中自动设置：

| 属性 | 类型 | 描述 |
| :--- | :--- | :--- |
| `is_command` | `bool` | 消息是否以 Bot 触发符开头。 |
| `command` | `Optional[str]` | 如果是命令，则为命令名（即插件的 `TRIGGHT_KEYWORD`）。 |
| `args` | `Optional[str]` | 如果是命令，则为命令参数部分（命令名之后的所有文本）。 |
| `processed_text` | `Optional[str]` | **推荐使用。** 如果是命令，则为 `args`；如果是关键词触发，则为去除关键词后的剩余文本；否则为 `get_text()`。 |

### 3. 消息解析工具 (`lunar.reply`)

`lunar.reply` 是 `ReplyUtils` 的实例，提供了便捷的消息段解析方法：

| 方法名 | 签名 | 描述 |
| :--- | :--- | :--- |
| `extract_reply_id` | `(event_message: List[BaseSegment]) -> Optional[str]` | 从消息段列表中提取 `ReplySegment` 中的消息 ID。 |
| `extract_mentioned_users` | `(event_message: List[BaseSegment]) -> List[int]` | 从消息段列表中提取所有被 `@` 的用户 ID 列表。 |
| `get_plain_text` | `(event_message: List[BaseSegment]) -> str` | 从消息段列表中提取所有纯文本内容并拼接，**不包含** `@` 消息的文本。 |

## 四、 消息段构造与发送 (`lunar.msg`)

`lunar.msg` 是 `MessageBuilder` 的实例，用于创建消息段对象，是发送复杂消息的基础。

### 1. 消息段构造方法

| 方法名 | 对应的消息段类 | 参数 | 描述 |
| :--- | :--- | :--- | :--- |
| `lunar.msg.text` | `TextSegment` | `text: str` | 纯文本。 |
| `lunar.msg.at` | `AtSegment` | `user_id: int` | `@` 某人。 |
| `lunar.msg.image` | `ImageSegment` | `file: str, cache: bool, proxy: bool, timeout: int` | 图片。`file` 可为 URL、本地路径或 Base64。 |
| `lunar.msg.face` | `FaceSegment` | `face_id: int` | QQ 表情。 |
| `lunar.msg.record` | `RecordSegment` | `file: str, magic: bool, proxy: bool, timeout: int` | 语音。`file` 可为 URL、本地路径或 Base64。 |
| `lunar.msg.reply` | `ReplySegment` | `message_id: Union[int, str]` | 回复指定消息。 |
| `lunar.msg.forward_node` | `ForwardNodeSegment` | `user_id: int, nickname: str, content: List[BaseSegment]` | 合并转发消息中的一个节点。 |
| `lunar.msg.combine` | `List[BaseSegment]` | `*message_segments: Union[BaseSegment, str, Dict]` | 组合多个消息段为一个列表。 |

### 2. 消息发送 API

| 方法名 | 签名 | 描述 |
| :--- | :--- | :--- |
| `lunar.send` | `async def send(message, user_id=None, group_id=None)` | 发送消息。`message` 可为 `str`、`BaseSegment`、`List[BaseSegment]` 等。必须指定 `user_id` 或 `group_id`。 |
| `lunar.send_forward_msg` | `async def send_forward_msg(messages, group_id=None, user_id=None)` | 发送合并转发消息。`messages` 为 `List[ForwardNodeSegment]`。 |

## 五、 LunarBot API 接口 (`lunar` 对象)

`lunar` 对象是 `LunarBot` 的实例，提供了插件与 Bot 核心功能和 OneBot 协议交互的接口。

### 1. 实用属性与工具

| 属性名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `lunar.config` | `Dict[str, Any]` | Bot 的配置字典（只读）。 |
| `lunar.plugin_logger` | `logging.Logger` | 专用于插件的日志记录器。 |
| `lunar.plugins` | `Dict[str, Any]` | 当前所有已加载插件的信息字典。 |
| `lunar.reply` | `ReplyUtils` | 消息解析工具（见 **三、3**）。 |
| `lunar.msg` | `MessageBuilder` | 消息段构造器（见 **四、1**）。 |
| `lunar.self_id` | `int` | Bot 自身的 QQ 号。 |

### 2. 通用 自定义 API 调用

`lunar.diy` 属性是 `DiyAPI` 的实例，用于调用 OneBot 协议的任何 API。

#### 方式一：动态属性调用（推荐）

将 OneBot API 名称直接作为属性调用，例如 `get_group_member_info`。

```python
member_info = await lunar.diy.get_group_member_info(
    group_id=event.group_id, 
    user_id=event.user_id,
    no_cache=True
)
```

#### 方式二：泛型调用

```python
response = await lunar.diy(
    action='set_group_ban',
    params={'group_id': event.group_id, 'user_id': event.user_id, 'duration': 60}
)
```

### 3. 常见 OneBot API 封装（部分）

| 方法名 | 对应 OneBot API | 描述 |
| :--- | :--- | :--- |
| `lunar.del_message` | `delete_msg` | 撤回指定 ID 的消息。 |
| `lunar.get_message_detail` | `get_msg` | 获取指定 ID 消息的详细信息。 |
| `lunar.get_login_info` | `get_login_info` | 获取 Bot 自身信息。 |
| `lunar.get_group_list` | `get_group_list` | 获取 Bot 加入的群列表。 |
| `lunar.set_group_kick` | `set_group_kick` | 踢出群成员。 |
| `lunar.set_group_ban` | `set_group_ban` | 群成员禁言。 |
| `lunar.set_group_whole_ban` | `set_group_whole_ban` | 群全体禁言。 |
Lunar X本身并没有内置太多的API调用。如需全部API，请使用自定义API(lunar.diy),全部API名称请查看
[API-OneBot-V11标准]https://283375.github.io/onebot_v11_vitepress/api/public.html

## 六、 权限管理与用户组判断 (重要)

Lunar X 框架内置了一个简化的权限管理系统，将用户划分为不同的权限组。插件可以通过 `Event` 对象或 `lunar` 对象提供的方法快速判断用户的权限。

### 1. 内置权限组定义（Bot 全局权限等级）

| 权限组名称 | 权限级别 | 描述 |
| :--- | :--- | :--- |
| `MEMBER` | 0 | 普通群成员（默认级别）。 |
| `ADMIN` | 10 | 群管理员。 |
| `OWNER` | 20 | 群主。 |
| `SUPERUSER` | 30 | Bot 框架的超级用户（通常是 Bot 拥有者）。 |

### 2. 权限判断属性（已注入到 `MessageEvent`）

在 `on_message` 函数中，当接收到 `MessageEvent` 时，框架会根据事件的 `user_id` 和 `group_id` 自动计算并注入以下权限相关属性：

| 属性 | 类型 | 描述 | **用途/判断对象** |
| :--- | :--- | :--- | :--- |
| `is_superuser` | `bool` | 当前用户是否为 Bot 的 **超级用户** (`SUPERUSER`)。 | **Bot 全局权限判断** |
| `is_group_admin` | `bool` | 当前用户是否为所在群的 **管理员** (`ADMIN`) 或 **群主** (`OWNER`)。 | **群内身份判断** |
| `is_group_owner` | `bool` | 当前用户是否为所在群的 **群主** (`OWNER`)。 | **群内身份判断** |
| `user_role` | `str` | 当前用户在群内的角色（`member`, `admin`, `owner`）。私聊事件为 `member`。 | **群内身份判断** |

### 3. **权限判断核心说明（重要）**

插件开发中，权限判断是核心安全机制。开发者应充分利用上述注入的属性：

*   **Bot 权限等级判断：** 使用 `event.is_superuser` 判断用户是否拥有 Bot 框架的最高权限。
*   **群内身份判断：** 使用 `event.is_group_admin` (管理员或群主) 或 `event.user_role` (精确角色) 来判断用户在当前群内的身份，以执行群管理操作。

### 4. 权限判断示例（代码片段）

```python
# 仅允许超级用户使用
if not event.is_superuser:
    await lunar.send("权限不足，只有超级用户才能执行此命令。", user_id=event.user_id, group_id=event.group_id)
    return True

# 仅允许群管理员或群主使用
if event.group_id and not event.is_group_admin:
    await lunar.send("权限不足，只有群管理员或群主才能使用。", group_id=event.group_id)
    return True
```

### 5. 权限组获取方法（`lunar` API）

如果插件需要在非消息事件（如 `NoticeEvent`）中判断用户的权限，可以使用 `lunar.get_user_permission` 方法。

| 方法名 | 签名 | 描述 |
| :--- | :--- | :--- |
| `lunar.get_user_permission` | `async def get_user_permission(user_id: int, group_id: Optional[int] = None) -> str` | 获取指定用户在指定群（可选）中的最高权限组名称（返回 `MEMBER`, `ADMIN`, `OWNER`, `SUPERUSER` 之一）。 |

## 七、 事件类型完整列表

所有事件都继承自 `Event` 基类。插件可以通过 `if isinstance(event, Events.事件类型))` 或检查 `event.post_type` 来判断事件类型。

### A. 消息事件 (Message Events)

| 事件类型 | 类名 | `post_type` | 关键属性 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| **私聊消息** | `PrivateMessageEvent` | `message` | `user_id`, `message`, `sender` | 收到私聊消息。 |
| **群聊消息** | `GroupMessageEvent` | `message` | `group_id`, `user_id`, `message`, `sender`, `anonymous` | 收到群聊消息。 |
| **临时会话消息** | `GroupTempMessageEvent` | `message` | `group_id`, `user_id`, `message`, `sender` | 收到群内临时会话消息。 |

### B. 通知事件 (Notice Events)

| 事件类型 | 类名 | `notice_type` | 关键属性 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| **群文件上传** | `GroupUploadNoticeEvent` | `group_upload` | `group_id`, `user_id`, `file` | 群内成员上传文件。 |
| **群管理员变动** | `GroupAdminNoticeEvent` | `group_admin` | `group_id`, `user_id`, `sub_type` (`set`/`unset`) | 群管理员设置或取消。 |
| **群成员增加** | `GroupIncreaseNoticeEvent` | `group_increase` | `group_id`, `user_id`, `operator_id`, `sub_type` (`approve`/`invite`) | 成员入群。 |
| **群成员减少** | `GroupDecreaseNoticeEvent` | `group_decrease` | `group_id`, `user_id`, `operator_id`, `sub_type` (`leave`/`kick`/`kick_me`) | 成员退群。 |
| **群禁言** | `GroupBanNoticeEvent` | `group_ban` | `group_id`, `user_id`, `operator_id`, `sub_type` (`ban`/`lift_ban`), `duration` | 成员被禁言或解除禁言。 |
| **好友添加** | `FriendAddNoticeEvent` | `friend_add` | `user_id` | Bot 被添加为好友。 |
| **群消息撤回** | `GroupRecallNoticeEvent` | `group_recall` | `group_id`, `user_id`, `operator_id`, `message_id` | 群内消息被撤回。 |
| **好友消息撤回** | `FriendRecallNoticeEvent` | `friend_recall` | `user_id`, `message_id` | 好友消息被撤回。 |
| **群内戳一戳** | `GroupPokeNoticeEvent` | `notify` | `group_id`, `user_id`, `target_id`, `sub_type` (`poke`) | 群内被戳。 |
| **群内运气王** | `GroupLuckyKingNoticeEvent` | `notify` | `group_id`, `user_id`, `target_id`, `sub_type` (`lucky_king`) | 成员成为群红包运气王。 |
| **群成员荣誉变更** | `GroupHonorNoticeEvent` | `notify` | `group_id`, `user_id`, `sub_type` (`honor`), `honor_type` | 成员获得/失去群荣誉。 |
| **离线文件** | `OfflineFileNoticeEvent` | `offline_file` | `user_id`, `file` | 收到离线文件。 |
| **客户端状态** | `ClientStatusNoticeEvent` | `client_status` | `client`, `online` | 客户端状态变更（如手机/PC在线）。 |
| **精华消息** | `EssenceMessageNoticeEvent` | `essence` | `group_id`, `sender_id`, `operator_id`, `message_id` | 消息被添加/移除精华。 |

### C. 请求事件 (Request Events)

| 事件类型 | 类名 | `request_type` | 关键属性 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| **好友请求** | `FriendRequestEvent` | `friend` | `user_id`, `comment`, `flag` | 收到加好友请求。 |
| **加群请求** | `GroupAddRequestEvent` | `group` | `group_id`, `user_id`, `comment`, `flag`, `sub_type` (`add`) | 用户申请加群。 |
| **邀请 Bot 加群** | `GroupInviteRequestEvent` | `group` | `group_id`, `user_id`, `comment`, `flag`, `sub_type` (`invite`) | 收到邀请 Bot 加群请求。 |

### D. 元事件 (Meta Events)

| 事件类型 | 类名 | `meta_event_type` | 关键属性 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| **心跳事件** | `HeartbeatMetaEvent` | `heartbeat` | `status`, `interval` | Bot 客户端心跳包。 |
| **生命周期事件** | `LifecycleMetaEvent` | `lifecycle` | `sub_type` (`enable`/`disable`/`connect`) | Bot 客户端连接状态变化。 |

### E. 框架内部事件 (Lunar X Internal Events)

| 事件类型 | 类名 | 描述 | 处理函数 |
| :--- | :--- | :--- | :--- |
| **框架启动** | `LunarStartListen` | Lunar X 框架开始监听事件。 | `on_lunar_event` |
| **框架停止** | `LunarStopListen` | Lunar X 框架停止监听事件。 | `on_lunar_event` |