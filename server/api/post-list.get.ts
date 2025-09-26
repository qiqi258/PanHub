import { defineEventHandler } from 'h3';
import fs from 'fs/promises';
import path from 'path';
import { useRuntimeConfig } from '#imports';

/**
 * 获取文章标题的函数
 * 小白解释：这个函数会读取 post 目录下的所有 HTML 文件，
 * 从每个文件中提取标题（从 <title> 标签中），
 * 如果找不到标题就用文件名作为标题。
 * 最后返回一个包含所有文章信息的列表。
 */
async function getPostTitles() {
  try {
    // 使用 Nuxt 的运行时配置获取项目根目录
    const config = useRuntimeConfig();
    const rootDir = config.rootDir || process.cwd();
    const postsDir = path.join(rootDir, 'post');
    
    console.log('Root directory:', rootDir);
    console.log('Posts directory:', postsDir);

    // 检查目录是否存在并可访问
    await fs.access(postsDir);
    
    // 读取所有 HTML 文件
    const files = await fs.readdir(postsDir);
    console.log('Files in posts directory:', files);
    
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    // 获取每个文件的标题
    const titles = await Promise.all(
      htmlFiles.map(async (filename) => {
        const filePath = path.join(postsDir, filename);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // 提取标题
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : filename;
        
        return {
          title,
          filename,
          url: `/post/${filename}`
        };
      })
    );
    
    // 按文件名数字排序
    titles.sort((a, b) => {
      const numA = parseInt(a.filename);
      const numB = parseInt(b.filename);
      return numA - numB;
    });

    return {
      success: true,
      count: titles.length,
      data: titles
    };
  } catch (error) {
    console.error('Error in getPostTitles:', error);
    return {
      success: false,
      count: 0,
      data: [],
      error: error.message
    };
  }
}

/**
 * API 路由处理函数
 * 小白解释：这个函数处理访问 /api/post-list 的请求，
 * 返回所有文章的列表信息。
 */
export default defineEventHandler(async (event) => {
  return await getPostTitles();
});