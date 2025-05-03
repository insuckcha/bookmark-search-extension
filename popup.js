document.getElementById('search').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  chrome.bookmarks.search(query, function(results) {
    results.forEach(bookmark => {
      if (bookmark.url) {
        const a = document.createElement('a');
        a.href = bookmark.url;
        a.textContent = bookmark.title || bookmark.url;
        a.className = 'bookmark';
        a.target = '_blank';
        resultsDiv.appendChild(a);
      }
    });
  });
});
