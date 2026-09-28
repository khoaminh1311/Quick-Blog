import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/common/Container';
import PostForm from '../../components/posts/PostForm';
import { createPost } from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';
import ErrorState from '../../components/common/ErrorState';
import { normalizeApiError } from '../../utils/apiError';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (postData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createPost(postData, accessToken);
      navigate('/');
    } catch (err) {
      const apiErr = normalizeApiError(err);
      if (apiErr.status === 401) {
        logout();
      } else {
        setError(apiErr.message || 'Failed to create post. Please try again.');
      }
      setIsSubmitting(false); // only reset on error, on success we navigate away
    }
  };

  return (
    <Container className="max-w-4xl pb-12">
      <div className="flex justify-center mb-10">
        <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-500">
          Create Blog
        </h1>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorState message={error} onRetry={() => setError(null)} />
        </div>
      )}

      <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </Container>
  );
}
