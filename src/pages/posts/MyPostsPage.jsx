import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ErrorState from '../../components/common/ErrorState';
import Skeleton from '../../components/common/Skeleton';
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
      const firstResponse = await getPostsByUser(currentUser.id, accessToken, 1);
      let allItems = [...(firstResponse.items || [])];
      const totalPages = firstResponse.totalPages || 1;

      if (totalPages > 1) {
        const promises = [];
        for (let i = 2; i <= totalPages; i++) {
          promises.push(getPostsByUser(currentUser.id, accessToken, i));
        }
        const remainingResponses = await Promise.all(promises);
        remainingResponses.forEach(res => {
          allItems = [...allItems, ...(res.items || [])];
        });
      }

      // Client-side filter: backend may return all posts if userId param
      // is not supported. We filter by matching author._id or author string.
      const myPosts = allItems.filter(post => {
        const authorId =
          typeof post.author === 'string' ? post.author : post.author?._id;
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMyPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const handleRetry = () => {
    fetchMyPosts();
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const authorId = typeof post.author === 'string' ? post.author : post.author?._id;
      return authorId === currentUser?.id;
    });
  }, [posts, currentUser?.id]);

  const handleDeleteSuccess = (deletedId) => {
    setPosts(prev => prev.filter(post => post._id !== deletedId));
  };

  return (
    <section className="mx-auto min-h-[calc(100vh-24rem)] max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-14 flex items-center justify-center gap-4 text-4xl font-bold text-indigo-600 sm:text-5xl">
        <span aria-hidden="true" className="text-5xl leading-none">
          ✍️
        </span>
        My Post
      </h1>

      <div className="min-h-[420px]">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
            <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
            <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
            <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <ErrorState
              title="Failed to load posts"
              message={error}
              onRetry={handleRetry}
            />
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 px-4 py-4 font-bold uppercase tracking-wide dark:border-slate-800 text-base text-slate-950 dark:text-slate-100">
                    Title
                  </th>
                  <th className="border-b border-slate-200 px-4 py-4 font-bold uppercase tracking-wide dark:border-slate-800 text-base text-slate-950 dark:text-slate-100">
                    Content
                  </th>
                  <th className="border-b border-slate-200 px-4 py-4 font-bold uppercase tracking-wide dark:border-slate-800 w-36 text-base text-slate-950 dark:text-slate-100">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="border-b border-slate-100 px-4 py-12 text-center text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      You haven't created any posts yet.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post._id}>
                      <td className="border-b border-slate-100 px-4 py-4 align-top dark:border-slate-800 font-semibold">
                        {post.title}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-4 align-top dark:border-slate-800">
                        {stripHtmlAndTruncate(post.content, 100)}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-4 align-top dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <Link
                            aria-label={`View ${post.title}`}
                            title={`View ${post.title}`}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-60 h-9 w-11 rounded-[10px] bg-blue-500 text-white shadow-none hover:bg-blue-600"
                            to={`/posts/${post._id}`}
                            data-discover="true"
                          >
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M7 6v11" />
                              <path d="M17 6v11" />
                              <path d="M7 8h10" />
                              <path d="M7 13h10" />
                              <path d="M5 10.5 3.5 16.5a3 3 0 0 0 5.8 1.5l1.2-4.5" />
                              <path d="M19 10.5 20.5 16.5a3 3 0 0 1-5.8 1.5l-1.2-4.5" />
                              <path d="M9 6a2 2 0 0 1 4 0" />
                              <path d="M15 6a2 2 0 0 0-4 0" />
                            </svg>
                          </Link>
                          <DeletePostButton
                            post={post}
                            onSuccess={() => handleDeleteSuccess(post._id)}
                            variant="table"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
