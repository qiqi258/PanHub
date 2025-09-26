import { defineEventHandler } from 'h3';
import { promises as fs } from 'fs';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const filename = event.context.params.file;
    if (!filename) {
      return {
        success: false,
        message: 'File name is required'
      };
    }

    // 使用 process.cwd() 获取项目根目录
    const rootDir = process.cwd();
    console.log('Root directory:', rootDir);

    // 使用 public/posts 目录
    const postsDir = join(rootDir, 'public', 'posts');
    console.log('Posts directory:', postsDir);

    // 创建目录（如果不存在）
    try {
      await fs.mkdir(postsDir, { recursive: true });
    } catch (e) {
      // 忽略目录已存在的错误
      if ((e as any).code !== 'EEXIST') {
        throw e;
      }
    }

    const filePath = join(postsDir, filename);
    console.log('Reading file:', filePath);

    const content = await fs.readFile(filePath, 'utf-8');
    return {
      success: true,
      data: content
    };
  } catch (e) {
    console.error('Error in post handler:', e);
    return {
      success: false,
      message: 'Failed to get post content'
    };
  }
});