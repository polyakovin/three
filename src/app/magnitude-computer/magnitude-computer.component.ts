import { Component, OnInit } from '@angular/core';
import { HelpersService } from './helpers.service';
import { SettingsService } from './settings.service';
import { SceneService } from './scene.service';
import { MathService } from './math.service';
import { ModelsService } from './models.service';
import * as Plotly from 'plotly.js-dist';

@Component({
  selector: 'app-magnitude-computer',
  templateUrl: './magnitude-computer.component.html',
  styleUrls: ['./magnitude-computer.component.scss']
})
export class MagnitudeComputerComponent implements OnInit {
  output = [];
  done = false;

  constructor(
    private models: ModelsService,
    private math: MathService,
    public scene: SceneService,
    public settings: SettingsService,
    private helpers: HelpersService
  ) {}

  ngOnInit() {
    this.start();
  }

  start() {
    this.output = [];
    document.getElementById('plot').innerHTML = "";
    document.getElementById('scene').innerHTML = "";

    let cds;
    this.scene.init();
    this.models.researchModel(this.settings.model, () => {
      cds = this.math.sphericToCortesian(this.scene.R, this.scene.cameraTheta, this.scene.cameraPhi);
      this.scene.camera.position.set(cds.x, cds.z, cds.y);
      this.run();
    });
  }

  run() {
    if (this.settings.processType === 'test') {
      this.scene.renderer.setSize(500, 500);
      this.render();
      this.animate();


    } else if (this.settings.processType === 'log') {
      this.render();
      console.log(this.output);
      this.helpers.saveIntoFile(this.output);


    } else if (this.settings.processType === 'testCount') {
      let start = +(new Date());

      let testsAmount = 1;
      for (let i = 0; i < testsAmount; i++) {
        this.scene.cameraPhi = -Math.PI;
        while (this.scene.cameraPhi <= Math.PI) {
          const cds = this.math.sphericToCortesian(this.scene.R, this.scene.cameraTheta, this.scene.cameraPhi);
          this.scene.camera.position.set(cds.x, cds.z, cds.y);
          this.scene.camera.lookAt(0, 0, 0);
          this.render();
          this.scene.cameraPhi = +(this.scene.cameraPhi + this.settings.step).toFixed(2);
        }
      }

      let end = +(new Date());

      let c = 0;
      while (this.scene.cameraTheta < Math.PI) {
        while (this.scene.cameraPhi < Math.PI * 2) {
          this.scene.cameraPhi = +(this.scene.cameraPhi + this.settings.step + Math.abs(this.scene.cameraTheta - Math.PI / 2)).toFixed(2);
          c++;
        }

        this.scene.cameraPhi = 0;
        this.scene.cameraTheta = +(this.scene.cameraTheta + this.settings.step).toFixed(2);
      }

      let secondsSpent = +((end - start) / 1000 / testsAmount).toFixed(2);
      let totalSeconds = +(secondsSpent * c * c).toFixed(0);
      console.log(c)
      let totalMinutes = +(totalSeconds / 60).toFixed(0);
      let totalHours = Math.floor(totalMinutes / 60);

      console.log('');
      console.log('Один цикл длится примерно ' + secondsSpent + ' с.');
      console.log('');
      console.log('Время полного расчёта индикатрисы рассеяния выбранной модели составит примерно ' + totalSeconds + ' с.');
      console.log('или ' + totalMinutes + ' мин.');
      console.log('или ' + totalHours + ' ч. ' + (totalMinutes - totalHours * 60) + ' мин.');

      let Ms = this.output.map(o => o.M);
      let X = this.output.map(o => o.cameraPhi);

      if (this.settings.normize) {
        // ищем максимум
        let Mmax = 0;
        for (let M of Ms) {
          if (M > Mmax) {
            Mmax = M;
          }
        }
        // нормируем
        for (let i in Ms) {
          Ms[i] = Ms[i] / Mmax;
        }
      }

      let cosY;
      switch (this.settings.model) {
        case 'plane':
          cosY = X.map(x => {
            return Math.cos(x);
          });
          break;


        case 'sphere':
          cosY = X.map(x => {
            return x > 0 ?
              ((1 - x / Math.PI) * Math.cos(x) + 1 / Math.PI * Math.sin(x)) :
              ((1 + x / Math.PI) * Math.cos(-x) + 1 / Math.PI * Math.sin(-x));
          });
          break;


        default:
          // cosY = X.map(x => 0);
          cosY = X.map(x => {
            return x > 0 ?
              ((1 - x / Math.PI) * Math.cos(x) + 1 / Math.PI * Math.sin(x)) :
              ((1 + x / Math.PI) * Math.cos(-x) + 1 / Math.PI * Math.sin(-x));
          });
          break;
      }

      // рисуем график
      Plotly.newPlot('plot', {
        data: [{
          x: X,
          y: cosY,
          mode: 'lines',
          name: 'ожидания',
          type: 'scatter'
        }, {
          x: X,
          y: Ms,
          mode: 'markers',
          name: 'измерения',
          type: 'scatter'
          // z: [output.map(o => o.t), output.map(o => o.M)],
          // type: 'heatmap'
        }],
        layout: {
          xaxis: {
            title: 'phi'
          },
          yaxis: {
            title: 'M'
          }
        }
      });


    } else if (this.settings.processType === 'checkPrimitives') {
        // (this.scene.cameraTheta - Math.PI / 2)
        this.models.hubble.rotation.x = this.scene.objectRotationX;
        this.models.hubble.rotation.y = this.scene.objectRotationY;
        this.models.hubble.rotation.z = this.scene.objectRotationZ;

        const countIndicatrice = () => {
          this.output = [];
          this.scene.cameraPhi = -Math.PI;
          while (this.scene.cameraPhi <= Math.PI) {
            const cds = this.math.sphericToCortesian(this.scene.R, this.scene.cameraTheta, this.scene.cameraPhi);
            this.scene.camera.position.set(cds.x, cds.z, cds.y);
            this.scene.camera.lookAt(0, 0, 0);
            this.render();
            this.scene.cameraPhi = +(this.scene.cameraPhi + this.settings.step).toFixed(2);
          }

          return this.output.map(o => {
            return {
              M: o.M,
              cameraPhi: o.cameraPhi
            }
          });
        }

        const total = countIndicatrice();
        let summ = total.map(o => {
          return {
            M: 0,
            cameraPhi: o.cameraPhi
          };
        });
        for (let i in this.models.hubbleParts) {
          for (let hubblePart of this.models.hubbleParts) {
            this.models.hubble.remove(hubblePart);
          }
          this.models.hubble.add(this.models.hubbleParts[i]);
          const part = countIndicatrice();

          for (let j in summ) {
            summ[j].M += part[j].M;
          }
          // console.log(part, summ);
        }

        // // рисуем графики
        // Plotly.newPlot('plot', {
        //   data: [{
        //     x: total.map(t => t.cameraPhi),
        //     y: total.map(t => t.M),
        //     mode: 'lines',
        //     name: 'цельная модель',
        //     type: 'scatter'
        //   }, {
        //     x: summ.map(t => t.cameraPhi),
        //     y: summ.map(t => t.M),
        //     mode: 'lines',
        //     name: 'сумма элементов',
        //     type: 'scatter'
        //   }],
        //   layout: {
        //     xaxis: {
        //       title: 'phi'
        //     },
        //     yaxis: {
        //       title: 'M'
        //     }
        //   }
        // });

        if (this.settings.logarithmic) {
          for (const i in total) {
            total[i].M = Math.log10(total[i].M);
            summ[i].M = Math.log10(summ[i].M);
          }
        }

        // ищем максимум
        let Mmax = 0;
        for (let s of summ) {
          if (s.M > Mmax) {
            Mmax = s.M;
          }
        }

        const maxTemp = 6.578892150072893;
        for (const i in total) {
          total[i].M = total[i].M / maxTemp;
          summ[i].M = summ[i].M / maxTemp;
        }
        // console.log(Mmax);
        Mmax = 1;

        const rSun = this.scene.sunTheta / (Math.PI / 2);

        // рисуем графики
        Plotly.newPlot('plot', {
          data: [{
            r: total.map(t => t.M),
            t: total.map(t => t.cameraPhi * 180 / Math.PI),
            mode: 'lines',
            line: {
              width: 2
            },
            name: 'цельная модель',
            type: 'scatter'
          }, {
            r: summ.map(t => t.M),
            t: summ.map(t => t.cameraPhi * 180 / Math.PI),
            mode: 'lines',
            line: {
              width: 2
            },
            name: 'сумма элементов',
            type: 'scatter'
          // }, {
          //   r: summ.map(t => 1.1 * Mmax),
          //   t: summ.map(t => t.cameraPhi * 180 / Math.PI),
          //   mode: 'lines',
          //   line: {
          //     color: 'rgb(210, 189, 0)',
          //     dash: 'dot',
          //     width: 1
          //   },
          //   name: 'Солнце',
          //   type: 'scatter'
          // }, {
          //   x: [0, 1.1 * Mmax * Math.cos(this.scene.sunPhi)],
          //   y: [0, 1.1 * Mmax * Math.sin(this.scene.sunPhi)],
          //   mode: 'lines',
          //   line: {
          //     color: 'rgb(210, 189, 0)',
          //     dash: 'dot',
          //     width: 1
          //   },
          //   name: 'Солнце',
          //   type: 'scatter'
          }, {
            r: [(1.1 * Mmax * rSun)],
            t: [(this.scene.sunPhi * 180 / Math.PI)],
            mode: 'markers',
            marker: {
              color: 'rgb(210, 189, 0)',
              size: 250,
              line: {color: 'white'}
            },
            name: 'Солнце',
            type: 'scatter'
          }],
          layout: {
            showlegend: false,
            // title: 'Индикатриса рассеяния',
            direction: {
              enumerated: "counterclockwise"
            },
            radialaxis: {
              // title: 'M',
              range: [0, 1.1 * Mmax],
              // visible: false
            },
            // xaxis: {
            //   title: 'phi'
            // },
            // yaxis: {
            //   title: 'M'
            // },
            // angularaxis: {tickcolor: 'rgb(253,253,253)'}
          }
        });

        // добавляем объект на график
        if (this.settings.showObjectOnPlot) {
          for (let hubblePart of this.models.hubbleParts) {
            this.models.hubble.add(hubblePart);
          }
          // this.scene.scene.background = new THREE.Color(0xffffff);
          this.scene.renderer.setSize(100, 100);
          this.scene.renderer.setClearColor(0x000000, 0);
          var container = document.getElementById('scene');
          container.appendChild(this.scene.renderer.domElement);
          var cds = this.math.sphericToCortesian(this.scene.R, 0, 0);
          this.scene.camera.position.set(cds.x, cds.z, cds.y - 0.01);
          this.scene.camera.lookAt(0, 0, 0);
          // this.models.hubble.rotation.x = Math.PI;
          // this.scene.camera.rotation.z = -Math.PI / 2;
          // this.scene.camera.rotation.y = Math.PI / 2;
          // this.scene.camera.scale.z = -1;
          // this.scene.camera.scale.y = -1;
          // this.scene.camera.scale.z = -1;
          this.scene.renderer.render(this.scene.scene, this.scene.camera);
        }


    } else if (this.settings.processType === 'countСharacteristics') {
      const twoPI = 2 * Math.PI;
      let start2 = +(new Date());

      // перебираем все возможные положения Солнца
      this.scanAllSphere(this.scene.light, () => {
        // считаем индикатрису рассеяния
        this.scanAllSphere(this.scene.camera, () => {
          this.render();
        });
      });

      let end2 = +(new Date());
      let totalSeconds2 = +((end2 - start2) / 1000).toFixed(1);
      let totalMinutes2 = +(totalSeconds2 / 60).toFixed(0);
      let totalHours2 = Math.floor(totalMinutes2 / 60);

      console.log('');
      console.log('Расчёт занял примерно ' + totalSeconds2 + ' с.');
      console.log('или ' + totalMinutes2 + ' мин.');
      console.log('или ' + totalHours2 + ' ч. ' + (totalMinutes2 - totalHours2 * 60) + ' мин.');

      // console.log(output);
      this.helpers.saveIntoFile(this.output);


    } else if (this.settings.processType === 'testCountСharacteristics') {
      this.scene.renderer.setSize(500, 500);
      this.scene.cameraTheta = 0;
      this.animateForTest();


    } else if (this.settings.processType === 'showPlot3D') {
      $.getJSON(`./assets/results/${this.settings.dataForPlot3D}.json`, (data) => {
        console.log(data);
        const sunPosition: any = {};
        // sunPosition.phi = 5.94;
        // sunPosition.theta = 1.4;

        let cds;
        const X = [], Y = [], Z = [];
        let mMax = 0;
        for (let item of data) {

          if (!sunPosition.phi) {
            sunPosition.phi = item.sunPhi;
            sunPosition.theta = item.sunTheta;
          }

          if (sunPosition.phi === item.sunPhi && sunPosition.theta === item.sunTheta) {
            if (item.M > mMax) mMax = item.M;
            cds = this.math.sphericToCortesian(item.M, item.cameraTheta, item.cameraPhi);
            X.push(cds.x);
            Y.push(cds.y);
            Z.push(cds.z);
          }
        }

        const trace1 = {
          x: X,  y: Y, z: Z,
          mode: 'markers',
          marker: {
            size: 2,
            opacity: 0.8
          },
          type: 'scatter3d'
        };
        cds = this.math.sphericToCortesian(mMax, sunPosition.theta, sunPosition.phi);
        const trace2 = {
          x: [cds.x],  y: [cds.y], z: [cds.z],
          mode: 'markers',
          marker: {
            size: 5,
            opacity: 1
          },
          type: 'scatter3d'
        };
        const layout = {
          margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
          }
        };
        Plotly.newPlot('plot', [trace1, trace2], layout);
      });
    }
  }

  scanAllSphere(object, cb) {
    const twoPI = 2 * Math.PI;
    let theta = 0;
    let phi = 0;

    while (theta < Math.PI) {
      while (phi < twoPI) {
        const cds = this.math.sphericToCortesian(this.scene.R, theta, phi);
        object.position.set(cds.x, cds.z, cds.y);
        object.lookAt(0, 0, 0);

        object.data.theta = theta;
        object.data.phi = phi;

        cb();

        phi = +(phi + this.settings.step + Math.abs(theta - Math.PI / 2)).toFixed(2);
      }

      phi = 0;
      theta = +(theta + this.settings.step).toFixed(2);
    }
  }

  render() {
    this.scene.renderer.render(this.scene.scene, this.scene.camera);
    let sum = 0;
    for (const p of this.helpers.getImageData(this.scene.renderer.domElement)) {
      if (p !== 255) {
        sum += p;
      }
    }

    // console.log(this.scene.scene);
    this.output.push({
      M: sum,
      cameraPhi: this.scene.camera.data.phi || this.scene.cameraPhi,
      cameraTheta: this.scene.camera.data.theta || this.scene.cameraTheta,
      sunPhi: this.scene.light.data.phi || this.scene.sunPhi,
      sunTheta: this.scene.light.data.theta || this.scene.sunTheta
    })
  }

  animate() {
    // cameraTheta += 0.1;
    this.scene.cameraPhi += 0.1;

    const cds = this.math.sphericToCortesian(this.scene.R, this.scene.cameraTheta, this.scene.cameraPhi);
    this.scene.camera.position.set(cds.x, cds.z, cds.y);
    this.scene.camera.lookAt(0, 0, 0);

    // console.log(camera);

    requestAnimationFrame(() => {this.animate();});
    this.render();
  }

  animateForTest() {
    if (this.scene.cameraTheta < Math.PI ) {
      if (this.scene.cameraPhi < Math.PI * 2) {
        this.scene.cameraPhi = +(this.scene.cameraPhi + this.settings.step + Math.abs(this.scene.cameraTheta - Math.PI / 2)).toFixed(2);
      } else {
        this.scene.cameraPhi = 0;
        this.scene.cameraTheta = +(this.scene.cameraTheta + this.settings.step).toFixed(2);
      }
    } else {
      this.scene.cameraPhi = 0;
      this.scene.cameraTheta = 0;
    }

    const cds = this.math.sphericToCortesian(this.scene.R, this.scene.cameraTheta, this.scene.cameraPhi);
    this.scene.camera.position.set(cds.x, cds.z, cds.y);
    this.scene.camera.lookAt(0, 0, 0);

    requestAnimationFrame(() => {this.animateForTest();});
    this.render();
  }
}
