import { Component, OnInit } from '@angular/core';
import * as THREE from 'three-full';
import * as Stats from 'stats-js';

@Component({
  selector: 'app-the-red-cube',
  templateUrl: './the-red-cube.component.html',
  styleUrls: ['./the-red-cube.component.scss']
})
export class TheRedCubeComponent implements OnInit {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  stats = new Stats();
  camera;
  cube;
  i = 0;

  constructor() { }

  ngOnInit() {
    console.log(THREE)
    this.initScene();
    this.setProject();
    this.render();
  }

  initScene() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(new THREE.Color(0xEEEEEE));
    document.getElementById("WebGL_output").appendChild(this.renderer.domElement);

    // камера
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // отслеживание изменения размера окна браузера
    window.addEventListener("resize", () => {
      var width = window.innerWidth;
      var height = window.innerHeight;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    });

    // статистика
    // this.stats.setMode(0);
    // document.getElementById("WebGL_output").appendChild(this.stats.domElement);
    this.stats.domElement.style.position	= 'absolute';
    this.stats.domElement.style.right	= '0';
    this.stats.domElement.style.top	= '0';
    document.getElementById("WebGL_output").appendChild(this.stats.domElement);


    var light = new THREE.AmbientLight(0xffffff);
    var light_1 = new THREE.PointLight(0xffffff, 1, 1000);
    light_1.position.x = 0;
    light_1.position.y = 0;
    light_1.position.z = 0;

    this.scene.add(light);
    this.scene.add(light_1);
    // прогать тут



    // тест анимации
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.cube.position.x = 0;
    this.cube.position.y = 0;
    this.cube.position.z = 0;
    this.camera.position.z = 10;
    this.scene.add(this.cube);

    this.render();
  }

  render() {
    this.i = this.i + 1;
    this.cube.position.x = Math.cos(this.i * 0.01)*2;
    this.cube.position.y = Math.sin(this.i * 0.01)/2;
    this.cube.rotation.y += 0.01;
    this.cube.rotation.z += 0.01;

    requestAnimationFrame(() => {
      this.render();
    });

    this.renderer.render(this.scene, this.camera);
    this.stats.update(this.renderer);
    // this.stats.update();
  }

  setProject() {
    // прогать тут
  }
}
