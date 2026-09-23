import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import ImageUpload from '../../components/posts/ImageUpload';
import RichTextEditor from '../../components/posts/RichTextEditor';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/my-posts');
    }, 1500);
  };

  return (
    <Container className="max-w-4xl pb-12">
      <div className="flex justify-center mb-10">
        <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-500">
          Create Blog
        </h1>
      </div>

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
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 flex-shrink-0 shadow-sm"
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
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors focus:outline-none"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

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
    </Container>
  );
}
