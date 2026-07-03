// Shared download utility — works for same-origin assets and Vite-hashed URLs
export function downloadAsBlob(url: string, filename: string): void {
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.blob();
    })
    .then(blob => {
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 6000);
    })
    .catch(() => {
      // Fallback: direct link (may open in new tab on some browsers for certain MIME types)
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
}

// Derive a clean filename from a URL path + optional prefix
export function deriveFilename(url: string, prefix: string = 'download'): string {
  const raw = url.split('/').pop()?.split('?')[0] || '';
  // Strip Vite hash (e.g. "image-AbCd1234.webp" → "image.webp")
  const clean = raw.replace(/-[A-Za-z0-9_-]{8,}\.(webp|jpg|jpeg|png|gif|svg)$/i, '.$1');
  return clean || `${prefix}.webp`;
}
