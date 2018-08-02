import { SceneService } from './scene.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three-full';

@Injectable()
export class ModelsService {
  hubbleParts = [];
  hubble = new THREE.Object3D();
  // hubble = new THREE.Group();

  constructor(private scene: SceneService) { }

  researchModel(model, run) {
    switch (model) {
      case 'plane':
        this.scene.R = 300;

        // var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
        var geometry = new THREE.PlaneBufferGeometry( 200, 200, 1 );
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        var plane = new THREE.Mesh(geometry, this.scene.material);
        plane.rotation.y = Math.PI / 2;
        this.scene.scene.add(plane);
        run();
        break;


      case 'sphere':
        this.scene.R = 250;

        var geometry = new THREE.SphereBufferGeometry( 100, 32, 32 );
        var sphere = new THREE.Mesh(geometry, this.scene.material);
        this.scene.scene.add( sphere );
        run();
        break;


      case 'torus':
        this.scene.R = 200;

        var loader = new THREE.STLLoader();
        loader.load('./assets/models/stl/torus.stl', geometry => {
          var mesh = new THREE.Mesh(geometry, this.scene.material);
          this.scene.scene.add(mesh);
          run();
        });
        break;


      case 'hubble':
        this.scene.R = 7500;

        var loader = new THREE.TDSLoader();
        loader.load('./assets/models/3ds/Hubble.3ds', object => {
          for (const child of object.children) {
            let mesh = new THREE.Mesh(child.geometry, this.scene.material);
            mesh.position.y = -50;
            mesh.scale.set(0.25, 0.25, 0.25);
            this.scene.scene.add(mesh);
          }
          run();
        });
        break;


      case 'hubble_primitive':
        this.scene.R = 250;

        // цилиндр
        var geometry = new THREE.CylinderBufferGeometry(30, 30, 60, 32);
        this.hubbleParts.push(new THREE.Mesh(geometry, this.scene.material));
        // this.scene.scene.add(this.hubbleParts[this.hubbleParts.length - 1]);
        this.hubbleParts[this.hubbleParts.length - 1].position.y = 60;
        // cylinder_1.rotation.z = Math.PI / 2;
        // cylinder_1.rotation.x = Math.PI / 2;
        // cylinder_1.position.x = 60;

        // цилиндр
        var geometry = new THREE.CylinderBufferGeometry(20, 20, 100, 32);
        this.hubbleParts.push(new THREE.Mesh(geometry, this.scene.material));
        // this.scene.scene.add(this.hubbleParts[this.hubbleParts.length - 1]);
        this.hubbleParts[this.hubbleParts.length - 1].position.y = -20;
        // cylinder_2.rotation.z = Math.PI / 2;
        // cylinder_2.rotation.x = Math.PI / 2;
        // cylinder_2.position.x = -20;

        // крышка
        var geometry = new THREE.PlaneBufferGeometry( 30, 30, 1 );
        this.hubbleParts.push(new THREE.Mesh(geometry, this.scene.material));
        this.hubbleParts[this.hubbleParts.length - 1].rotation.y = -Math.PI / 2;
        // plane.rotation.z = -Math.PI / 6;
        this.hubbleParts[this.hubbleParts.length - 1].position.y = -85;
        this.hubbleParts[this.hubbleParts.length - 1].position.x = 15;
        // this.scene.scene.add(this.hubbleParts[this.hubbleParts.length - 1]);

        // батарея
        this.scene.material = new THREE.MeshPhongMaterial({color: "hsl(200, 70%, 30%)", side: THREE.DoubleSide});
        var geometry = new THREE.PlaneBufferGeometry( 40, 100, 1 );
        this.hubbleParts.push(new THREE.Mesh(geometry, this.scene.material));
        this.hubbleParts[this.hubbleParts.length - 1].position.y = 20;
        // battery_1.position.x = 15;
        this.hubbleParts[this.hubbleParts.length - 1].position.z = 50;
        this.hubbleParts[this.hubbleParts.length - 1].rotation.y = -Math.PI / 2;
        // plane.rotation.x = -Math.PI / 6;
        // this.scene.scene.add(this.hubbleParts[this.hubbleParts.length - 1]);

        // батарея
        var geometry = new THREE.PlaneBufferGeometry( 40, 100, 1 );
        this.hubbleParts.push(new THREE.Mesh(geometry, this.scene.material));
        this.hubbleParts[this.hubbleParts.length - 1].position.y = 20;
        // battery_1.position.x = 15;
        this.hubbleParts[this.hubbleParts.length - 1].position.z = -50;
        this.hubbleParts[this.hubbleParts.length - 1].rotation.y = -Math.PI / 2;
        // plane.rotation.x = -Math.PI / 6;
        // this.scene.scene.add(this.hubbleParts[this.hubbleParts.length - 1]);

        // включаем тени
        for (let hubblePart of this.hubbleParts) {
          this.hubble.add(hubblePart);
          hubblePart.castShadow = true;
          hubblePart.receiveShadow = true;
        }
        this.scene.scene.add(this.hubble);

        run();
        break;


      case 'pkl':
        this.scene.R = 8000;

        var loader = new THREE.TDSLoader();
        loader.load('./PK-L(0.5).3ds', object => {
          for (const child of object.children) {
            let mesh = new THREE.Mesh(child.geometry, this.scene.material);
            mesh.position.y = 50;
            mesh.scale.set(0.15, 0.15, 0.15);
            this.scene.scene.add(mesh);
          }
          run();
        });
        break;
    }
  }
}
