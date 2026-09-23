import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Link as LinkIcon, Image as ImageToolIcon, Code, Undo, Redo, ChevronDown, X } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple word count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

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
            Blog Image
          </label>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
            <ImageIcon className="w-6 h-6 mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <span className="text-sm">Click to upload image</span>
          </div>
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

        {/* Blog Content (Mock Rich Text Editor) */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
            Blog Content
          </label>
          
          <div className="border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
            
            {/* Editor Top Menu */}
            <div className="flex gap-4 px-4 py-2 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <span className="cursor-pointer hover:text-slate-900 dark:hover:text-slate-100">File</span>
              <span className="cursor-pointer hover:text-slate-900 dark:hover:text-slate-100">Edit</span>
              <span className="cursor-pointer hover:text-slate-900 dark:hover:text-slate-100">View</span>
              <span className="cursor-pointer hover:text-slate-900 dark:hover:text-slate-100">Insert</span>
              <span className="cursor-pointer hover:text-slate-900 dark:hover:text-slate-100">Format</span>
              <span className="cursor-pointer hover:text-slate-900 dark:hover:text-slate-100">Tools</span>
              <span className="cursor-pointer hover:text-slate-900 dark:hover:text-slate-100">Table</span>
            </div>

            {/* Editor Toolbar */}
            <div className="flex items-center flex-wrap gap-x-2 gap-y-2 px-3 py-2 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30">
              
              <div className="flex items-center gap-1">
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><Undo className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><Redo className="w-4 h-4" /></button>
              </div>

              <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block"></div>

              <button type="button" className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm">
                Paragraph <ChevronDown className="w-3 h-3" />
              </button>

              <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block"></div>

              <div className="flex items-center gap-1">
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-serif font-bold text-base leading-none">B</button>
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-serif italic text-base leading-none">I</button>
              </div>

              <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block"></div>

              <div className="flex items-center gap-1">
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><AlignLeft className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><AlignCenter className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><AlignRight className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><AlignJustify className="w-4 h-4" /></button>
              </div>

              <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block"></div>

              <div className="flex items-center gap-1">
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><List className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><ListOrdered className="w-4 h-4" /></button>
              </div>
              
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block"></div>

              <div className="flex items-center gap-1">
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><LinkIcon className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><ImageToolIcon className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><Code className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Editor Content Area */}
            <textarea
              className="w-full min-h-[300px] p-4 resize-y bg-transparent focus:outline-none text-slate-800 dark:text-slate-200"
              placeholder="p"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>

            {/* Editor Footer / Word Count */}
            <div className="border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 flex justify-end text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30">
              {wordCount} words //
            </div>

          </div>
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
