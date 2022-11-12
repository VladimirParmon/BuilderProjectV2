import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './components/core/view/view.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { Page404Component } from './pages/page404/page404.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: 'view/:id',
        component: ViewComponent,
      },
    ],
  },
  {
    path: 'about',
    component: AboutPageComponent,
  },
  {
    path: '**',
    component: Page404Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
