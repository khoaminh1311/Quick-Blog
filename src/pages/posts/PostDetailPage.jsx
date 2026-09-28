import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Button from '../../components/common/Button';
import ErrorState from '../../components/common/ErrorState';
import Skeleton from '../../components/common/Skeleton';
import { getPostById } from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';
import { normalizeApiError } from '../../utils/apiError';

function formatDate(dateString) {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPostById(postId, accessToken);
        setPost(data);
      } catch (error) {
        const apiErr = normalizeApiError(error);
        if (apiErr.status === 401 && accessToken) {
          logout();
        } else if (apiErr.status === 404) {
          setError('The post you are looking for does not exist.');
        } else {
          setError(apiErr.message || 'Failed to load post');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, accessToken, logout]);

  if (isLoading) {
    return (
      <article className="mx-auto max-w-3xl px-5 pb-12 pt-2 sm:px-6 sm:pt-6">
        <div className="space-y-6">
          <Skeleton variant="text" className="w-36 h-5 mx-auto mb-4" />
          <Skeleton variant="text" className="w-3/4 h-10 mx-auto mb-4" />
          <div className="flex justify-center gap-2 mb-10 sm:mb-12">
            <Skeleton variant="text" className="w-20 h-6 rounded-full" />
          </div>
          <Skeleton variant="rectangular" className="mx-auto mb-9 h-72 max-h-[26rem] w-full rounded-[1.25rem]" />
          <div className="space-y-4 max-w-2xl mx-auto">
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" className="w-4/5" />
          </div>
        </div>
      </article>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
        <ErrorState 
          title="Post Not Found" 
          message={error} 
          onRetry={() => navigate('/')} 
        />
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(post.content || '');
  const defaultImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070';
  const authorName = post.author?.username || (typeof post.author === 'string' ? post.author : 'Unknown Author');

  return (
    <article className="mx-auto max-w-3xl px-5 pb-12 pt-2 sm:px-6 sm:pt-6">
      <div className="mb-4 text-center text-sm font-semibold text-indigo-600 sm:text-base">
        Published on <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
      </div>

      <h1 className="mx-auto mb-4 max-w-2xl text-center text-2xl font-semibold leading-snug tracking-normal text-black dark:text-white sm:text-4xl">
        {post.title}
      </h1>

      <div className="mb-10 flex flex-wrap justify-center gap-2 sm:mb-12">
        <span className="inline-flex items-center rounded-full text-xs font-semibold dark:text-indigo-200 border border-indigo-200 bg-white px-4 py-1 text-indigo-600 dark:border-indigo-800 dark:bg-slate-950">
          {authorName}
        </span>
      </div>

      <img
        alt={post.title}
        className="mx-auto mb-9 max-h-[26rem] max-w-full rounded-[1.25rem] object-contain sm:mb-10"
        src={post.image || defaultImage}
      />

      <div 
        className="prose-content mx-auto max-w-2xl text-left text-base leading-7 text-black dark:text-slate-100"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </article>
  );
}
