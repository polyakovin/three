import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {
  step = 0.03; // 0.15
  normize = true;
  logarithmic = true;
  showObjectOnPlot = true;

  processTypes = [
    'log',
    'test',
    'testCount',
    'testCountСharacteristics',
    'countСharacteristics',
    'checkPrimitives',
    'showPlot3D'
  ];
  processType = 'checkPrimitives';

  models = [
    'plane',
    'sphere',
    'torus',
    'hubble_primitive',
    // 'hubble',
    // 'pkl'
  ];
  model = 'hubble_primitive';

  dataForPlot3D = 'hubble_primitives'
    // hubble_primitives
}
