import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { Page404Component } from './pages/page404/page404.component';
import { ViewComponent } from './components/core/view/view.component';
import { HeaderComponent } from './components/core/header/header.component';
import { ContentsComponent } from './components/core/contents/contents.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ToolGeneratorComponent } from './components/tool-generator/tool-generator.component';
import { TextComponent } from './components/tools/text/text.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    AboutPageComponent,
    Page404Component,
    ViewComponent,
    HeaderComponent,
    ContentsComponent,
    ToolbarComponent,
    ToolGeneratorComponent,
    TextComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({}, {}),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
