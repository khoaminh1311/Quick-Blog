import { useState, useEffect } from 'react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
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

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchPosts = async (searchQuery, pageNum, isLoadMore = false) => {
    if (!isLoadMore) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      // Real API returns { items: [], page, limit, total, totalPages }
      const response = await getPosts(accessToken);
      const items = response.items ?? [];
      if (isLoadMore) {
        setPosts(prev => [...prev, ...items]);
      } else {
        setPosts(items);
        setPage(pageNum);
      }
      // hasMore: there are more pages beyond the current one
      setHasMore(response.page < response.totalPages);
    } catch (error) {
      const apiErr = normalizeApiError(error);
      if (apiErr.status === 401) {
        logout();
      } else {
        setError(apiErr.message || 'Failed to fetch posts');
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Fetch from page 1 whenever debounced search changes
  useEffect(() => {
    fetchPosts(debouncedSearch, 1); // eslint-disable-line react-hooks/set-state-in-effect
  }, [debouncedSearch]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(debouncedSearch, nextPage, true);
  };

  const handleRetry = () => {
    fetchPosts(debouncedSearch, page);
  };

  return (
    <Container>
      <div className="pt-8 sm:pt-12 pb-20 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
          Your own <span className="text-indigo-600 dark:text-indigo-500">blogging</span> platform.
        </h1>

        <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
          This is your space to think out loud, to share what matters, and to write without filters. Whether it's one word or a thousand, your story starts right here.
        </p>

        <div className="w-full">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
      </div>

      <div className="pb-24">
        {isLoading ? (
          <PostListSkeleton count={8} />
        ) : error ? (
          <ErrorState
            title="Failed to load posts"
            message={error}
            onRetry={handleRetry}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            title="No posts found"
            message={debouncedSearch ? "Try adjusting your search query." : "There are no posts available right now."}
            actionLabel={debouncedSearch ? "Clear Search" : undefined}
            onAction={debouncedSearch ? () => setSearchTerm('') : undefined}
          />
        ) : (
          <>
            <PostGrid>
              {posts
                .filter(post => 
                  !debouncedSearch || 
                  post.title?.toLowerCase().includes(debouncedSearch.toLowerCase())
                )
                .map(post => (
                  <PostCard key={post._id} post={post} />
                ))}
            </PostGrid>

            {hasMore && (
              <div className="mt-16 flex justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleLoadMore}
                  isLoading={isLoadingMore}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
}