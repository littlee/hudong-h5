# 前缀 /admin/vote

# 获取活动列表

> GET /activity/list

### 请求参数

参数名 | 类型 | 方法体 | 是否必填 | 规则 | 说明 | 所属
--- | --- | --- | --- | --- | --- | ---
page | number | query | true |  |  | 
pageSize | number | query | false |  |  | 

### 输出参数

参数名 | 类型 | 说明
--- | --- | ---
arr | array | 
page | number | 
pageSize | number | 
count | number | 

# 创建活动

> POST /create

### 请求参数

参数名 | 类型 | 方法体 | 是否必填 | 规则 | 说明 | 所属
--- | --- | --- | --- | --- | --- | ---
status | string | body | false |  | 上下线状态：online/offline | 
starttime | string | body | true |  | 活动开始日期 | 
endtime | string | body | true |  | 活动end日期 | 
name | string | body | true | [{"name":"min","arg":3},{"name":"max","arg":30}] | 活动名称 | 
vote_type | string | body | true |  | 每天/周期投票次数：every/all | 
vote_count | number | body | true |  | 周期/每天投票的次数 | 
share_config | object\<share_config\> | body | true |  | 分享内容 | 
images_config | object\<images_config\> | body | false |  |  | 
vote_config | array\<vote_config_item\> | body | false |  |  | 

### share_config

参数名 | 类型 | 方法体 | 是否必填 | 规则 | 说明 | 所属
--- | --- | --- | --- | --- | --- | ---
title | string | body | true |  | 分享标题 | 
desc | string | body | false |  | 分享描述 | 
icon | string | body | true |  | 分享icon | 

### images_config

参数名 | 类型 | 方法体 | 是否必填 | 规则 | 说明 | 所属
--- | --- | --- | --- | --- | --- | ---
home_bg | string | body | true |  | 封面图 | 
result_bg | string | body | true |  | 结果图 | 
content_bg | string | body | true |  | 内容图 | 
home_btn | string | body | true |  | 首页按钮 | 
detail_btn | string | body | true |  | 详情按钮 | 

### vote_config_item

参数名 | 类型 | 方法体 | 是否必填 | 规则 | 说明 | 所属
--- | --- | --- | --- | --- | --- | ---
id | any | body | false |  | 创建的时候不需要/修改的时候可传可不传 | 
title | string | body | true |  | 标题 | 
description | string | body | false |  | 描述 | 
imageurl | string | body | false |  | 图片链接 | 
isdel | number | body | false |  | 是否删除该选项 | 
vote_num | number | body | false |  | 用户投票数,不能直接修改 | 
add_vote_num | number | body | true |  | 新增加票数 | 

# 获取单个活动信息

> GET /activity/get

### 请求参数

参数名 | 类型 | 方法体 | 是否必填 | 规则 | 说明 | 所属
--- | --- | --- | --- | --- | --- | ---
id | any | query | false |  |  | 

### 输出参数

参数名 | 类型 | 说明
--- | --- | ---
id | any | 
status | string | 上下线状态：online/offline
starttime | date | 活动开始日期
endtime | date | 活动end日期
name | string | 活动名称
share_config | object\<share_config\> | 分享内容
images_config | object\<images_config\> | 
vote_config | array\<vote_config_item\> | 
vote_type | string | 每天/周期投票次数类型：every/all
vote_count | number | 周期/每天投票的次数

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
id | any | 创建的时候不需要/修改的时候可传可不传
title | string | 标题
description | string | 描述
imageurl | string | 图片链接
isdel | number | 是否删除该选项
vote_num | number | 用户投票数,不能直接修改
add_vote_num | number | 新增加票数

# 更新活动

> POST /update/:id

### 请求参数

参数名 | 类型 | 方法体 | 是否必填 | 规则 | 说明 | 所属
--- | --- | --- | --- | --- | --- | ---
status | string | body | false |  | 上下线状态：online/offline | 
starttime | string | body | true |  | 活动开始日期 | 
endtime | string | body | true |  | 活动end日期 | 
name | string | body | true | [{"name":"min","arg":3},{"name":"max","arg":30}] | 活动名称 | 
share_config | object\<share_config\> | body | true |  | 分享内容 | 
images_config | object\<images_config\> | body | false |  |  | 
vote_config | array\<vote_config_item\> | body | false |  |  | 
vote_type | string | body | true |  | 每天/周期投票次数类型：every/all | 
vote_count | number | body | true |  | 周期/每天投票的次数 | 
id | any | params | true |  |  | 

### share_config

参数名 | 类型 | 方法体 | 是否必填 | 规则 | 说明 | 所属
--- | --- | --- | --- | --- | --- | ---
title | string | body | true |  | 分享标题 | 
desc | string | body | false |  | 分享描述 | 
icon | string | body | true |  | 分享icon | 

### images_config

参数名 | 类型 | 方法体 | 是否必填 | 规则 | 说明 | 所属
--- | --- | --- | --- | --- | --- | ---
home_bg | string | body | true |  | 封面图 | 
result_bg | string | body | true |  | 结果图 | 
content_bg | string | body | true |  | 内容图 | 
home_btn | string | body | true |  | 首页按钮 | 
detail_btn | string | body | true |  | 详情按钮 | 

### vote_config_item

参数名 | 类型 | 方法体 | 是否必填 | 规则 | 说明 | 所属
--- | --- | --- | --- | --- | --- | ---
id | any | body | false |  | 创建的时候不需要/修改的时候可传可不传 | 
title | string | body | true |  | 标题 | 
description | string | body | false |  | 描述 | 
imageurl | string | body | false |  | 图片链接 | 
isdel | number | body | false |  | 是否删除该选项 | 
vote_num | number | body | false |  | 用户投票数,不能直接修改 | 
add_vote_num | number | body | true |  | 新增加票数 | 
