import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRouterModule } from "./app.routing";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { MainComponent } from './main/main.component';
import { AppComponent } from './app.component';
import { HttpService } from './http.service';
import { TheRedCubeComponent } from './the-red-cube/the-red-cube.component';
import { DifferentPrimitivesComponent } from './different-primitives/different-primitives.component';
import { SimpleProjectTemplateComponent } from './simple-project-template/simple-project-template.component';
import { DragNDropComponent } from './drag-n-drop/drag-n-drop.component';

mergeAllIconsToOneObject();

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    TheRedCubeComponent,
    DifferentPrimitivesComponent,
    SimpleProjectTemplateComponent,
    DragNDropComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouterModule,
    FontAwesomeModule
  ],
  providers: [ HttpService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

function mergeAllIconsToOneObject() {
  let fa = {...fas, ...fab};
  for (const icon in fa) {
    fa[icon].prefix = 'fas';
  }
  library.add(fa);
}