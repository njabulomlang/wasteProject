import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as HighCharts from 'highcharts';
import * as firebase from 'firebase';
import * as html2pdf from 'html2pdf.js';
import { LoadingController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  doc_ID: any;
  info: any;
  value: any;
  db = firebase.firestore();
  driver = {
    fullName: '',
    id:'',
    regNo:'',
    phoneNumber: '',
    image:'',
    cName:'',
    cAddress:''
  }
  driverID;
  material = [];
  doc_id;
  date;
  mat_Info = [];
  masses = [];
  constructor(public route: ActivatedRoute, public renderer:Renderer2, public navCtrol : NavController,
    public loadingController: LoadingController) { 
    this.route.queryParams.subscribe(params => {
      this.doc_ID = params["id"];
      this.driverID = params["driverID"];
      this.value = params["col"];
    })
  }

  ngOnInit() {
    this.getMaterial();
    this.renderer.setStyle(document.getElementById('pdfView'),'display','none');
    setTimeout(() => {
      this.getDriver();
    }, 1000);
    
    // this.getTotal();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please Wait...',
      duration: 3000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    // console.log('Loading dismissed!');
  }
  changeView(y) {
    this.renderer.setStyle(document.getElementById('details'),'display','none');
    this.renderer.setStyle(document.getElementById('pdfView'),'display','flex');
    this.doc_id = y.id;
    this.date = y.info.date;
    this.mat_Info = y.info.masses;
    this.mat_Info.forEach((i)=>{
      let num : number = Number(i.mass)
      this.masses.push(num);
    })
  }
  getTotal() {
    let total = 0;
      this.masses.forEach((item) => {
        total += item
      })
    return total;
  }
  Details() {
    this.presentLoading();
    this.renderer.setStyle(document.getElementById('pdfView'),'display','none');
    this.renderer.setStyle(document.getElementById('details'),'display','flex');
    this.doc_id = null;
    // location.reload();
  }

  DownloadPDF() {
    html2pdf(document.getElementById('customerInvoice'));
    // this.navCtrol.navigateRoot('folder/Dashboard');
   
  }
  getDriver() {
    if (this.value == "Inbound") {
      this.db.collection('Driver').doc(this.driverID).onSnapshot((doc)=>{
        this.driver.fullName = doc.data().fullName;
        this.driver.id = doc.id;
        this.driver.regNo = doc.data().regNo;
        this.driver.phoneNumber = doc.data().phoneNumber;
        this.driver.image = doc.data().profilePic;
        this.driver.cName = doc.data().companyName;
        this.driver.cAddress = doc.data().companyAddress;
      })
    } else if (this.value == "Outbound") {
      this.db.collection('DriverOutbound').doc(this.driverID).onSnapshot((doc)=>{
        this.driver.fullName = doc.data().fullName;
        this.driver.id = doc.id;
        this.driver.regNo = doc.data().regNo;
        this.driver.phoneNumber = doc.data().phoneNumber;
        this.driver.image = doc.data().profilePic;
        this.driver.cName = doc.data().companyName;
        this.driver.cAddress = doc.data().companyAddress;
      })
    } else {
      this.db.collection('Customer').doc(this.driverID).onSnapshot((doc)=>{
        this.driver.fullName = doc.data().fullName;
        this.driver.id = doc.id;
        this.driver.regNo = doc.data().idNumber;
        this.driver.phoneNumber = doc.data().phoneNumber;
        this.driver.image = doc.data().profilePic;
        this.driver.cName = doc.data().streetName;
        this.driver.cAddress = doc.data().town;
      })
    }
  
  }
  getMaterial() {
    if (this.value == "Reclaimer") {
      this.db.collection(this.value).where("customerID","==",this.driverID).onSnapshot((res)=>{
        this.material = [];
        res.forEach((doc)=>{
          this.material.push({id: doc.id, info:doc.data()})
        })
      })
    } else {
      this.db.collection(this.value).where("driverID","==",this.driverID).onSnapshot((res)=>{
      this.material = [];
      res.forEach((doc)=>{
        this.material.push({id: doc.id, info:doc.data()})
      })
    })
    }
    
  }
  plotSimpleBarChart() {
    let myChart = HighCharts.chart('highcharts', {
      chart: {
        type: 'line'
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
}
