
export type Article = {
  id: string;
  title: string;
  prompt?: string;
  content: string;
  ottomanContent?: string;
  ottoman_font_size: number;
  content_font_size?: number; 
  ottoman_font_color: string;
  ottoman_font_family: 'Rika' | 'Matbu' | 'Scheherazade New';
  source?: string;
  cardStyle: number;
  imageUrl?: string;
  imageRatio?: string;
  categories: string[];
  topics: string[];
  tags: string[];
  status: 'draft' | 'published';
  createdAt: any;
  updatedAt?: any;
};
