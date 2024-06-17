import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'index.html', pathMatch: 'full' },
    { path: 'index.html', redirectTo: '', pathMatch: 'full' },
    { path: '', loadChildren: () => import('./features/products/products.routes').then(m => m.productsRoutes) },
    { path: 'examples', loadChildren: () => import('./features/examples/examples.routes').then(m => m.examplesRoutes) }
];
