import Skeleton from '../common/Skeleton';
import PostGrid from './PostGrid';

export default function PostListSkeleton({ count = 8 }) {
  return (
    <PostGrid>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <Skeleton variant="rectangular" className="w-full aspect-[4/3] rounded-none" />
          <div className="flex flex-col p-5">
            <Skeleton variant="rectangular" className="w-20 h-6 rounded-full mb-3" />
            <Skeleton variant="text" className="h-6 w-full mb-2" />
            <Skeleton variant="text" className="h-4 w-5/6 mb-1" />
            <Skeleton variant="text" className="h-4 w-4/6" />
          </div>
        </div>
      ))}
    </PostGrid>
  );
}
