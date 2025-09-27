import { defineEventHandler } from 'h3';

// 预定义的文章数据（用于Vercel部署）
const predefinedPosts = [
  {
    title: "示例文章1",
    filename: "1.html",
    url: "/post/1.html"
  },
  {
    title: "示例文章2", 
    filename: "2.html",
    url: "/post/2.html"
  }
];

export default defineEventHandler(async (event) => {
  try {
    // 在Vercel环境中使用预定义数据
    if (process.env.VERCEL) {
      console.log('Running on Vercel, using predefined posts');
      return {
        success: true,
        count: predefinedPosts.length,
        data: predefinedPosts
      };
    }

    // 本地环境尝试读取文件系统
    try {
      const { promises: fs } = await import('fs');
      const { join } = await import('path');
      
      const rootDir = process.cwd();
      const postsDir = join(rootDir, 'public', 'posts');
      
      // 检查目录是否存在
      try {
        await fs.access(postsDir);
      } catch {
        // 目录不存在，返回预定义数据
        return {
          success: true,
          count: predefinedPosts.length,
          data: predefinedPosts
        };
      }
      
      const files = await fs.readdir(postsDir);
      const htmlFiles = files.filter(file => file.endsWith('.html'));
      
      if (htmlFiles.length === 0) {
        // 没有HTML文件，返回预定义数据
        return {
          success: true,
          count: predefinedPosts.length,
          data: predefinedPosts
        };
      }
      
      const titles = await Promise.all(htmlFiles.map(async (filename) => {
        const filePath = join(postsDir, filename);
        const content = await fs.readFile(filePath, 'utf-8');
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : filename;

        return {
          title,
          filename,
          url: `/post/${filename}`
        };
      }));
      
      return {
        success: true,
        count: titles.length,
        data: titles
      };
    } catch (error) {
      console.error('Error reading posts from filesystem:', error);
      // 文件系统读取失败，返回预定义数据
      return {
        success: true,
        count: predefinedPosts.length,
        data: predefinedPosts
      };
    }
  } catch (e) {
    console.error('Error in post-list handler:', e);
    return {
      success: false,
      message: 'Failed to get post list'
    };
  }
});