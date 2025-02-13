import { ICategory } from "./category";

export interface IProduct {
  _id?: string;
  name: string;
  description?: string;
  image: string;
  price: number;
  categoryId: ICategory;
  createdAt?: string;
  updatedAt?: string;
}
