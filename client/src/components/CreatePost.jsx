// src/components/CreatePost.jsx
import { useState } from 'react';

export default function CreatePost({ onPostCreated }) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('advice');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!author.trim() || !content.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author,
          content,
          type: postType,
        }),
      });

      if (!response.ok) {
        // Optionally handle error UI here
        return;
      }

      // Clear form
      setAuthor('');
      setContent('');
      setPostType('advice');

      // Notify parent
      if (typeof onPostCreated === 'function') {
        onPostCreated();
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdvice = postType === 'advice';
  const isPromotion = postType === 'promotion';

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Share something with BizHive
          </h2>
        </div>

        {/* Author input */}
        <div className="space-y-1">
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700"
          >
            Your Name
          </label>
          <input
            id="author"
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. Rohan from StartupX"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        {/* Type selector */}
        <div className="space-y-2">
          <span className="block text-sm font-medium text-gray-700">
            Post Type
          </span>
          <div className="inline-flex w-full sm:w-auto rounded-lg border border-gray-200 bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => setPostType('advice')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isAdvice
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'bg-transparent text-gray-700 hover:bg-green-50'
              }`}
            >
              Ask for Help
            </button>
            <button
              type="button"
              onClick={() => setPostType('promotion')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isPromotion
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'bg-transparent text-gray-700 hover:bg-purple-50'
              }`}
            >
              Showcase Startup
            </button>
          </div>
        </div>

        {/* Content textarea */}
        <div className="space-y-1">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            What would you like to share?
          </label>
          <textarea
            id="content"
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Share your challenge, ask for specific feedback, or spotlight your startup story..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !author.trim() || !content.trim()}
            className="inline-flex items-center px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Posting...' : 'Post to BizHive'}
          </button>
        </div>
      </form>
    </div>
  );
}
