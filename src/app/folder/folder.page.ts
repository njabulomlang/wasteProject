import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { MenuController, ModalController, NavController, ToastController } from '@ionic/angular';
import * as HighCharts from 'highcharts';
import * as firebase from 'firebase';
import { ModalPage } from '../modal/modal.page';
import { EditProfilePage } from '../edit-profile/edit-profile.page';
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
  totalReclaimer = 0;
  totalOutbound = 0;
  users = [];
  admin_id;
  admin = {
    name: '',
    number: null,
    address: '',
    image: ''
  }
  massArray = [];
  nameArray = [];
  massOutArray = [];
  nameOutArray = [];
  massReclaimer = [];
  nameReclaimer = [];
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
    this.getUsers();
    setTimeout(() => {
      this.admin_id = firebase.auth().currentUser.uid;
      this.adminProfile();
    }, 0);
  }
  transform(rawNum) {
    /*   rawNum = rawNum.charAt(0) != 0 ? "0" + rawNum : "" + rawNum;
  
      let newStr = "";
      let i = 0;
  
      for (; i < Math.floor(rawNum.length / 2) - 1; i++) {
        newStr = newStr + rawNum.substr(i * 2, 2) + "-";
      }
  
      return newStr + rawNum.substr(i * 2); */

  }
  adminProfile() {
    this.fb.collection('Admin').doc(this.admin_id).onSnapshot((doc) => {
      this.admin.name = doc.data().fullName;
      this.admin.number = doc.data().phoneNumber;
      this.admin.address = doc.data().Address;
      this.admin.image = doc.data().profilePic
    })
    String(this.admin.number).concat(String(this.admin.number).substr(2, 1), "-", String(this.admin.number).substr(3))
  }
  ionViewDidEnter() {

    // this.plotSimpleBarChart1();
  }
  getInbounds() {
    let arr = [];
    this.fb.collection("Inbound").onSnapshot((res1) => {
      this.inboundArray = [];
      res1.forEach((doc) => {
        this.inboundArray.push({ id: doc.id, info: doc.data() });
      })
      setTimeout(() => {
        this.inboundArray.forEach((i) => {
          i.info.masses.forEach(y => {
            this.massArray.push(Number(y.mass));
            this.nameArray.push(y.name);
          });
        })
        this.plotSimpleBarChart();
      }, 0);
    })
  }
  getUsers() {
    let info = { driver: [], outDriver: [], customer: [] }
    this.fb.collection("DriverOutbound").onSnapshot((resOut) => {
      this.users = [];
      info.outDriver = [];
      resOut.forEach((doc) => {
        info.outDriver.push({ id: doc.id, data: doc.data() });
      })
      this.fb.collection("Driver").onSnapshot((resIn) => {
        info.driver = []
        resIn.forEach((doc) => {
          info.driver.push({ id: doc.id, data: doc.data() });
        })
      })
      this.fb.collection("Customer").onSnapshot((cust) => {
        info.customer = []
        cust.forEach((doc) => {
          info.customer.push({ id: doc.id, data: doc.data() })
        })
      })
      this.users.push(info)
      // console.log("Info ",this.users );
    })



  }
  deleteInDriver(id) {
    this.fb.collection('Driver').doc(id).delete().then(() => {
      this.presentToast('Inbound driver deleted')
    })
  }
  deleteOutDriver(id) {
    this.fb.collection('DriverOutbound').doc(id).delete().then(() => {
      this.presentToast('Outbound driver deleted')
    })
  }
  deleteCustomer(id) {
    this.fb.collection('Customer').doc(id).delete().then(() => {
      this.presentToast('Customer deleted')
    })
  }
  editUser(id, col) {
    this.createModalEdit(id, col);
  }
  async createModalEdit(id, col) {
    // console.log('My values', PAP001, PAP003, PAP005, PAP007);

    const modal = await this.modalController.create({
      component: EditProfilePage,
      cssClass: 'modalCss',
      componentProps: { id: id, collection: col }
    });
    return await modal.present();
  }
  getTotal() {
    let total = 0;
    this.inboundArray.forEach((item) => {
      item.info.masses.forEach(element => {
        total += Number(element.mass)
      });
    })
    return total;
  }
  viewDetail(y) {
    if (this.folder == "Inbound") {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          id: y.id,
          driverID: y.info.driverID,
          col: this.folder
        }
      };
      this.navCtrl.navigateForward(['detail'], navigationExtras)
    } else if (this.folder == "Outbound") {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          id: y.id,
          driverID: y.driverID,
          col: this.folder
        }
      };
      this.navCtrl.navigateForward(['detail'], navigationExtras)
    } else {
      {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            id: y.id,
            driverID: y.customerID,
            col: this.folder
          }
        };
        this.navCtrl.navigateForward(['detail'], navigationExtras)
      }
    }

  }

  getReclaimer() {
    let tot = 0;
    this.fb.collection("Reclaimer").onSnapshot((res1) => {
      this.reclaimerArray = [];
      res1.forEach((doc) => {
        this.reclaimerArray.push(doc.data());
        doc.data().masses.forEach(element => {
          tot += Number(element.mass)
        });
        this.totalReclaimer = tot;
        // console.log("my total ", tot);
      })
      setTimeout(() => {
        this.reclaimerArray.forEach((i) => {
          i.masses.forEach(y => {
            this.massReclaimer.push(Number(y.mass));
            this.nameReclaimer.push(y.name);
          });
        })
        this.sumFunction();
        this.plotSimpleBarChart2();
      }, 0);
      // console.log("My inbound ", this.inboundArray);
    })
  }
  sumFunction() {
    var source = [];
    var mass = [];
    var name = [];  
    this.outboundArray.forEach((i)=>{
    // console.log("My data ", i.masses);
    i.masses.forEach(element => {
      mass.push(element.mass);
      name.push(element.name);
    });
  })
  source.push({name,mass});
  
  var last;
  var folded = source.reduce((prev,curr)=>{
      if (last) {
          if (last[0] === curr[0]) {
              last[1] += Number(curr[1]);
              return prev;
          }
      }
      last = curr;
      prev.push(last);
      return prev;
  },[]);
  console.log("... ", folded);
  
  }
  getOutbounds() {
    let tot = 0;
    let totMass = 0;
    this.fb.collection("Outbound").onSnapshot((res1) => {
      this.outboundArray = [];
      res1.forEach((doc) => {
        this.outboundArray.push(doc.data());
        doc.data().masses.forEach(element => {
          tot += Number(element.mass);
        });
        this.totalOutbound = tot;
      })
      setTimeout(() => {
        this.outboundArray.forEach((i) => {
          i.masses.forEach(y => {
            this.massOutArray.push(Number(y.mass));
            this.nameOutArray.push(y.name);
          });
        })
        this.sumFunction();
        this.plotSimpleBarChart1();
      }, 0);
      // console.log("Total papper 001 ", totMass);
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
        categories: ["PET003", "PET005", "LD001", "LD003", "HD001", "PET001", "PAP001", "PAP005", "PAP003", "PAP007", "GL001"]
      },
      yAxis: {
        title: {
          text: 'Masses(kg)'
        }
      },
      series: [
        {
          name: 'Material',
          type: undefined,
          data: this.massArray
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
        categories: ["PET003", "PET005", "LD001", "LD003", "HD001", "PET001", "PAP001", "PAP005", "PAP003", "PAP007", "GL001"]
      },
      yAxis: {
        title: {
          text: 'Masses(kg)'
        }
      },
      series: [
        {
          name: 'Material',
          type: undefined,
          data: this.massOutArray
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
        categories: ["PET003", "PET005", "LD001", "LD003", "HD001", "PET001", "PAP001", "PAP005", "PAP003", "PAP007", "GL001"]
      },
      yAxis: {
        title: {
          text: 'Masses(kg)'
        }
      },
      series: [
        {
          name: 'Material',
          type: undefined,
          data: this.massReclaimer
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
