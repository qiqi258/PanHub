import { promises as fs } from 'fs';
import { join } from 'path';

// 处理文章内容请求的路由处理器
export default defineEventHandler(async (event) => {
  try {
    // 获取文章文件名参数
    const filename = event.context.params.file;
    if (!filename) {
      throw new Error('文章文件名不能为空');
    }

    // 构建文章文件路径（使用新的content/posts目录）
    const filePath = join(process.cwd(), 'content', 'posts', filename);
    console.log('Reading post file:', filePath);

    // 读取文章内容
    const content = await fs.readFile(filePath, 'utf-8');
    
    // 返回文章内容
    return content;
  } catch (e) {
    console.error('Error in post content handler:', e);
    throw createError({
      statusCode: 404,
      message: '文章不存在或无法访问'
    });
  }
});