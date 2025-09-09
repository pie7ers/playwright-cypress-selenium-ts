export function getStringWithHyphens(inputString: string): string {
  return inputString
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple hyphens with a single one
    .replace(/^-+/, '')       // Trim hyphens from start of text
    .replace(/-+$/, '');      // Trim hyphens from end of text
}

export function getSuitsPath(titlePath: string[]): string {
  return titlePath.slice(0, titlePath.length - 1).join('/')
}