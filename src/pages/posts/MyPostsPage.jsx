import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../../components/common/Container';
import ErrorState from '../../components/common/ErrorState';
import { getPostsByUser } from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';
import { normalizeApiError } from '../../utils/apiError';
import DeletePostButton from '../../components/posts/DeletePostButton';
import { stripHtmlAndTruncate } from '../../utils/postContent';

export default function MyPostsPage() {
  const { user: currentUser, accessToken, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyPosts = async () => {
    if (!currentUser?.id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPostsByUser(currentUser.id, accessToken);
      const allItems = response.items || [];
      // Fallback: client-side filter in case backend doesn't filter by userId query parameter
      const myPosts = allItems.filter(post => {
        const authorId = typeof post.author === 'string' ? post.author : post.author?._id;
        return authorId === currentUser.id;
      });
      setPosts(myPosts);
    } catch (err) {
      const apiErr = normalizeApiError(err);
      if (apiErr.status === 401) {
        logout();
      } else {
        setError(apiErr.message || 'Failed to fetch your posts');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [currentUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = () => {
    fetchMyPosts();
  };

  const handleDeleteSuccess = (deletedId) => {
    setPosts(prev => prev.filter(post => post._id !== deletedId));
  };

  return (
    <Container className="max-w-5xl pb-12">
      <div className="flex justify-center items-center mb-10 pt-6">
        <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-500 flex items-center gap-3">
          <span>✍️</span> My Posts
        </h1>
      </div>

      <div className="pb-16">
        {isLoading ? (
          <div className="text-center text-slate-500">Loading your posts...</div>
        ) : error ? (
          <ErrorState
            title="Failed to load posts"
            message={error}
            onRetry={handleRetry}
          />
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="px-4 py-3 sm:px-6 sm:py-4 w-1/3">TITLE</th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 w-1/2">CONTENT</th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 w-1/6 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                        You haven't created any posts yet.
                      </td>
                    </tr>
                  ) : (
                    posts.map(post => (
                      <tr key={post._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors">
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <p className="font-bold text-slate-900 dark:text-slate-100">{post.title}</p>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <p className="text-slate-500 dark:text-slate-400 truncate max-w-md">
                            {stripHtmlAndTruncate(post.content, 100)}
                          </p>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <div className="flex items-center justify-end gap-3">
                            <Link 
                              to={`/posts/${post._id}`}
                              className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                              title="View Post"
                            >
                              <Eye className="w-5 h-5" />
                            </Link>
                            <DeletePostButton 
                              post={post} 
                              onSuccess={() => handleDeleteSuccess(post._id)} 
                              variant="solid" 
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
