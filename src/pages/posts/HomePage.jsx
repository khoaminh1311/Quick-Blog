import { useState, useEffect } from 'react';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import PostCard from '../../components/posts/PostCard';
import PostGrid from '../../components/posts/PostGrid';
import PostListSkeleton from '../../components/posts/PostListSkeleton';
import SearchBar from '../../components/posts/SearchBar';
import { getPosts } from '../../services/postService';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../hooks/useAuth';
import { normalizeApiError } from '../../utils/apiError';

export default function HomePage() {
  const { accessToken, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Real API returns { items: [], page, limit, total, totalPages }
      const response = await getPosts(accessToken);
      const items = response.items ?? [];
      setPosts(items);
    } catch (error) {
      const apiErr = normalizeApiError(error);
      if (apiErr.status === 401) {
        logout();
      } else {
        setError(apiErr.message || 'Failed to fetch posts');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch whenever debounced search changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    fetchPosts();
  }, [debouncedSearch]);

  const handleRetry = () => {
    fetchPosts();
  };

  const filteredPosts = posts.filter(post => 
    !debouncedSearch || 
    post.title?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <section className="mx-auto max-w-7xl px-5 pb-8 pt-9 sm:px-6 sm:pb-10 lg:pt-10">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mx-auto max-w-sm text-3xl font-bold leading-tight tracking-normal text-slate-700 dark:text-white sm:max-w-3xl sm:text-6xl">
          Your own <span className="text-indigo-600">blogging</span> platform.
        </h1>

        <p className="mx-auto mt-5 max-w-sm text-xs leading-5 text-slate-500 dark:text-slate-300 sm:max-w-3xl sm:text-base sm:leading-7">
          This is your space to think out loud, to share what matters, and to
          write without filters. Whether it's one word or a thousand, your
          story starts right here.
        </p>

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      <div>
        {isLoading ? (
          <PostListSkeleton count={8} />
        ) : error ? (
          <ErrorState
            title="Failed to load posts"
            message={error}
            onRetry={handleRetry}
          />
        ) : filteredPosts.length === 0 ? (
          <EmptyState
            title="No posts found"
            message={debouncedSearch ? "Try adjusting your search query." : "There are no posts available right now."}
            actionLabel={debouncedSearch ? "Clear Search" : undefined}
            onAction={debouncedSearch ? () => setSearchTerm('') : undefined}
          />
        ) : (
          <>
            <PostGrid>
              {filteredPosts.map(post => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  onDeleteSuccess={(deletedId) => setPosts(prev => prev.filter(p => p._id !== deletedId))}
                />
              ))}
            </PostGrid>
          </>
        )}
      </div>
    </section>
  );
}