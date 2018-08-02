import { Component, OnInit } from '@angular/core';
import * as THREE from 'three-full';

@Component({
  selector: 'app-drag-n-drop',
  templateUrl: './drag-n-drop.component.html',
  styleUrls: ['./drag-n-drop.component.scss']
})
export class DragNDropComponent implements OnInit {
  renderer = new THREE.WebGLRenderer();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  plane;
  selectedObject;
  offset = new THREE.Vector3();
  objects = [];

  constructor() { }

  ngOnInit() {
    this.initScene();
    this.initDragNDrop();
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => {
      this.render();
    });
  }


  initScene() {
    this.addCamera();
    this.addRenderer();
    this.addLight();
    this.addRealPlane();
    this.addFakePlane();
    this.addCylinder();
    this.addCube();
    this.addSphere();
  }

  addCamera() {
    this.camera.position.x = 10;
    this.camera.position.y = 10;
    this.camera.position.z = 30;
    this.camera.lookAt(this.scene.position);
  }

  addRenderer() {
    this.renderer.setClearColor(0xffffff);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("WebGL_output").appendChild(this.renderer.domElement);
  }

  addLight() {
    var dirLight = new THREE.DirectionalLight();
    dirLight.position.set(25, 23, 15);
    this.scene.add(dirLight);

    var dirLight2 = new THREE.DirectionalLight();
    dirLight2.position.set(-25, 23, 15);
    this.scene.add(dirLight2);
  }

  addRealPlane() {
    var planeGeometry = new THREE.PlaneBufferGeometry(50,50,1,1);
    var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
    var planeReal = new THREE.Mesh(planeGeometry,planeMaterial);

    planeReal.rotation.x=-0.5*Math.PI;
    planeReal.position.x = 0;
    planeReal.position.y = -1;
    planeReal.position.z = 0;

    this.scene.add(planeReal);
  }

  addFakePlane() {
    var planeG = new THREE.PlaneBufferGeometry(2000, 2000, 18, 18)
    var planeM = new THREE.MeshBasicMaterial({visible: false});
    this.plane = new THREE.Mesh(planeG, planeM);

    this.plane.rotation.x=-0.5*Math.PI;
    this.plane.position.x = 0;
    this.plane.position.y = 0;
    this.plane.position.z = 0;

    this.scene.add(this.plane);
  }

  addCylinder() {
    var cylinderGeometry = new THREE.CylinderGeometry( 1, 1, 2, 100, 1, false );
    var cylinderMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});
    cylinderMaterial.transparent = true;
    var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

    cylinder.position.x = Math.random() * 10 - 5;
    cylinder.position.y = 0;
    cylinder.position.z = Math.random() * 10 - 5;

    this.scene.add(cylinder);
    this.objects.push(cylinder);
  }

  addCube() {
    var cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
    cubeMaterial.transparent = true;
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    cube.position.x = Math.random() * 10 - 5;
    cube.position.y = 0;
    cube.position.z = Math.random() * 10 - 5;

    this.scene.add(cube);
    this.objects.push(cube);
  }

  addSphere() {
    var sphereGeometry = new THREE.SphereGeometry(1, 30, 30);
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff});
    sphereMaterial.transparent = true;
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.x = Math.random() * 10 - 5;
    sphere.position.y = 0;
    sphere.position.z = Math.random() * 10 - 5;

    this.scene.add(sphere);
    this.objects.push(sphere);
  }


  initDragNDrop() {
    document.onmousedown = event => {
      this.selectObject(event);
    };

    document.onmousemove = event => {
      this.moveObject(event);
    };

    document.onmouseup = event => {
      this.deselectObject(event);
    };
  }

  selectObject(event) {
    // получаем координаты курсора
    var mouse_x = ( event.clientX / window.innerWidth ) * 2 - 1;
    var mouse_y = -( event.clientY / window.innerHeight ) * 2 + 1;

    // переводим координаты курсора на плоскости в координаты курсора в пространстве
    var vector = new THREE.Vector3(mouse_x, mouse_y, 0.5);
    vector.unproject(this.camera);

    // получаем все объекты пересекающиеся с нормалью к плоскости монитора, проведённой из точки положения курсора
    var raycaster = new THREE.Raycaster(this.camera.position,
        vector.sub(this.camera.position).normalize());

    // определяем место, где произошёл клик
    var intersects = raycaster.intersectObjects(this.objects);

    if (intersects.length > 0) {
      // определяем объект по которому кликнули
      this.selectedObject = intersects[0].object;

      // вычисляем расстояние между центрами объекта и вспомогательной плоскостью
      var intersects = raycaster.intersectObject(this.plane);

      this.offset.copy(intersects[0].point).sub(this.plane.position);
    }
  }

  moveObject(event) {
    // получаем координаты курсора
    var mouse_x = ( event.clientX / window.innerWidth ) * 2 - 1;
    var mouse_y = -( event.clientY / window.innerHeight ) * 2 + 1;

    // переводим координаты курсора на плоскости в координаты курсора в пространстве
    var vector = new THREE.Vector3(mouse_x, mouse_y, 0.5);
    vector.unproject(this.camera);

    // получаем все объекты пересекающиеся с нормалью к плоскости монитора, проведённой из точки положения курсора
    var raycaster = new THREE.Raycaster(this.camera.position,
        vector.sub(this.camera.position).normalize());

    var intersectedObjects = raycaster.intersectObjects(this.objects);
    this.changeCursorStyleOver(intersectedObjects);

    // проверяем, нажали ли мы на какой-либо объект
    if (this.selectedObject) {
      // определяем место, где произошло нажатие по объекту
      var intersects = raycaster.intersectObject(this.plane);

      // помещаем объект в соответствующее место на сцене
      this.selectedObject.position.copy(intersects[0].point.sub(this.offset));
    } else {
      // отслеживаем позицию перемещаемого объекта (чтобы не было скачков в начало координат)
      if (intersectedObjects.length > 0) {
        this.plane.position.copy(intersectedObjects[0].object.position);
      }
    }
  }

  deselectObject(event) {
    this.selectedObject = null;
  }

  changeCursorStyleOver(intersectedObjects) {
    if (intersectedObjects.length > 0) {
      $('html,body').css('cursor', 'move');
    } else {
      $('html,body').css('cursor', 'default');
    }
  }
}
