import { MathService } from './math.service';
import { SettingsService } from './settings.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three-full';

@Injectable()
export class SceneService {
  R = 250;
  camera;
  scene;
  renderer;
  cameraTheta = Math.PI / 2;
  cameraPhi = 0;
  sunTheta = Math.PI / 3;
  sunPhi = Math.PI / 3 * 4;
  objectRotationX = -1 * Math.PI / 2.1;
  objectRotationY = 1 * Math.PI / 2.3;
  objectRotationZ = 1 * Math.PI / 3;
  size = 100;
  light = new THREE.DirectionalLight( 0xffffff, 0.9 );
  material = new THREE.MeshLambertMaterial({color: "hsl(1, 0%, 100%)", side: THREE.DoubleSide});

  constructor(
    private settings: SettingsService,
    private math: MathService
  ) {}

  init() {
    let cds;

    // if (!Detector.webgl) Detector.addGetWebGLMessage();

    this.scene = new THREE.Scene();

    this.material = new THREE.MeshLambertMaterial({color: "hsl(1, 0%, 100%)", side: THREE.DoubleSide});
    this.renderer = new THREE.WebGLRenderer({alpha: true});
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize(this.size, this.size);
    this.renderer.shadowMap.enabled = true;

    if (this.settings.processType === 'test' || this.settings.processType === 'log' || this.settings.processType === 'testCountСharacteristics') {
      var container = document.getElementById('scene');
      container.appendChild(this.renderer.domElement);
    }

    // camera = new THREE.PerspectiveCamera( 60, 1, 1, 10000 );
    this.camera = new THREE.OrthographicCamera( this.R / - 2, this.R / 2, this.R / 2, this.R / - 2, 1, 10000 );
    cds = this.math.sphericToCortesian(this.R, this.cameraTheta, this.cameraPhi);
    this.camera.position.set(cds.x, cds.z, cds.y);

    cds = this.math.sphericToCortesian(this.R, this.sunTheta, this.sunPhi);
    this.light.position.set(cds.x, cds.z, cds.y);

    this.light.castShadow = true;
    this.light.shadow.camera.visible  = true;
    this.light.shadow.camera.right    =  250;
    this.light.shadow.camera.left     = -250;
    this.light.shadow.camera.top      =  250;
    this.light.shadow.camera.bottom   = -250;
    this.light.shadow.mapSize.width   = 1024;
    this.light.shadow.mapSize.height  = 1024;

    this.scene.add(this.light);

    this.camera.data = {};
    this.light.data = {};
  }
}
