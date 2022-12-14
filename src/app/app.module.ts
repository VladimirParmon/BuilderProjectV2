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
import { reducers } from 'src/redux/reducers/index.reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmActionComponent } from './components/modals/confirm-action/confirm-action.component';
import { EnterNameComponent } from './components/modals/enter-name/enter-name.component';
import { ChooseFileComponent } from './components/modals/choose-file/choose-file.component';
import { FileUploadDNDDirective } from './directives/file-upload-dnd.directive';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { LetModule } from '@ngrx/component';
import { GalleryModule } from 'ng-gallery';

import { QuillModule } from 'ngx-quill';
import { CollageComponent } from './components/tools/collage/collage.component';
import { PDFComponent } from './components/tools/pdf/pdf.component';
import { VideoComponent } from './components/tools/video/video.component';
import { metaReducers } from 'src/redux/reducers/index.reducers';
import { AudioComponent } from './components/tools/audio/audio.component';
import { SliderComponent } from './components/tools/slider/slider.component';
import { FullscreenDirective } from './directives/fullscreen.directive';
import { FsListenerDirective } from './directives/fs-listener.directive';
import { ChartComponent } from './components/tools/chart/chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BarVerticalComponent } from './components/tools/chart/bar-vertical/bar-vertical.component';
import { PieComponent } from './components/tools/chart/pie/pie.component';
import { ChooseChartComponent } from './components/modals/choose-chart/choose-chart.component';
import { ItemsListComponent } from './components/tools/chart/items-list/items-list.component';
import { ChartSizeComponent } from './components/tools/chart/chart-size/chart-size.component';
import { CustomLegendComponent } from './components/tools/chart/custom-legend/custom-legend.component';

import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';

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
    ConfirmActionComponent,
    EnterNameComponent,
    ChooseFileComponent,
    FileUploadDNDDirective,
    CollageComponent,
    PDFComponent,
    VideoComponent,
    AudioComponent,
    SliderComponent,
    FullscreenDirective,
    FsListenerDirective,
    ChartComponent,
    BarVerticalComponent,
    PieComponent,
    ChooseChartComponent,
    ItemsListComponent,
    ChartSizeComponent,
    CustomLegendComponent,
    WelcomePageComponent,
  ],
  imports: [
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    DragDropModule,
    HttpClientModule,
    BrowserModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({}),
    BrowserAnimationsModule,
    QuillModule.forRoot(),
    MatSnackBarModule,
    MatSelectModule,
    MatRadioModule,
    LetModule,
    GalleryModule,
    NgxChartsModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
