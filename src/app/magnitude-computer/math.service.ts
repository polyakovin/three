import { Injectable } from '@angular/core';

@Injectable()
export class MathService {

  constructor() {}

  sphericToCortesian(r, theta, phi) {
    return {
      x: r * Math.sin(theta) * Math.cos(phi),
      y: r * Math.sin(theta) * Math.sin(phi),
      z: r * Math.cos(theta)
    };
  }
}
