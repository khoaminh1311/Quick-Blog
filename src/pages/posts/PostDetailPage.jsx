import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { ArrowLeft, Calendar } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import ErrorState from '../../components/common/ErrorState';
import Skeleton from '../../components/common/Skeleton';
import { getPostById } from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  
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
      } catch (err) {
        if (err.message === 'Not Found') {
          setError('The post you are looking for does not exist.');
        } else {
          setError(err.message || 'Failed to load post');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (isLoading) {
    return (
      <Container className="max-w-4xl">
        <div className="space-y-6">
          <Skeleton variant="text" className="w-24 h-6 mb-8" />
          <Skeleton variant="text" className="w-3/4 h-12" />
          <div className="flex gap-4 items-center">
            <Skeleton variant="circular" className="w-10 h-10" />
            <div className="space-y-2">
              <Skeleton variant="text" className="w-32 h-4" />
              <Skeleton variant="text" className="w-24 h-4" />
            </div>
          </div>
          <Skeleton variant="rectangular" className="w-full aspect-video rounded-xl" />
          <div className="space-y-4 pt-4">
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" className="w-4/5" />
            <Skeleton variant="text" className="w-full h-32" />
          </div>
        </div>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container>
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
      </Container>
    );
  }

  // Sanitize HTML content before rendering to prevent XSS
  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <Container className="max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-8 pl-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <article className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mb-12">
        <header className="p-8 md:p-10 border-b border-slate-100 dark:border-slate-800 text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 capitalize">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full bg-slate-200" loading="lazy" />
              <span className="font-medium text-slate-900 dark:text-slate-200">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time>
                {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </div>
          </div>
        </header>

        <div className="w-full aspect-[2/1] md:aspect-video relative bg-slate-100 dark:bg-slate-800">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="p-8 md:p-12">
          {/* Using custom prose classes defined in index.css */}
          <div 
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
      </article>
    </Container>
  );
}
