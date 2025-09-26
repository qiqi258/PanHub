import { defineEventHandler } from 'h3';
import { useStorage } from '#imports';
import path from 'path';

/**
 * 获取文章标题的函数
 * 小白解释：这个函数通过 Nuxt 的存储系统来读取 post 目录下的文章，
 * 它会尝试从每个 HTML 文件中提取标题信息，
 * 如果找不到标题就用文件名作为标题。
 * 这个方法在本地开发和云端环境都能正常工作。
 */
async function getPostTitles() {
  try {
    // 使用 Nuxt 的存储系统
    const storage = useStorage();
    console.log('Trying to access post directory...');

    // 获取 post 目录下的所有文件
    const files = await storage.getKeys('post');
    console.log('Files found:', files);

    // 过滤出 HTML 文件
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    console.log('HTML files found:', htmlFiles);

    // 获取每个文件的标题
    const titles = await Promise.all(
      htmlFiles.map(async (filename) => {
        // 从存储中读取文件内容
        const content = await storage.getItem(`post:${filename}`);
        console.log(`Reading file: ${filename}`);

        let title = filename;
        if (typeof content === 'string') {
          // 提取标题
          const titleMatch = content.match(/<title>(.*?)<\/title>/);
          if (titleMatch && titleMatch[1]) {
            title = titleMatch[1].trim();
            console.log(`Found title for ${filename}:`, title);
          }
        }

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

    console.log('Final titles list:', titles);
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