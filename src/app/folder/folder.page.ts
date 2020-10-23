import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController, ModalController, NavController, ToastController } from '@ionic/angular';
import * as HighCharts from 'highcharts';
import * as firebase from 'firebase';
import { ModalPage } from '../modal/modal.page';
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

  constructor(private activatedRoute: ActivatedRoute, public menuCtrl : MenuController, private navCtrl : NavController, public toastController: ToastController,
    public modalController: ModalController) { 
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }
  ionViewDidEnter() {
    this.plotSimpleBarChart();
    this.plotSimpleBarChart1();
    this.plotSimpleBarChart2();
  }
  async createModal(material) {
    // console.log('My values', PAP001, PAP003, PAP005, PAP007);
    
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: { value: material}
    });
    return await modal.present();
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
  logout() {
    firebase.auth().signOut().then((res)=>{
      this.presentToast('Logged out...')
      this.navCtrl.navigateRoot('signin');
    }) 
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
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
