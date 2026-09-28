import { Link } from 'react-router-dom';
import { ScanSearch, MoreHorizontal } from 'lucide-react';
import { stripHtmlAndTruncate } from '../../utils/postContent';
import DeletePostButton from './DeletePostButton';
import { useAuth } from '../../hooks/useAuth';
import { canDeletePost } from '../../utils/permissions';

export default function PostCard({ post, onDeleteSuccess }) {
  const { user: currentUser } = useAuth();
  const canDelete = canDeletePost(currentUser, post);

  // Render all tags for the post, fallback to 'Blog' if none
  const tagsList = post.tags && post.tags.length > 0 ? post.tags : ['Blog'];

  const defaultImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070';
  const postImageUrl = post.image || defaultImage;

  return (
    <div className="w-full max-w-xs sm:max-w-none">
      <div className="rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 group relative h-full overflow-visible transition hover:z-20 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[4/2.7] overflow-visible bg-slate-100 dark:bg-slate-800">
          <Link
            className="block h-full overflow-hidden rounded-t-lg"
            aria-label={`Read ${post.title}`}
            to={`/posts/${post._id}`}
          >
            <img
              alt={post.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              src={postImageUrl}
              loading="lazy"
            />
          </Link>

          {/* Action buttons overlay (Lens search & ellipsis actions) */}
          <div className="group/actions absolute right-2 top-2 z-30 h-[84px] w-10 transition duration-300 pointer-events-none translate-x-3 -translate-y-3 opacity-0 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <a
              href={`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(postImageUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-0 top-0 z-20 grid h-10 w-10 place-items-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-md shadow-slate-900/20 transition duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              aria-label={`Search ${post.title} image on Google`}
              onClick={(e) => e.stopPropagation()}
            >
              <ScanSearch className="h-5 w-5 stroke-[2.2]" />
            </a>

            {canDelete ? (
              <DeletePostButton 
                post={post} 
                onSuccess={() => onDeleteSuccess && onDeleteSuccess(post._id)}
                variant="ellipsis"
              />
            ) : (
              <button
                type="button"
                className="absolute right-0 top-0 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/55 text-blue-500/70 opacity-0 shadow-sm shadow-slate-900/10 backdrop-blur-md transition duration-200 hover:bg-white/75 hover:text-blue-600/85 hover:opacity-95 group-hover/actions:translate-y-11 group-hover/actions:opacity-80 group-focus-within/actions:translate-y-11 group-focus-within/actions:opacity-80"
                aria-label={`Open actions for ${post.title}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MoreHorizontal className="h-6 w-6 stroke-[1.9]" />
              </button>
            )}
          </div>
        </div>

        <div className="p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {tagsList.map((tag, idx) => (
              <span 
                key={`${tag}-${idx}`}
                className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link to={`/posts/${post._id}`}>
            <h2 className="mb-3 line-clamp-2 text-lg font-bold text-slate-950 transition hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300">
              {post.title}
            </h2>
          </Link>

          <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {stripHtmlAndTruncate(post.content, 120)}
          </p>
        </div>
      </div>
    </div>
  );
}
