import { useState } from 'react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Spinner from '../../components/common/Spinner';
import Skeleton from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function HomePage() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <Container>
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">UI Primitives Test</h1>
        
        <div className="space-y-12">
          {/* Buttons */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">Buttons</h2>
            <div className="flex flex-wrap gap-4">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
              <Button isLoading>Loading...</Button>
              <Button disabled>Disabled</Button>
            </div>
          </section>

          {/* Form Elements */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">Form Elements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input placeholder="Normal input..." />
                <Input placeholder="Input with error..." error="This field is required" />
              </div>
              <div className="space-y-4">
                <Textarea placeholder="Type your message here..." />
                <Textarea placeholder="Textarea with error..." error="Description is too short" />
              </div>
            </div>
          </section>

          {/* Loaders */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">Loaders & Skeleton</h2>
            <div className="flex items-center gap-8 mb-6">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
            <div className="space-y-3 max-w-md">
              <div className="flex items-center gap-4">
                <Skeleton variant="circular" className="w-12 h-12" />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" />
                  <Skeleton variant="text" className="w-4/5" />
                </div>
              </div>
              <Skeleton variant="rectangular" className="h-32 w-full" />
            </div>
          </section>

          {/* States */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">Feedback States</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ErrorState 
                title="Failed to load content" 
                message="Please check your connection and try again." 
                onRetry={() => alert('Retrying...')} 
              />
              <EmptyState 
                title="No posts yet" 
                message="You haven't created any posts. Click below to start."
                actionLabel="Create Post"
                onAction={() => alert('Navigate to create post')}
              />
            </div>
          </section>

          {/* Modals */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">Modals & Dialogs</h2>
            <Button onClick={() => setIsConfirmOpen(true)}>Open Confirm Dialog</Button>
            
            <ConfirmDialog 
              isOpen={isConfirmOpen}
              onClose={() => setIsConfirmOpen(false)}
              onConfirm={() => {
                alert('Confirmed!');
                setIsConfirmOpen(false);
              }}
              title="Delete Post"
              message="Are you sure you want to delete this post? This action cannot be undone."
              isDestructive
            />
          </section>
        </div>
      </div>
    </Container>
  );
}
