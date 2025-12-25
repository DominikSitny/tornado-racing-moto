export interface Part {
  id: string;
  name: string;
  name_en?: string;
  name_pl?: string;
  description: string;
  description_en?: string;
  description_pl?: string;
  image: string;
  price?: string;
}

export interface Model {
  id: string;
  brand: string;
  designation: string;
  description: string;
  description_en?: string;
  description_pl?: string;
  parts: Part[];
}

export interface Category {
  id: string;
  name: string;
  name_en?: string;
  name_pl?: string;
  description: string;
  description_en?: string;
  description_pl?: string;
  models: Model[];
}

export interface Catalog {
  categories: Category[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Helper type for locale
export type Locale = 'de' | 'en' | 'pl';
