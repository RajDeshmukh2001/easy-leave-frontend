export const getInitials = (name?: string): string => {
  if (!name) return '';

  const words = name.trim().split(' ');

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
};
