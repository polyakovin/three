import { Injectable } from '@angular/core';

@Injectable()
export class HelpersService {

  constructor() {}

  // сохранение в файл
  saveIntoFile = (data, filename?) => {
  	if(!data) {
  		console.error('saveIntoFile: No data');
  		return;
  	}

  	if(!filename) filename = 'output.json';

  	if(typeof data === "object") data = JSON.stringify(data, undefined, 4);

  	let blob = new Blob([data], {type: 'text/json'}),
  	e = document.createEvent('MouseEvents'),
  	a = document.createElement('a');

  	a.download = filename;
  	a.href = window.URL.createObjectURL(blob);
  	a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
  	e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  	a.dispatchEvent(e);
  }

  getImageData(image): any {
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    return context.getImageData(0, 0, image.width, image.height).data;
  }
}
