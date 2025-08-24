import { Routes } from '@angular/router';
import { NotFoundPage } from './shared/components/not-found-page/not-found-page';

export const routes: Routes = [
    { path: '', loadChildren: () => import('./modules/pages/pages-module').then(x => x.PagesModule) },
    { path: 'app', loadChildren: () => import('./modules/main/main-module').then(x => x.MainModule) },
    { path: 'auth', loadChildren: () => import('./modules/authentication/authentication-module').then(x => x.AuthenticationModule) },
    { path: 'store', loadChildren: () => import('./modules/shop/shop-module').then(x => x.ShopModule) },
    { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(x => x.AdminModule) },
//  { path: '**', redirectTo: '/not-found', pathMatch: 'full' },
//   { path: 'not-found', component: NotFoundPage },
];
