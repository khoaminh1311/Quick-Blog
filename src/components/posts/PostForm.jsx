import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';
import { stripHtmlAndTruncate } from '../../utils/postContent';

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
    setError('');

    // Validation
    if (!image) {
      setError('Please upload a cover image.');
      return;
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Title cannot be empty.');
      return;
    }

    // Check if content has actual text
    const plainText = stripHtmlAndTruncate(content, 100000).trim();
    if (!plainText && !content.includes('<img')) {
      setError('Content cannot be empty.');
      return;
    }

    if (tags.length === 0) {
      setError('Please add at least one tag.');
      return;
    }

    // Call parent handler
    onSubmit({
      title: trimmedTitle,
      content,
      image,
      tags
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Blog Image */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
          Blog Cover Image
        </label>
        <ImageUpload 
          value={image} 
          onChange={setImage} 
          disabled={isSubmitting} 
        />
      </div>

      {/* Blog Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
          Blog Title
        </label>
        <input
          id="title"
          type="text"
          className="w-full px-4 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Enter blog title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {/* Blog Content */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
          Blog Content
        </label>
        <RichTextEditor 
          value={content} 
          onChange={setContent} 
          disabled={isSubmitting} 
        />
      </div>

      {/* Blog Tag */}
      <div className="space-y-3">
        <label htmlFor="tag" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
          Blog Tag
        </label>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            id="tag"
            type="text"
            className="flex-grow px-4 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 flex-shrink-0 shadow-sm"
          >
            Add Tag
          </button>
        </div>
        
        {/* Display added tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                {tag}
                {!isSubmitting && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors focus:outline-none"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-6 flex justify-center">
        <Button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg font-medium rounded-md w-full sm:w-auto shadow-sm"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Create Blog
        </Button>
      </div>

    </form>
  );
}
