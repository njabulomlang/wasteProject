import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as HighCharts from 'highcharts';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  price = 3;
  recycleType: { totalMass: number, name: string, bgcolor: string }[] = [
    { "totalMass": 0, "name": "Outbound", "bgcolor":"#C5A60A" },
    { "totalMass": 0, "name": "Inbound", "bgcolor":"#D12C6F" },
    { "totalMass": 0, "name": "Reclaimer", "bgcolor":"#13BBBB" }
];

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }
  ionViewDidEnter() {
    this.plotSimpleBarChart();
    this.plotSimpleBarChart1();
    this.plotSimpleBarChart2();
  }

  plotSimpleBarChart() {
    let myChart = HighCharts.chart('highcharts', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Inbound'
      },
      xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges']
      },
      yAxis: {
        title: {
          text: 'Fruit eaten'
        }
      },
      series: [
        {
          name: 'Jane',
          type: undefined,
          data: [1, 0, 4]
        },
        {
          name: 'John',
          type: undefined,
          data: [5, 7, 3]
        }]
    });
  }

  plotSimpleBarChart1() {
    let myChart = HighCharts.chart('highcharts1', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Outbound'
      },
      xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges']
      },
      yAxis: {
        title: {
          text: 'Fruit eaten'
        }
      },
      series: [
        {
          name: 'Jane',
          type: undefined,
          data: [1, 0, 4]
        },
        {
          name: 'John',
          type: undefined,
          data: [5, 7, 3]
        }]
    });
  }

  plotSimpleBarChart2() {
    let myChart = HighCharts.chart('highcharts2', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Reclaimer'
      },
      xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges']
      },
      yAxis: {
        title: {
          text: 'Fruit eaten'
        }
      },
      series: [
        {
          name: 'Jane',
          type: undefined,
          data: [1, 0, 4]
        },
        {
          name: 'John',
          type: undefined,
          data: [5, 7, 3]
        }]
    });
  }
}
