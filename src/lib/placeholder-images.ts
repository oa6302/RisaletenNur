export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  width: number;
  height: number;
};

export const placeholderImages: ImagePlaceholder[] = [
    {
        "id": "1",
        "description": "Gökyüzünde ay ve yıldızlar",
        "imageUrl": "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?q=80&w=1965&auto=format&fit=crop",
        "imageHint": "sky moon",
        "width": 1965,
        "height": 1310
    },
    {
        "id": "2",
        "description": "Kumsalda gün batımı",
        "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723a9ce6890?q=80&w=2070&auto=format&fit=crop",
        "imageHint": "beach sunset",
        "width": 2070,
        "height": 1380
    },
    {
        "id": "3",
        "description": "Dağ manzarası ve orman",
        "imageUrl": "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=1974&auto=format&fit=crop",
        "imageHint": "mountain forest",
        "width": 1974,
        "height": 1316
    },
    {
        "id": "4",
        "description": "Kitap ve gözlük",
        "imageUrl": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2070&auto=format&fit=crop",
        "imageHint": "book glasses",
        "width": 2070,
        "height": 1380
    },
    {
      "id": "5",
      "description": "İslami fenerler ve loş bir ışık.",
      "imageUrl": "https://images.unsplash.com/photo-1555531846-3ba8a8341869?q=80&w=1974&auto=format&fit=crop",
      "imageHint": "lantern light",
      "width": 1974,
      "height": 1316
    }
];

    