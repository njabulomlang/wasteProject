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
  page = 4;
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
  searchtxt: any;
  searchedUsers = [];
  col = '';
  in_bgColor;
  page_numbering = [];
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
  clearSearch() {
    // this.col = '';
    this.fb.collection(this.col).onSnapshot(res => {
      this.searchedUsers = [];
      res.forEach((doc) => {
        this.searchedUsers.push({ id: doc.id, data: doc.data() });
      })
    })
  }
  searchUsers(event) {
    this.searchtxt = event.target.value;
    if (this.searchtxt == '') {
      this.fb.collection(this.col).onSnapshot(res => {
        this.searchedUsers = [];
        res.forEach((doc) => {
          this.searchedUsers.push({ id: doc.id, data: doc.data() });
        })
      })
    } else {
      let query = event.target.value.trim();
      // console.log("Users ", this.users[0]);
      this.searchedUsers = this.searchedUsers.filter(item => item.data.fullName.toLowerCase().indexOf(query.toLowerCase()) >= 0)
    }
  }
  selectedIndex(ev) {
    this.col = ev.detail.value;
    this.in_bgColor = 'C5A60A';
    this.fb.collection(ev.detail.value).onSnapshot(res => {
      this.searchedUsers = [];
      res.forEach((doc) => {
        this.searchedUsers.push({ id: doc.id, data: doc.data() });
      })
    })
  }
  weeklyChart() {
    var today = new Date();
    var first = today.getDate() - today.getDay();
    var firstDayWeek = new Date(today.setDate(first));
    var lastDayWeek = new Date(today.setDate(first + 6));
    var firstDayMonth = new Date(today.setDate(1));
    var lastDayMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    // addFn = addFn || Date.prototype.getDay();
    // interval = interval || 1;

    // this.inboundArray = [];
    var current = firstDayWeek;
    this.inboundArray.forEach((item) => {
      while (item.info.date >= current && item.info.date <= lastDayWeek) {
        this.inboundArray.push({ info: item.info, id: item.id })
      }
    })
    this.outboundArray.forEach((item) => {
      while (item.date >= current && item.date <= lastDayWeek) {
        this.outboundArray.push(item)
      }
    })
    this.reclaimerArray.forEach((item) => {
      while (item.date >= current && item.date <= lastDayWeek) {
        this.reclaimerArray.push(item)
      }
    })
    // return this.inboundArray;

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

  getInbounds() {
    let arr = [];
    let pap1 = 0;
    let pap5 = 0;
    let pap3 = 0;
    let pap7 = 0;
    let pet3 = 0;
    let pet1 = 0;
    let pet5 = 0;
    let hd1 = 0;
    let ld1 = 0;
    let ld3 = 0;
    let gl1 = 0;
    let nfal1 = 0;
    this.fb.collection("Inbound").onSnapshot((res1) => {
      this.inboundArray = [];
      res1.forEach((doc) => {
        this.inboundArray.push({ id: doc.id, info: doc.data() });
      })
      for (let i = 0; i < this.inboundArray.length; i++) {
        let num = i+1;
        this.page_numbering.push(num);
      }
      setTimeout(() => {
        this.inboundArray.forEach((i) => {
          i.info.masses.forEach(y => {
            if (y.name == 'PAP001') {
              pap1 += Number(y.mass)
            } else if (y.name == 'PAP005') {
              pap5 += Number(y.mass)
            } else if (y.name == 'PAP003') {
              pap3 += Number(y.mass)
            } else if (y.name == 'PAP007') {
              pap7 += Number(y.mass)
            } else if (y.name == 'PET005') {
              pet5 += Number(y.mass)
            } else if (y.name == 'PET003') {
              pet3 += Number(y.mass)
            } else if (y.name == 'PET001') {
              pet1 += Number(y.mass)
            } else if (y.name == 'HD001') {
              hd1 += Number(y.mass)
            } else if (y.name == 'LD001') {
              ld1 += Number(y.mass)
            } else if (y.name == 'LD003') {
              ld3 += Number(y.mass)
            } else if (y.name == 'GL001') {
              gl1 += Number(y.mass)
            }
            else {
              nfal1 += Number(y.mass)
            }

            this.massArray.push(Number(y.mass));
            this.nameArray.push(y.name);
          });
        })
        this.plotSimpleBarChart(pap1, pap5, pap3, pap7, pet5, pet3, pet1, hd1, ld1, ld3, gl1);
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
  getSum() {
    this.fb.collection("Inbound").onSnapshot((res) => {
      console.log(res.size);

    })
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
    let arr = [];
    let pap1 = 0;
    let pap5 = 0;
    let pap3 = 0;
    let pap7 = 0;
    let pet3 = 0;
    let pet1 = 0;
    let pet5 = 0;
    let hd1 = 0;
    let ld1 = 0;
    let ld3 = 0;
    let gl1 = 0;
    let nfal1 = 0;
    this.fb.collection("Reclaimer").onSnapshot((res1) => {
      this.reclaimerArray = [];
      res1.forEach((doc) => {
        this.reclaimerArray.push(doc.data());
        doc.data().masses.forEach(element => {
          tot += Number(element.mass)
        });
        this.totalReclaimer = tot;
      })
      setTimeout(() => {
        this.reclaimerArray.forEach((i) => {
          i.masses.forEach(y => {
            if (y.name == 'PAP001') {
              pap1 += Number(y.mass)
            } else if (y.name == 'PAP005') {
              pap5 += Number(y.mass)
            } else if (y.name == 'PAP003') {
              pap3 += Number(y.mass)
            } else if (y.name == 'PAP007') {
              pap7 += Number(y.mass)
            } else if (y.name == 'PET005') {
              pet5 += Number(y.mass)
            } else if (y.name == 'PET003') {
              pet3 += Number(y.mass)
            } else if (y.name == 'PET001') {
              pet1 += Number(y.mass)
            } else if (y.name == 'HD001') {
              hd1 += Number(y.mass)
            } else if (y.name == 'LD001') {
              ld1 += Number(y.mass)
            } else if (y.name == 'LD003') {
              ld3 += Number(y.mass)
            } else if (y.name == 'GL001') {
              gl1 += Number(y.mass)
            }
            else {
              nfal1 += Number(y.mass)
            }

            this.massArray.push(Number(y.mass));
            this.nameArray.push(y.name);
          });
        })
        this.plotSimpleBarChart2(pap1, pap5, pap3, pap7, pet5, pet3, pet1, hd1, ld1, ld3, gl1);
      }, 0);
    })
  }
  sumFunction() {
    var source = [];
    var mass = [];
    var name = [];
    this.outboundArray.forEach((i) => {
      // console.log("My data ", i.masses);
      i.masses.forEach(element => {
        mass.push(element.mass);
        name.push(element.name);
      });
    })
    source.push({ name, mass });

    var last;
    var folded = source.reduce((prev, curr) => {
      if (last) {
        if (last[0] === curr[0]) {
          last[1] += Number(curr[1]);
          return prev;
        }
      }
      last = curr;
      prev.push(last);
      return prev;
    }, []);
  }
  dailyChart() {
    var today = new Date('0:00:00');
    var first = today.getDate() - today.getDay();
    var firstDayWeek = new Date(today.setDate(first));
    var lastDayWeek = new Date(today.setDate(first + 6));
    var firstDayMonth = new Date(today.setDate(1));
    var lastDayMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    // addFn = addFn || Date.prototype.getDay();
    // interval = interval || 1;

    // this.inboundArray = [];
    var current = firstDayWeek;
    this.inboundArray.forEach((item) => {
      while (new Date(item.info.date).getHours() >= today.getHours() && item.info.date <= new Date('23:59:59').getHours()) {
        this.inboundArray.push({ info: item.info, id: item.id })
      }
    })
    this.outboundArray.forEach((item) => {
      while (new Date(item.date).getHours() >= today.getHours() && item.date <= new Date('23:59:59').getHours()) {
        this.outboundArray.push(item)
      }
    })
    this.reclaimerArray.forEach((item) => {
      while (new Date(item.date).getHours() >= today.getHours() && item.date <= new Date('23:59:59').getHours()) {
        this.reclaimerArray.push(item)
      }
    })
  }
  monthlyChart() {
    var today = new Date();
    var first = today.getDate() - today.getDay();
    var firstDayWeek = new Date(today.setDate(first));
    var lastDayWeek = new Date(today.setDate(first + 6));
    var firstDayMonth = new Date(today.setDate(1));
    var lastDayMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    // addFn = addFn || Date.prototype.getDay();
    // interval = interval || 1;

    // this.inboundArray = [];
    var current = firstDayWeek;
    this.inboundArray.forEach((item) => {
      while (new Date(new Date(item.info.date).getDate()) >= firstDayMonth && new Date(new Date(item.info.date).getDate()) <= lastDayMonth) {
        this.inboundArray.push({ info: item.info, id: item.id })
      }
    })
    this.outboundArray.forEach((item) => {
      while (new Date(new Date(item.date).getDate()) >= firstDayMonth && new Date(new Date(item.date).getDate()) <= lastDayMonth) {
        this.outboundArray.push(item)
      }
    })
    this.reclaimerArray.forEach((item) => {
      while (new Date(new Date(item.date).getDate()) >= firstDayMonth && new Date(new Date(item.date).getDate()) <= lastDayMonth) {
        this.reclaimerArray.push(item)
      }
    })
  }
  getOutbounds() {
    let tot = 0;
    let arr = [];
    let pap1 = 0;
    let pap5 = 0;
    let pap3 = 0;
    let pap7 = 0;
    let pet3 = 0;
    let pet1 = 0;
    let pet5 = 0;
    let hd1 = 0;
    let ld1 = 0;
    let ld3 = 0;
    let gl1 = 0;
    let nfal1 = 0;
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
            if (y.name == 'PAP001') {
              pap1 += Number(y.mass)
            } else if (y.name == 'PAP005') {
              pap5 += Number(y.mass)
            } else if (y.name == 'PAP003') {
              pap3 += Number(y.mass)
            } else if (y.name == 'PAP007') {
              pap7 += Number(y.mass)
            } else if (y.name == 'PET005') {
              pet5 += Number(y.mass)
            } else if (y.name == 'PET003') {
              pet3 += Number(y.mass)
            } else if (y.name == 'PET001') {
              pet1 += Number(y.mass)
            } else if (y.name == 'HD001') {
              hd1 += Number(y.mass)
            } else if (y.name == 'LD001') {
              ld1 += Number(y.mass)
            } else if (y.name == 'LD003') {
              ld3 += Number(y.mass)
            } else if (y.name == 'GL001') {
              gl1 += Number(y.mass)
            }
            else {
              nfal1 += Number(y.mass)
            }

            this.massArray.push(Number(y.mass));
            this.nameArray.push(y.name);
          });

        })
        this.plotSimpleBarChart1(pap1, pap5, pap3, pap7, pet5, pet3, pet1, hd1, ld1, ld3, gl1);
      }, 0);
    })
  }
  async createModal(material) {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'modalCss',
      componentProps: { value: material }
    });
    return await modal.present();
  }
  plotSimpleBarChart(pap1, pap5, pap3, pap7, pet5, pet3, pet1, hd1, ld1, ld3, gl1) {
    let myChart = HighCharts.chart('highcharts', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Inbound'
      },
      xAxis: {
        categories: ["PAP001", "PAP005", "PAP003", "PAP007", "PET005", "PET003", "PET001", "HD001", "LD001", "LD003", "GL001"]
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
          data: [pap1, pap5, pap3, pap7, pet5, pet3, pet1, hd1, ld1, ld3, gl1]
        }]
    });
  }

  plotSimpleBarChart1(pap1, pap5, pap3, pap7, pet5, pet3, pet1, hd1, ld1, ld3, gl1) {
    let myChart = HighCharts.chart('highcharts1', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Outbound'
      },
      xAxis: {
        categories: ["PAP001", "PAP005", "PAP003", "PAP007", "PET005", "PET003", "PET001", "HD001", "LD001", "LD003", "GL001"]
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
          data: [pap1, pap5, pap3, pap7, pet5, pet3, pet1, hd1, ld1, ld3, gl1]
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
  plotSimpleBarChart2(pap1, pap5, pap3, pap7, pet5, pet3, pet1, hd1, ld1, ld3, gl1) {
    let myChart = HighCharts.chart('highcharts2', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Reclaimer'
      },
      xAxis: {
        categories: ["PAP001", "PAP005", "PAP003", "PAP007", "PET005", "PET003", "PET001", "HD001", "LD001", "LD003", "GL001"]
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
          data: [pap1, pap5, pap3, pap7, pet5, pet3, pet1, hd1, ld1, ld3, gl1]
        }]
    });
  }
  getPlastic() {
    this.materialCollection.collection('Material').doc('Plastic').onSnapshot((doc) => {
      this.infoArr = doc.data().plastic;
    })
  }

  getPaper() {
    this.materialCollection.collection('Material').doc('Paper').onSnapshot((res) => {
      this.infoPaper = res.data().paper;
    })
  }

  getGlass() {
    this.materialCollection.collection('Material').doc('Glass').onSnapshot((res) => {
      this.infoGlass = res.data().paper
    })
  }

  getAlum() {
    this.materialCollection.collection('Material').doc('Aluminium').onSnapshot((res) => {
      this.infoAl = res.data().paper;
    })
  }
}
