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
import { TheRedCubeComponent } from './the-red-cube/the-red-cube.component';
import { DifferentPrimitivesComponent } from './different-primitives/different-primitives.component';
import { SimpleProjectTemplateComponent } from './simple-project-template/simple-project-template.component';
import { DragNDropComponent } from './drag-n-drop/drag-n-drop.component';

import { MagnitudeComputerComponent } from './magnitude-computer/magnitude-computer.component';
import { HelpersService } from './magnitude-computer/helpers.service';
import { SettingsService } from './magnitude-computer/settings.service';
import { SceneService } from './magnitude-computer/scene.service';
import { MathService } from './magnitude-computer/math.service';
import { ModelsService } from './magnitude-computer/models.service';

import { HttpService } from './http.service';

mergeAllIconsToOneObject();

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    TheRedCubeComponent,
    DifferentPrimitivesComponent,
    SimpleProjectTemplateComponent,
    DragNDropComponent,
    MagnitudeComputerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouterModule,
    FontAwesomeModule
  ],
  providers: [
    HttpService,
    HelpersService,
    MathService,
    ModelsService,
    SceneService,
    SettingsService
  ],
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