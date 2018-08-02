import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { DifferentPrimitivesComponent } from "./different-primitives/different-primitives.component";
import { TheRedCubeComponent } from "./the-red-cube/the-red-cube.component";

const APP_ROUTES: Routes = [
  { path: '', component: MainComponent },
  { path: 'different-primitives', component: DifferentPrimitivesComponent },
  { path: 'the-red-cube', component: TheRedCubeComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES, { useHash: true })
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class AppRouterModule {}