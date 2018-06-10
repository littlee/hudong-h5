# 前缀 /user/vote

# 微信用户登录

> POST /login

### 请求参数

参数名 | 类型 | 方法体 | 是否必填 | 规则 | 说明 | 所属
--- | --- | --- | --- | --- | --- | ---
openid | string | body | true |  |  | 
activity_id | any | body | true |  |  | 

### 输出参数

参数名 | 类型 | 说明
--- | --- | ---
openid | string | 
id | number | 
chance | number | 抽奖次数

# 获取单个活动数据

> GET /activity/get

### 请求参数

参数名 | 类型 | 方法体 | 是否必填 | 规则 | 说明 | 所属
--- | --- | --- | --- | --- | --- | ---
id | number | query | true |  |  | 

### 输出参数

参数名 | 类型 | 说明
--- | --- | ---
status | string | 上下线状态：online/offline
name | string | 活动名称
share_config | object\<share_config\> | 分享内容
images_config | object\<images_config\> | 
vote_config | array\<vote_config_item\> | 

### share_config

参数名 | 类型 | 说明
--- | --- | ---
title | string | 分享标题
desc | string | 分享描述
icon | string | 分享icon

### images_config

参数名 | 类型 | 说明
--- | --- | ---
home_bg | string | 封面图
result_bg | string | 结果图
content_bg | string | 内容图
home_btn | string | 首页按钮
detail_btn | string | 详情按钮

### vote_config_item

参数名 | 类型 | 说明
--- | --- | ---
id | any | 
title | string | 标题
description | string | 描述
imageurl | string | 图片链接
all_vote_num | number | 用户投的总票数
is_vote | boolean | 用户是否对该选项投票过

# 活动投票

> POST /activity/vote

### 请求参数

参数名 | 类型 | 方法体 | 是否必填 | 规则 | 说明 | 所属
--- | --- | --- | --- | --- | --- | ---
activity_id | number | body | true |  |  | 
item_id | number | body | true |  |  | 
channel | string | body | false |  | 渠道 | 

### 输出参数

参数名 | 类型 | 说明
--- | --- | ---
openid | string | 
id | number | 
chance | number | 抽奖次数
