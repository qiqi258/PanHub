import { defineEventHandler } from 'h3';
import { promises as fs } from 'fs';
import { join } from 'path';

// 简单的函数来从HTML文件中提取标题
async function getPostTitles(): Promise<Array<{ filename: string; title: string }>> {
  try {
    // 使用相对于项目根目录的路径
    const postsDir = join(process.cwd(), 'content', 'posts');
    console.log('Posts directory:', postsDir);
    
    const files = await fs.readdir(postsDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    const posts = await Promise.all(
      htmlFiles.map(async (filename) => {
        const filePath = join(postsDir, filename);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // 尝试从HTML中提取标题
        const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
        const title = titleMatch ? titleMatch[1].trim() : filename.replace('.html', '');
        
        return {
          filename,
          title
        };
      })
    );
    
    return posts;
  } catch (error) {
    console.error('Error in getPostTitles:', error);
    return [];
  }
}

export default defineEventHandler(async (event) => {
  try {
    const posts = await getPostTitles();
    
    return {
      success: true,
      data: posts.map(post => ({
        ...post,
        url: `/post/${post.filename}`
      }))
    };
  } catch (error) {
    console.error('Error in post-list handler:', error);
    return {
      success: false,
      error: 'Failed to fetch posts',
      data: []
    };
  }
});