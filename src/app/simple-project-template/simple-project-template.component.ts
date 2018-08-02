import { Component, OnInit } from '@angular/core';
import * as THREE from 'three-full';

@Component({
  selector: 'app-simple-project-template',
  templateUrl: './simple-project-template.component.html',
  styleUrls: ['./simple-project-template.component.scss']
})
export class SimpleProjectTemplateComponent implements OnInit {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  // stats = new THREE.Stats();
  camera;

  constructor() { }

  ngOnInit() {
    this.initScene();
    this.setProject();
    this.render();
  }

  initScene() {
    this.renderer.setClearColor(new THREE.Color(0xEEEEEE));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("WebGL_output").appendChild(this.renderer.domElement);

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    window.addEventListener("resize", () => {
      var width = window.innerWidth;
      var height = window.innerHeight;
      this.renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });

    // this.stats.setMode(0);
    // document.getElementById("WebGL_output").appendChild(this.stats.domElement);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    // this.stats.update();
  }

  setProject() {
    // прогать тут
  }
}
