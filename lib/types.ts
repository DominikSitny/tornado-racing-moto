export interface Part {
  id: string;
  name: string;
  description: string;
  image: string;
  price?: string;
}

export interface Model {
  id: string;
  brand: string;
  designation: string;
  description: string;
  parts: Part[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
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
