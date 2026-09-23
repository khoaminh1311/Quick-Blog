import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { AlertCircle } from 'lucide-react';

/**
 * RichTextEditor Component
 * Uses TinyMCE to provide a rich text editing experience.
 * Requires VITE_TINYMCE_API_KEY environment variable.
 * 
 * @param {string} value - The current HTML content.
 * @param {function} onChange - Callback receiving the updated HTML string.
 * @param {boolean} disabled - Whether the editor is read-only.
 */
export default function RichTextEditor({ value, onChange, disabled }) {
  const editorRef = useRef(null);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  if (!apiKey) {
    return (
      <div className="border border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/20 rounded-md p-6 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-10 h-10 text-amber-500 mb-3" />
        <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-400 mb-1">
          TinyMCE Configuration Missing
        </h3>
        <p className="text-sm text-amber-700 dark:text-amber-500 max-w-md">
          To use the rich text editor, please add your <code className="bg-amber-100 dark:bg-amber-500/20 px-1 rounded">VITE_TINYMCE_API_KEY</code> to the <code className="bg-amber-100 dark:bg-amber-500/20 px-1 rounded">.env</code> file and restart the development server.
        </p>
      </div>
    );
  }

  // Determine dark mode based on the document class (Tailwind dark mode strategy)
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className="rich-text-editor-container border border-slate-300 dark:border-slate-700 rounded-md overflow-hidden">
      <Editor
        apiKey={apiKey}
        onInit={(_evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={(content) => onChange(content)}
        disabled={disabled}
        init={{
          height: 400,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic underline removeformat | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'link code | help',
          content_style: 'body { font-family: Inter, Helvetica, Arial, sans-serif; font-size: 16px; }',
          skin: isDarkMode ? 'oxide-dark' : 'oxide',
          content_css: isDarkMode ? 'dark' : 'default',
          statusbar: false,
        }}
      />
    </div>
  );
}
