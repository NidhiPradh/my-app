export interface Product {
  productID?: number;
  productName: string;
  productCategory?: string;
  batchNumber?: string;
  recievedDate?: string;
  productStatus?: string;
  manufactureDate?: string ;
  expiryDate?: string;
  createdBy?: number;
  createdOn?: string;
  updatedBy?: number | null;
  updatedOn?: string | null;
}
