import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
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
  materialCollection = firebase.firestore();
  price = 3;
  infoArr = [];
  recycleType: { totalMass: number, name: string, bgcolor: string }[] = [
    { "totalMass": 0, "name": "Outbound", "bgcolor": "#C5A60A" },
    { "totalMass": 0, "name": "Inbound", "bgcolor": "#D12C6F" },
    { "totalMass": 0, "name": "Reclaimer", "bgcolor": "#13BBBB" }
  ];
  infoPaper: any[];
  infoGlass: any[];
  infoAl: any[];
  fb = firebase.firestore();
  inboundArray = [];
  outboundArray: any[];
  reclaimerArray: any[];
  constructor(private activatedRoute: ActivatedRoute, public menuCtrl: MenuController, private navCtrl: NavController, public toastController: ToastController,
    public modalController: ModalController) {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.getPlastic();
    this.getPaper();
    this.getGlass();
    this.getAlum();
    this.getInbounds();
    this.getOutbounds();
    this.getReclaimer();
  }
  ionViewDidEnter() {
    this.plotSimpleBarChart();
    this.plotSimpleBarChart1();
    this.plotSimpleBarChart2();
  }
  getInbounds() {
    this.fb.collection("Inbound").onSnapshot((res1) => {
      this.inboundArray = [];
      res1.forEach((doc) => {
        this.inboundArray.push({id:doc.id,info:doc.data()});
      })
      // console.log("My inbound ", this.inboundArray);
    })
  }
  viewDetail(y) {
    if (this.folder == "Inbound") {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          id: y.id,
          driverID: y.info.driverID,
          col : this.folder
        }
      };
      this.navCtrl.navigateForward(['detail'], navigationExtras)
    } else if (this.folder == "Outbound") {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          id: y.id,
          driverID: y.driverID,
          col : this.folder
        }
      };
      this.navCtrl.navigateForward(['detail'], navigationExtras)
    } else {
      {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            id: y.id,
            driverID: y.customerID,
            col : this.folder
          }
        };
        this.navCtrl.navigateForward(['detail'], navigationExtras)
      }
    }
   
  }
  getReclaimer() {
    this.fb.collection("Reclaimer").onSnapshot((res1) => {
      this.reclaimerArray = [];
      res1.forEach((doc) => {
        this.reclaimerArray.push(doc.data());
      })
      // console.log("My inbound ", this.inboundArray);
    })
  }
  getOutbounds() {
    this.fb.collection("Outbound").onSnapshot((res1) => {
      this.outboundArray = [];
      res1.forEach((doc) => {
        this.outboundArray.push(doc.data());
      })
      // console.log("My inbound ", this.inboundArray);
    })
  }
  async createModal(material) {
    // console.log('My values', PAP001, PAP003, PAP005, PAP007);

    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'modalCss',
      componentProps: { value: material }
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
    firebase.auth().signOut().then((res) => {
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
  getPlastic() {
    this.materialCollection.collection('Plastic').onSnapshot((res) => {
      this.infoArr = [];
      res.forEach((data) => {
        // this.infoArr.push({ id: data.id, doc: data.data() });
        data.data().paper.forEach((i) => {
          this.infoArr.push({ name: i.name, price: i.price });
        })
        // this.getUpdates(data.id);
        // this.getDocUpdate(data.id);
        //  setTimeout(() => {

        //  }, 1500);


      })

    })
  }

  getPaper() {
    this.materialCollection.collection('Paper').onSnapshot((res) => {
      this.infoPaper = [];
      res.forEach((data) => {
        // this.infoArr.push({ id: data.id, doc: data.data() });
        data.data().paper.forEach((i) => {
          this.infoPaper.push({ name: i.name, price: i.price });
        })
        // this.getUpdates(data.id);
        // this.getDocUpdate(data.id);
        //  setTimeout(() => {

        //  }, 1500);


      })

    })
  }

  getGlass() {
    this.materialCollection.collection('Glass').onSnapshot((res) => {
      this.infoGlass = [];
      res.forEach((data) => {
        // this.infoArr.push({ id: data.id, doc: data.data() });
        data.data().paper.forEach((i) => {
          this.infoGlass.push({ name: i.name, price: i.price });
        })
        // this.getUpdates(data.id);
        // this.getDocUpdate(data.id);
        //  setTimeout(() => {

        //  }, 1500);


      })

    })
  }

  getAlum() {
    this.materialCollection.collection('Aluminium').onSnapshot((res) => {
      this.infoAl = [];
      res.forEach((data) => {
        // this.infoArr.push({ id: data.id, doc: data.data() });
        data.data().paper.forEach((i) => {
          this.infoAl.push({ name: i.name, price: i.price });
        })
        // this.getUpdates(data.id);
        // this.getDocUpdate(data.id);
        //  setTimeout(() => {

        //  }, 1500);


      })

    })
  }
}
