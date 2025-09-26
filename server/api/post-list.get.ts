import { promises as fs } from "fs";
import path from "path";

/**
 * getPostTitles()
 * 小白解释：这个函数负责从项目根目录的 post 文件夹里读取所有 .html/.htm 文件，
 * 并尝试解析每个文件的 <title> 标签作为文章标题。如果找不到标题，就用文件名代替。
 * 最后返回一个包含标题、文件名和可访问链接（/post/文件名）的数组。
 */
async function getPostTitles() {
  // 解析 post 目录的绝对路径（基于当前进程目录）
  const postsDir = path.resolve(process.cwd(), "post");

  // 如果 post 目录不存在，返回空数组，避免报错
  try {
    await fs.access(postsDir);
  } catch {
    return [];
  }

  // 读取目录下的所有文件名
  const all = await fs.readdir(postsDir);

  // 过滤出 .html 或 .htm 文件，兼容大小写
  const htmlFiles = all.filter((f) => /\.html?$/i.test(f));

  const items: Array<{ title: string; filename: string; url: string }> = [];

  // 逐个读取文件，尝试解析 <title>
  for (const filename of htmlFiles) {
    const fullPath = path.join(postsDir, filename);

    let title = filename;
    try {
      const content = await fs.readFile(fullPath, "utf8");
      // 用简单的正则匹配 HTML 的 title（不做复杂解析，够用）
      const m = content.match(/<title>([^<]+)<\/title>/i);
      if (m && m[1]) {
        title = m[1].trim();
      } else {
        // 如果没有 title 标签，就用去掉后缀的文件名
        title = filename.replace(/\.(html?)$/i, "");
      }
    } catch {
      // 读取失败时，仍旧用文件名（去后缀）作为标题，避免接口失败
      title = filename.replace(/\.(html?)$/i, "");
    }

    items.push({
      title,
      filename,
      // 注意：这里的 /post/{filename} 需要下步新增一个路由来输出 HTML
      url: `/post/${filename}`,
    });
  }

  // 排序：优先按数字前缀（如 1.html, 2.html），否则按标题字典序
  items.sort((a, b) => {
    const na = parseInt(a.filename, 10);
    const nb = parseInt(b.filename, 10);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) {
      return na - nb;
    }
    return a.title.localeCompare(b.title, "zh-CN");
  });

  return items;
}

/**
 * default export defineEventHandler()
 * 小白解释：这是 Nuxt 3 的服务端接口入口。浏览器或前端代码请求 /api/post-list 时，
 * 我们就返回上面整理好的文章列表 JSON。
 */
export default defineEventHandler(async (_event) => {
  const data = await getPostTitles();

  // 统一返回结构，方便前端使用
  return {
    success: true,
    count: data.length,
    data,
  };
});