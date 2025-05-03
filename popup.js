document.getElementById('search').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  chrome.bookmarks.search(query, async function(results) {
    const grouped = {};

    for (const bookmark of results) {
      if (bookmark.url) {
        const folderPath = await getFolderPath(bookmark.parentId);
        if (!grouped[folderPath]) grouped[folderPath] = [];
        grouped[folderPath].push(bookmark);
      }
    }

    // Display grouped bookmarks
    Object.entries(grouped).forEach(([folder, bookmarks]) => {
      const folderHeader = document.createElement('div');
      folderHeader.textContent = `📁 ${folder}`;
      folderHeader.style.fontWeight = 'bold';
      folderHeader.style.marginTop = '16px';
      folderHeader.style.marginBottom = '8px';
      folderHeader.style.color = '#333';

      resultsDiv.appendChild(folderHeader);

      bookmarks.forEach(bookmark => {
        const a = document.createElement('a');
        a.href = bookmark.url;
        a.textContent = bookmark.title || bookmark.url;
        a.className = 'bookmark';
        a.target = '_blank';
        resultsDiv.appendChild(a);
      });
    });
  });
});

// Recursive folder path builder
async function getFolderPath(parentId) {
  if (!parentId) return '';
  const tree = await chrome.bookmarks.get(parentId);
  const node = tree[0];
  if (!node) return '';
  const name = node.title || 'Unnamed Folder';
  if (node.parentId) {
    const parentPath = await getFolderPath(node.parentId);
    return parentPath ? `${parentPath} / ${name}` : name;
  } else {
    return name;
  }
}
