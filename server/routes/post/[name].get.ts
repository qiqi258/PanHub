import { promises as fs } from "fs";
import path from "path";

/**
 * normalizeFileName(name)
 * 小白解释：这个函数用来确保你请求的文件名是安全的，只允许访问 post 目录下的 .html/.htm 文件，
 * 防止通过奇怪路径跳到别的地方。
 */
function normalizeFileName(name: string): string {
  const base = path.basename(name);
  if (!/\.html?$/i.test(base)) {
    throw createError({ statusCode: 400, statusMessage: "只支持 .html/.htm 文件" });
  }
  return base;
}

/**
 * default export defineEventHandler()
 * 小白解释：这个接口负责把 post 文件夹里的 HTML 原样返回给浏览器。
 * 例如访问 /post/1.html，就会读取 post/1.html 并返回，浏览器可以全屏显示。
 */
export default defineEventHandler(async (event) => {
  // 获取路径参数 {name}，例如 /post/1.html => name = "1.html"
  const nameParam = getRouterParam(event, "name") || "";
  const filename = normalizeFileName(decodeURIComponent(nameParam));
  const fullPath = path.resolve(process.cwd(), "post", filename);

  try {
    const content = await fs.readFile(fullPath, "utf8");
    // 告诉浏览器返回的是 HTML
    setHeader(event, "content-type", "text/html; charset=utf-8");
    return content;
  } catch {
    throw createError({ statusCode: 404, statusMessage: "文章不存在或已删除" });
  }
});