import { Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProductsFormComponent } from './products-form/products-form.component';

export const productsRoutes: Routes = [
    { path: '', component: ProductsComponent },
    { path: 'new', component: ProductsFormComponent },
    { path: 'product/:id', component: ProductsFormComponent }
];
