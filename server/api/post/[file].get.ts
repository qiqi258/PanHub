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

    // 使用相对路径获取文章目录
    const postsDir = join('public', 'posts');
    console.log('Posts directory:', postsDir);

    // 创建目录（如果不存在）
    try {
      await fs.mkdir(postsDir, { recursive: true });
      console.log('Created posts directory');
    } catch (e) {
      // 忽略目录已存在的错误
      if ((e as any).code !== 'EEXIST') {
        console.error('Error creating directory:', e);
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