import { Component, OnInit } from '@angular/core';
import * as THREE from 'three-full';

@Component({
  selector: 'app-the-red-cube',
  templateUrl: './the-red-cube.component.html',
  styleUrls: ['./the-red-cube.component.scss']
})
export class TheRedCubeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log(THREE);
  }

}
