# PanHub

基于 Nuxt 4 的网盘聚合搜索前端。默认执行“快速搜索”，并在快速结果返回后自动触发“深度搜索”，以更全的数据覆盖显示。首页展示聚合结果，可通过平台按钮在同页切换单个平台视图。

后端接口仅使用一个入口：`/api/search`。

> 本项目仅用于技术学习与搜索聚合演示，请勿用于任何商业或侵权用途。

## 功能特性

- 首页聚合：先呈现快速搜索结果，随后以深度搜索结果覆盖
- 平台切换：使用胶囊按钮在“全部/单个平台”之间切换视图
- 结果分组：每个平台独立卡片，支持展开更多与复制链接
- 仅一个接口：前端只调用 `/api/search`，无额外依赖

## 接口说明

前端只使用 `GET /api/search`，主要入参：

- `kw` 必填：关键词
- `res` 可选：默认 `merged_by_type`
- `src` 固定：`plugin`
- `plugins`：快速搜索使用 `pansearch,pan666`；深度搜索使用 `pansearch,qupansou,panta,pan666,hunhepan,jikepan`

返回结构（节选）：

```json
{
  "code": 0,
  "data": {
    "total": 123,
    "merged_by_type": {
      "quark": [ { "url": "...", "password": "...", "note": "...", "datetime": "..." } ],
      "baidu": [ ... ]
    }
  }
}
```
