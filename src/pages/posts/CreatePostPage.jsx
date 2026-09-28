import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../../components/posts/PostForm';
import { createPost } from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';
import Toast from '../../components/common/Toast';
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
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Toast message={error} onClose={() => setError(null)} />

      <h1 className="mb-10 flex items-center justify-center gap-4 text-4xl font-bold text-indigo-600 sm:text-6xl">
        Create Blog
      </h1>

      <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </section>
  );
}
