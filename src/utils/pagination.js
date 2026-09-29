// src/utils/pagination.js

/**
 * Utility to fetch all pages concurrently and return a deduplicated array of items.
 * Prevents race conditions during multi-page fetching by deduplicating items based on _id.
 *
 * @param {Function} fetchPageFn - Function taking a page number and returning { items, totalPages }
 * @returns {Promise<Array>} Deduplicated array of all items.
 */
export async function fetchAllPages(fetchPageFn) {
  const firstResponse = await fetchPageFn(1);
  let allItems = [...(firstResponse.items || [])];
  const totalPages = firstResponse.totalPages || 1;

  if (totalPages > 1) {
    const promises = [];
    for (let i = 2; i <= totalPages; i++) {
      promises.push(fetchPageFn(i));
    }
    const remainingResponses = await Promise.all(promises);
    remainingResponses.forEach((res) => {
      allItems = [...allItems, ...(res.items || [])];
    });
  }

  // Deduplicate by _id to handle data shifting during parallel fetch
  const uniqueItems = Array.from(new Map(allItems.map((item) => [item._id, item])).values());
  return uniqueItems;
}
