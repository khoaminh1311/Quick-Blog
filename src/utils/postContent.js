// src/utils/postContent.js
// Helpers for processing post content (e.g. rich-text HTML).

/**
 * Strips HTML tags from a string and optionally truncates it.
 * Safe to use for generating plain text previews from rich-text content.
 * 
 * @param {string} htmlString - The raw HTML string from the API.
 * @param {number} [maxLength=150] - Maximum length of the returned string.
 * @returns {string} Plain text without HTML tags.
 */
export function stripHtmlAndTruncate(htmlString, maxLength = 150) {
  if (!htmlString) return '';
  
  // Basic Regex to strip HTML tags.
  // Note: For full robustness against complex encoded HTML, DOMParser could be used,
  // but regex is sufficient and fast for simple preview text extraction.
  const plainText = htmlString.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + '...';
}
