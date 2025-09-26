import { defineEventHandler } from 'h3';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取文章标题的函数
async function getPostTitles() {
  try {
    // 使用 import.meta.url 获取当前文件的路径
    const currentFilePath = fileURLToPath(import.meta.url);
    // 获取 server/api 目录的路径
    const apiDirPath = path.dirname(currentFilePath);
    // 向上导航两级到项目根目录
    const rootDir = path.resolve(apiDirPath, '..', '..');
    // 获取 post 目录的路径
    const postsDir = path.join(rootDir, 'post');
    
    console.log('Current file path:', currentFilePath);
    console.log('API directory path:', apiDirPath);
    console.log('Root directory:', rootDir);
    console.log('Posts directory:', postsDir);

    // 检查目录是否存在
    await fs.access(postsDir);
    
    // 读取文章目录中的所有文件
    const files = await fs.readdir(postsDir);
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

// API 路由处理函数
export default defineEventHandler(async (event) => {
  return await getPostTitles();
});