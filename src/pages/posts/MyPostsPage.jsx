import { useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../../components/common/Container';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function MyPostsPage() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data for UI
  const [posts, setPosts] = useState([
    { id: '1', title: 'Spiderman', excerpt: 'Spooderman' },
    { id: '2', title: 'React Hooks Guide', excerpt: 'A comprehensive guide to using React Hooks in modern web applications.' },
    { id: '3', title: 'Tailwind CSS Tips', excerpt: 'How to build beautiful UIs faster with utility-first CSS.' }
  ]);

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    // Simulate network request
    setTimeout(() => {
      setPosts(posts.filter(p => p.id !== postToDelete.id));
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setPostToDelete(null);
    }, 800);
  };

  return (
    <Container className="max-w-5xl pb-12">
      <div className="flex justify-center items-center mb-10">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-500 flex items-center gap-3">
          <span>✍️</span> My Posts
        </h1>
      </div>

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
                  <td colSpan="3" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    You haven't created any posts yet.
                  </td>
                </tr>
              ) : (
                posts.map(post => (
                  <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors">
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{post.title}</p>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <p className="text-slate-500 dark:text-slate-400 truncate max-w-md">{post.excerpt}</p>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          to={`/posts/${post.id}`}
                          className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 shadow-sm"
                          title="View Post"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(post)}
                          className="flex items-center justify-center w-10 h-10 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 shadow-sm"
                          title="Delete Post"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => !isDeleting && setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${postToDelete?.title}"? This action cannot be undone.`}
        isDestructive={true}
        isLoading={isDeleting}
      />
    </Container>
  );
}
