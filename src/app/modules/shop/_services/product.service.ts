import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../public/environment/environment';

@Injectable({ providedIn: 'root' })
// export class ProductService {
// private initialProducts: Product[] = [
//   {
//     id: '1',
//     name: 'Sunset Boulevard',
//     description: 'A dreamy sunset captured in Venice.',
//     size: [{ name: '24x24', amount: 50 }],
//     year: 2023,
//     price: 160,
//     print: [{ name: 'Matte', amount: 20 }],
//     mainImage: 'https://picsum.photos/id/1015/600/400',
//     images: [
//       'https://picsum.photos/id/1015/600/400',
//       'https://picsum.photos/id/1016/600/400',
//       'https://picsum.photos/id/1018/600/400'
//     ]
//   },
//   {
//     id: '2',
//     name: 'Urban Jungle',
//     description: 'The chaos and beauty of Lagos city life.',
//     size: [{ name: '30x40', amount: 70 }],
//     year: 2023,
//     price: 160,
//     print: [{ name: 'Glossy', amount: 25 }],
//     mainImage: 'https://picsum.photos/id/1024/600/400',
//     images: [
//       'https://picsum.photos/id/1024/600/400',
//       'https://picsum.photos/id/1027/600/400',
//       'https://picsum.photos/id/1025/600/400'
//     ]
//   },
//   {
//     id: '3',
//     name: 'Mountain Whisper',
//     description: 'Stillness in the cold mountain air.',
//     size: [{ name: '18x24', amount: 45 }],
//     year: 2023,
//     price: 160,
//     print: [{ name: 'Canvas', amount: 30 }],
//     mainImage: 'https://picsum.photos/id/1036/600/400',
//     images: [
//       'https://picsum.photos/id/1036/600/400',
//       'https://picsum.photos/id/1042/600/400',
//       'https://picsum.photos/id/1035/600/400'
//     ]
//   },
//   {
//     id: '4',
//     name: 'Vintage Reflection',
//     description: 'Black and white portrait with deep emotion.',
//     size: [{ name: '16x20', amount: 40 }],
//     year: 2023,
//     price: 160,
//     print: [{ name: 'Lustre', amount: 22 }],
//     mainImage: 'https://picsum.photos/id/1020/600/400',
//     images: [
//       'https://picsum.photos/id/1020/600/400',
//       'https://picsum.photos/id/1021/600/400',
//       'https://picsum.photos/id/1022/600/400'
//     ]
//   },
//   {
//     id: '5',
//     name: 'Still Life in Blue',
//     description: 'Calm ocean scene from a private island shoot.',
//     size: [{ name: '20x30', amount: 65 }],
//     year: 2023,
//     price: 160,
//     print: [{ name: 'Glossy', amount: 18 }],
//     mainImage: 'https://picsum.photos/id/1040/600/400',
//     images: [
//       'https://picsum.photos/id/1040/600/400',
//       'https://picsum.photos/id/1041/600/400',
//       'https://picsum.photos/id/1039/600/400'
//     ]
//   },
//   {
//     id: '6',
//     name: 'Golden Steps',
//     description: 'Architecture meets golden hour light.',
//     size: [{ name: '36x48', amount: 120 }],
//     year: 2023,
//     price: 12220,
//     print: [{ name: 'Metal', amount: 50 }],
//     mainImage: 'https://picsum.photos/id/1050/600/400',
//     images: [
//       'https://picsum.photos/id/1050/600/400',
//       'https://picsum.photos/id/1051/600/400',
//       'https://picsum.photos/id/1052/600/400'
//     ]
//   },
//   {
//     id: '7',
//     name: 'After the Rain',
//     description: 'Street reflection of neon signs.',
//     size: [{ name: '24x36', amount: 55 }],
//     year: 2023,
//     price: 160,
//     print: [{ name: 'Acrylic', amount: 28 }],
//     mainImage: 'https://picsum.photos/id/1060/600/400',
//     images: [
//       'https://picsum.photos/id/1060/600/400',
//       'https://picsum.photos/id/1062/600/400',
//       'https://picsum.photos/id/1063/600/400'
//     ]
//   },
//   {
//     id: '8',
//     name: 'Portrait of Time',
//     description: 'A detailed portrait capturing wisdom and age.',
//     size: [{ name: '11x14', amount: 35 }],
//     year: 2023,
//     price: 160,
//     print: [{ name: 'Matte', amount: 16 }],
//     mainImage: 'https://picsum.photos/id/1074/600/400',
//     images: [
//       'https://picsum.photos/id/1074/600/400',
//       'https://picsum.photos/id/1076/600/400',
//       'https://picsum.photos/id/1075/600/400'
//     ]
//   },
//   {
//     id: '9',
//     name: 'Hidden Trail',
//     description: 'Nature trail tucked in early morning mist.',
//     size: [{ name: '20x20', amount: 48 }],
//     year: 2023,
//     price: 160,
//     print: [{ name: 'Canvas', amount: 21 }],
//     mainImage: 'https://picsum.photos/id/1084/600/400',
//     images: [
//       'https://picsum.photos/id/1084/600/400',
//       'https://picsum.photos/id/1085/600/400',
//       'https://picsum.photos/id/1082/600/400',
//       'https://picsum.photos/id/1090/600/400',
//       'https://picsum.photos/id/1091/600/400',
//       'https://picsum.photos/id/1092/600/400',
//       'https://picsum.photos/id/1084/600/400',
//       'https://picsum.photos/id/1085/600/400',
//       'https://picsum.photos/id/1082/600/400',
//       'https://picsum.photos/id/1090/600/400',
//       'https://picsum.photos/id/1091/600/400',
//       'https://picsum.photos/id/1092/600/400'
//     ]
//   },
//   {
//     id: '10',
//     name: 'Colorful Silence',
//     description: 'A minimalist composition of bold colors.',
//     size: [{ name: '12x12', amount: 30 }],
//     year: 2024,
//     price: 125,
//     print: [{ name: 'None', amount: 0 }],
//     mainImage: 'https://picsum.photos/id/1090/600/400',
//     images: [
//       'https://picsum.photos/id/1090/600/400',
//       'https://picsum.photos/id/1091/600/400',
//       'https://picsum.photos/id/1092/600/400'
//     ]
//   }
// ];



//   private productsSubject = new BehaviorSubject<Product[]>(this.initialProducts);
//   products$ = this.productsSubject.asObservable();

//   get products(): Product[] {
//     return this.productsSubject.value;
//   }

//   // addProduct, updateProduct, removeProduct methods here as before
// }
export class ProductService {
  private baseUrl = `${environment.BASE_URL}Products`;

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  get products(): Product[] {
    return this.productsSubject.value;
  }

  // GET /api/Products with pagination
  getProducts(pageNumber = 1, pageSize = 10): Observable<Product[]> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<Product[]>(this.baseUrl, { params });
  }

  // GET /api/Products/{id}
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  // POST /api/Products
  createProduct(product: any): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  // PUT /api/Products/{id}
  updateProduct(id: string, product: any): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  // DELETE /api/Products/{id}
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Optional - Sync local state if needed
  setLocalProducts(products: Product[]): void {
    this.productsSubject.next(products);
  }


  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(`${'https://server.bennyhosea.com/api/Upload/image'}`, formData);
  }
}
