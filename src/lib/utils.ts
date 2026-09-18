import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  if (!text) return '';

  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return text.toString()
    .toLocaleLowerCase('tr-TR') 
    .replace(/\s+/g, '-') 
    .replace(p, c => b.charAt(a.indexOf(c))) 
    .replace(/&/g, '-ve-') 
    .replace(/[^\w-]+/g, '') 
    .replace(/--+/g, '-') 
    .replace(/^-+/, '') 
    .replace(/-+$/, '') 
}

export function deslugify(slug: string) {
    const words = slug.replace(/-/g, ' ').split(' ');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function truncateWords(text: string, limit: number): string {
  if (!text) return '';
  const cleanText = text.replace(/<[^>]*>?/gm, ''); // Strip HTML tags
  const words = cleanText.split(/\s+/); // Split by whitespace
  if (words.length > limit) {
    return words.slice(0, limit).join(' ') + '...';
  }
  return cleanText;
}