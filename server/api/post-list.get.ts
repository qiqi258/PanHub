import { defineEventHandler } from 'h3';
import { promises as fs } from 'fs';
import { join } from 'path';

// 获取文章标题列表
async function getPostTitles() {
  try {
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

    // 读取目录中的所有文件
    const files = await fs.readdir(postsDir);
    console.log('Files found:', files);

    // 过滤出 HTML 文件
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    console.log('HTML files found:', htmlFiles);

    // 读取每个文件并提取标题
    const titles = await Promise.all(htmlFiles.map(async (filename) => {
      const filePath = join(postsDir, filename);
      const content = await fs.readFile(filePath, 'utf-8');
      const titleMatch = content.match(/<title>(.*?)<\/title>/);
      const title = titleMatch ? titleMatch[1] : filename;

      return {
        title,
        filename,
        url: `/post/${filename}` // 使用相对路径，让前端路由处理
      };
    }));

    console.log('Final titles list:', titles);
    return titles;
  } catch (e) {
    console.error('Error in getPostTitles:', e);
    // 如果目录不存在或为空，返回空数组
    return [];
  }
}

export default defineEventHandler(async (event) => {
  try {
    const titles = await getPostTitles();
    return {
      success: true,
      count: titles.length,
      data: titles
    };
  } catch (e) {
    console.error('Error in post-list handler:', e);
    return {
      success: false,
      message: 'Failed to get post list'
    };
  }
});