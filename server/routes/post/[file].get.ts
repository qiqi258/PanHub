import { promises as fs } from 'fs';
import { join } from 'path';

// 预定义的文章内容（用于Vercel部署）
const predefinedPosts: Record<string, string> = {
  "1.html": `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>示例文章1</title>
</head>
<body>
    <h1>欢迎来到PanHub</h1>
    <p>这是示例文章1的内容。在Vercel环境中，我们使用预定义的文章内容。</p>
    <p>如果您在本地开发环境，可以创建 public/posts 目录并添加自己的HTML文章文件。</p>
</body>
</html>`,
  
  "2.html": `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>示例文章2</title>
</head>
<body>
    <h1>使用指南</h1>
    <p>这是示例文章2的内容。</p>
    <p>PanHub是一个全网网盘搜索工具，支持多个平台的资源搜索。</p>
</body>
</html>`
};

// 处理文章内容请求的路由处理器
export default defineEventHandler(async (event) => {
  try {
    // 获取文章文件名参数
    const filename = event.context.params.file;
    if (!filename) {
      throw new Error('文章文件名不能为空');
    }

    console.log('Requesting post file:', filename);

    // 在Vercel环境中使用预定义内容
    if (process.env.VERCEL) {
      console.log('Running on Vercel, using predefined content');
      const content = predefinedPosts[filename];
      if (content) {
        return content;
      }
      throw createError({
        statusCode: 404,
        message: '文章不存在'
      });
    }

    // 本地环境尝试读取文件系统
    try {
      const { promises: fs } = await import('fs');
      const { join } = await import('path');
      
      // 获取项目根目录
      const rootDir = process.cwd();
      
      // 构建文章文件路径
      const filePath = join(rootDir, 'public', 'posts', filename);
      console.log('Reading post file from:', filePath);

      // 检查文件是否存在
      try {
        await fs.access(filePath);
      } catch {
        // 文件不存在，尝试返回预定义内容
        const content = predefinedPosts[filename];
        if (content) {
          return content;
        }
        throw createError({
          statusCode: 404,
          message: '文章不存在'
        });
      }

      // 读取文章内容
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
      
    } catch (error) {
      console.error('Error reading post from filesystem:', error);
      // 文件系统读取失败，尝试返回预定义内容
      const content = predefinedPosts[filename];
      if (content) {
        return content;
      }
      throw createError({
        statusCode: 404,
        message: '文章不存在或无法访问'
      });
    }
  } catch (e) {
    console.error('Error in post content handler:', e);
    throw createError({
      statusCode: 404,
      message: '文章不存在或无法访问'
    });
  }
});