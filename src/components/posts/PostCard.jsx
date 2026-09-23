import { Link } from 'react-router-dom';
import { stripHtmlAndTruncate } from '../../utils/postContent';

export default function PostCard({ post }) {
  // Use only the first tag for the pill, fallback to 'Blog'
  const primaryTag = post.tags && post.tags.length > 0 ? post.tags[0] : 'Blog';

  return (
    <article className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm group transition-all hover:shadow-md hover:-translate-y-1">
      <Link to={`/posts/${post._id}`} className="block overflow-hidden aspect-[4/3]">
        <img 
          src={post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070'} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 bg-slate-100 dark:bg-slate-800"
          loading="lazy"
        />
      </Link>
      <div className="flex flex-col p-5">
        <div className="mb-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 capitalize">
            {primaryTag}
          </span>
        </div>
        <Link to={`/posts/${post._id}`} className="block mb-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h2>
        </Link>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed mb-3">
          {stripHtmlAndTruncate(post.content, 120)}
        </p>
        
        {/* Author & Date */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {post.author?.username || 'Unknown Author'}
          </span>
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </time>
        </div>
      </div>
    </article>
  );
}
