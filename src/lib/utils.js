/**
 * Format tanggal ke standar Indonesia
 */
export function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (_) {
    return dateString;
  }
}

/**
 * Format rating angka
 */
export function formatScore(score) {
  if (!score || score === '0' || score === '0.00') return 'N/A';
  const num = parseFloat(score);
  return isNaN(num) ? score : num.toFixed(2);
}

/**
 * Sanitasi string HTML sederhana
 */
export function truncate(text, length = 120) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}
