import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';
import { stripHtmlAndTruncate } from '../../utils/postContent';
import Toast from '../common/Toast';

export default function PostForm({ 
  initialData = { title: '', content: '', image: '', tags: [] }, 
  onSubmit, 
  isSubmitting = false 
}) {
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [image, setImage] = useState(initialData.image);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(initialData.tags);
  const [error, setError] = useState('');

  const [toastKey, setToastKey] = useState(0);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const plainText = stripHtmlAndTruncate(content, 100000).trim();
    const hasContent = !!plainText || content.includes('<img');

    // Validation: unified message when any field is incomplete
    if (!image || !trimmedTitle || !hasContent || tags.length === 0) {
      setError('Please complete image, title, content and tags');
      setToastKey((prev) => prev + 1);
      return;
    }

    setError('');

    // Call parent handler
    onSubmit({
      title: trimmedTitle,
      content,
      image,
      tags
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Blog Image */}
      <label className="block">
        <span className="mb-3 block font-semibold text-slate-900 dark:text-slate-100">Blog Image</span>
        <div>
          <ImageUpload 
            value={image} 
            onChange={setImage} 
            disabled={isSubmitting} 
          />
        </div>
      </label>

      {/* Blog Title */}
      <label className="block">
        <span className="mb-3 block font-semibold text-slate-900 dark:text-slate-100">Blog Title</span>
        <input
          type="text"
          className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-indigo-950"
          placeholder="Enter blog title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </label>

      {/* Blog Content */}
      <label className="block">
        <span className="mb-3 block font-semibold text-slate-900 dark:text-slate-100">Blog Content</span>
        <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          <RichTextEditor 
            value={content} 
            onChange={setContent} 
            disabled={isSubmitting} 
          />
        </div>
      </label>

      {/* Blog Tag */}
      <label className="block">
        <span className="mb-3 block font-semibold text-slate-900 dark:text-slate-100">Blog Tag</span>
        <div className="flex gap-2">
          <input
            type="text"
            className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-indigo-950"
            placeholder="Enter blog tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-60 bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 h-10 px-4 py-0 shrink-0"
          >
            Add Tag
          </button>
        </div>
        
        {/* Display added tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
              <span>{tag}</span>
              {!isSubmitting && (
                <button 
                  type="button" 
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors focus:outline-none"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      </label>

      <Toast key={toastKey} message={error} onClose={() => setError('')} />

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-60 bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 h-9 rounded-md px-4 py-0 text-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            'Create Blog'
          )}
        </button>
      </div>
    </form>
  );
}
