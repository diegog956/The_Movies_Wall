import { Component, NgModule, OnInit, ViewEncapsulation } from '@angular/core';
import { UsersDatabaseService } from 'src/app/services/users-database.service';
import { HttpClient } from '@angular/common/http';
import { Color } from '@swimlane/ngx-charts';
import { ScaleType } from '@swimlane/ngx-charts';


@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
  encapsulation: ViewEncapsulation.None
 
})
export class AdminPageComponent implements OnInit {
  chart!: boolean;
  single: any[] = [];
  view: [number, number] = [800, 500];
  data: any[] = [];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;


  showXAxis: boolean = true;
  showYAxis: boolean = true;
 
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Genero';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Cantidad de Favoritos';

  barPadding: number = 5;
  

  legend: boolean = true;
  legendTitle: string = 'PAISES';
  labels: boolean = true;
  

  colorScheme: Color = {
    name: '',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FFD1DC',
    
    '#392F5A',
    '#FFE156',
    '#6A0572',
    '#AB83A1',
    '#D41E68',
    '#FEC3A6',
    '#31A2AC',
    '#61C0BF',
    '#6B4226',
    '#D9BF77',
    '#ACD8AA',
    '#8D5D83',
    '#FFABAB',
    '#FFC3A0',
    '#FF677D',
    '#D4A5A5',
    '#FCC6A0']
  };


  constructor(private userDataService: UsersDatabaseService, private httpClient: HttpClient) {

  }

  ngOnInit(): void {
    this.chart = true;
    this.showStats('http://localhost:4000/Genres');
    

  }

  showStats(url:string){
    if(url == 'http://localhost:4000/Countries'){
      this.chart = false;
    }else{
      this.chart = true;
    }
    this.userDataService.getStats(url).then(data => {
      if (data != undefined) {
        
        this.data = data;
        const datosOrdenados = data.slice().sort((a, b) => {
          if (a.value > b.value) return -1;
          if (a.value < b.value) return 1;
          return 0;
        });
        this.data = datosOrdenados;
        
      }
    });
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  
}
