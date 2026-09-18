export interface PostSection {
  id: string;
  html: string;
}

export function parsePostContent(content: string): { intro: string, sections: PostSection[] } {
  if (!content) return { intro: '', sections: [] };

  const container = document.createElement('div');
  container.innerHTML = content;

  const children = Array.from(container.children);
  const sections: PostSection[] = [];
  let introHtml = '';
  let sectionIndex = 0;

  // Find the index of the first H2 tag
  const firstH2Index = children.findIndex(child => child.tagName === 'H2');

  // If no H2 tags, the whole content is intro
  if (firstH2Index === -1) {
    return { intro: container.innerHTML, sections: [] };
  }

  // Collect everything before the first H2 as intro
  introHtml = children.slice(0, firstH2Index).map(el => el.outerHTML).join('');
  
  let currentSectionHtml = '';
  // Start from the first H2
  for (let i = firstH2Index; i < children.length; i++) {
    const node = children[i];

    // If we hit a new H2 and the current section has content, push it.
    if (node.tagName === 'H2' && currentSectionHtml) {
      sections.push({
        id: `section-${sectionIndex++}`,
        html: currentSectionHtml,
      });
      currentSectionHtml = ''; // Reset for the new section
    }
    
    // Add the current node's HTML to the current section
    currentSectionHtml += node.outerHTML;
  }

  // Push the last remaining section
  if (currentSectionHtml) {
    sections.push({
      id: `section-${sectionIndex++}`,
      html: currentSectionHtml,
    });
  }

  return { intro: introHtml, sections };
}
