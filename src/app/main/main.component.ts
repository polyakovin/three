import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  projects = [];
  renderedMarkdown = '';

  constructor(
    private http: HttpService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getFeatures();
  }

  getFeatures() {
    this.http.get("assets/data/projects.json").subscribe(
      projects => this.projects = projects
    );
  }

  goToProject(component) {
    this.router.navigate([`/${component}`]);
  }
}
