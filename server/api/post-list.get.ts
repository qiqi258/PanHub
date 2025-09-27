import { getPostList } from '../data/posts';

export default defineEventHandler(async (event) => {
  try {
    const posts = getPostList();
    
    return {
      success: true,
      data: posts,
      total: posts.length
    };
  } catch (error) {
    console.error('API Error:', error);
    
    return {
      success: false,
      error: '获取文章列表失败',
      data: []
    };
  }
});