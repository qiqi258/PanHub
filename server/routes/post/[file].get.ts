import { getPostBySlug, getNextPost } from '../../data/posts';

export default defineEventHandler(async (event) => {
  try {
    const fileName = getRouterParam(event, 'file');
    
    if (!fileName || !fileName.endsWith('.html')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file name'
      });
    }
    
    // 从数据模块获取文章
    const post = getPostBySlug(fileName);
    
    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      });
    }
    
    // 获取下一篇文章
    const nextPost = getNextPost(post.id);
    
    return {
      success: true,
      data: {
        title: post.title,
        content: post.content,
        fileName: post.slug,
        nextPost: nextPost ? {
          id: nextPost.id,
          title: nextPost.title,
          slug: nextPost.slug
        } : null
      }
    };
    
  } catch (error) {
    console.error('Error fetching post:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});