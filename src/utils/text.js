export function stripOptionPrefix(text = '') {
  return text.replace(/^\([A-Z]\)\s*/, '');
}
