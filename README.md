# PanHub · 全网最全的网盘搜索

用一个搜索框，搜遍阿里云盘、夸克、百度网盘、115、迅雷等热门网盘资源。即搜即得、聚合去重、免费开源、零广告、轻量部署。

在线体验：<https://panhub.shenzjd.com>

> 免责声明：本项目仅用于技术学习与搜索聚合演示，不存储、不传播任何受版权保护的内容。请勿用于商业或侵权用途。

---

## 为什么选择 PanHub

- 强聚合：聚合多个优质资源站与公开频道，一次搜索多源命中
- 智能排序：默认先给出“快速结果”，随后自动补全“深度结果”并覆盖显示
- 分类型展示：阿里、夸克、百度、115、迅雷等分类清晰，直达链接可复制
- 极速部署：原生支持 Cloudflare Workers，0 服务器运维成本，免费起步
- 轻定制：内置多插件，支持按需启用/禁用，参数化并发与缓存

---

## 一键部署到 Cloudflare Workers

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/shenzjd/panhub.shenzjd.com)

- 点击上方按钮，按向导授权并创建项目即可自动构建与发布。
- 若你已 fork 本仓库，点击后可在向导中选择你的 fork 进行部署。

部署完成后，可在 Cloudflare Dashboard 为 Worker 绑定自定义域名，一般 1 分钟内全球生效。

---

## Docker 部署

> 已提供 `Dockerfile`，镜像构建后运行一个 Node 版 Nitro 服务，默认监听 `3000` 端口。

### 1) 直接构建并运行

```bash
docker build -t panhub:latest .
docker run --name panhub -p 3000:3000 -d panhub:latest
```

访问：`http://localhost:3000`

### 2) 使用预构建镜像（GHCR / Docker Hub）

本仓库已配置 CI 自动将镜像推送到 GHCR 与 Docker Hub：

- GHCR：`ghcr.io/<owner>/<repo>:<tag>`
- Docker Hub：`docker.io/wu529778790/<repo>:<tag>`

其中：

- `latest`: 始终指向最近一次构建
- `<version>`: 来自 `package.json` 的版本号（如 `1.0.0`）
- 还包含分支名（如 `:main`）和提交 SHA 标签

```bash
# GHCR
docker pull ghcr.io/wu529778790/panhub.shenzjd.com:latest
docker run --name panhub -p 3000:3000 -d ghcr.io/wu529778790/panhub.shenzjd.com:latest

# Docker Hub
docker pull docker.io/wu529778790/panhub.shenzjd.com:latest
docker run --name panhub -p 3000:3000 -d docker.io/wu529778790/panhub.shenzjd.com:latest
```

## 使用说明

1) 打开页面，输入关键词，如“电影”。

2) 页面会先返回“快速搜索”结果，随后在后台进行“深度搜索”，并自动用更多、更准的结果覆盖显示。

3) 顶部快捷筛选可在“全部/单个平台”之间切换视图；每个平台卡片内支持展开更多与复制链接。

---

## 版权与合规

- PanHub 不存储任何搜索结果内容，所有链接均来自公开网络。
- 请在遵守当地法律法规与平台使用条款的前提下使用本项目。
- 若您是权利人并认为存在侵权线索，请先联系源站处理。

---

## 许可证

本项目采用 MIT License 开源许可，商业使用请遵守许可证条款并自担合规责任。
