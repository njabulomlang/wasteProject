import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoadingController, ModalController, IonSlides, AlertController } from '@ionic/angular';

import * as firebase from 'firebase';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  materialCollection = firebase.firestore();
  price: 0;
  @Input("value") value;
  @ViewChild(IonSlides) slides: IonSlides;
  materialForm;
  price1: number;
  price3: number;
  price5: number;
  price7: number;
  infoArr = [];
  updateArray = [];
  docUpdate = [];

  hd001: number;
  ld003: number;
  ld001: number;
  pet005: number;
  pet001: number;
  pet003: number;
  showHeader = true;
  valueC = '';
  mass;
  inputMass = [];
  myInput = [];
  fullName = new FormControl('', Validators.required);
  phoneNumber = new FormControl(null, (Validators.minLength(10), Validators.maxLength(10)));
  regNo = new FormControl('', Validators.required);
  cName = new FormControl('', Validators.required);
  profilePic = new FormControl(null, Validators.required);
  cAddress = new FormControl('', Validators.required);
  idNumber = new FormControl(null, Validators.minLength(13));
  streetName = new FormControl('', Validators.required);
  town = new FormControl('', Validators.required);
  storage = firebase.storage().ref();
  progress;
  fb = firebase.firestore();
  driver_id;
  driver_name;
  phone_number;
  reg_no;
  id_no;
  driverArr: any[];
  searchtxt: any;
  searchedItems: any;
  OutArr: any[];
  pr = 234;
  reclaimerArr: any[];
  changeButton = false;
  info: any;
  infoArray = [];
  constructor(public loadingController: LoadingController, public renderer: Renderer2,
    public modalController: ModalController, public alertController: AlertController) {
      setTimeout(() => {
        this.renderer.setStyle(document.getElementById('pc1'), 'display', 'none');
      }, 0);
  }

  ngOnInit() {
    this.materialClicked(this.value);
    setTimeout(() => {
       this.slides.lockSwipes(true);
      if (this.value == 'Paper_Inbound' || this.value == 'Paper_Outbound' || this.value == 'Paper_Reclaimer') {
        this.materialClicked('Paper');
        this.getPapers('Paper');
        // this.getMaterial('Paper');
      } else if (this.value == 'Plastic_Inbound' || this.value == 'Plastic_Outbound' || this.value == 'Plastic_Reclaimer') {
        this.materialClicked('Plastic');
        this.getPapers('Plastic');
        // this.getMaterial('Plastic');
      } else if (this.value == 'Aluminium_Inbound' || this.value == 'Aluminium_Outbound' || this.value == 'Aluminium_Reclaimer') {
        this.materialClicked('Aluminium');
        this.getPapers('Aluminium');
        // this.getMaterial('Aluminium');
      } else {
        this.materialClicked('Glass');
        this.getPapers('Glass')
        // this.getMaterial('Glass');
      }
    }, 1000);
   
    this.getDriver();
     this.getMaterial(this.valueC)
  }
  getMaterial(material) {
    this.fb.collection(material).onSnapshot((res)=>{
      this.infoArray = [];
      res.forEach((doc)=>{
        this.infoArray.push({id: doc.id, doc: doc.data()})
      })
    })
  }
  addEventListener(ev) {
    console.log("my pic ", ev.target.files[0]);
    const upload = this.storage.child('Driver_Pictures/' + ev.target.files[0].name).put(ev.target.files[0]);
    upload.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.progress = progress;
      // console.log('upload is: ', progress, '% done.');
    }, err => {
    }, () => {
      upload.snapshot.ref.getDownloadURL().then(dwnURL => {
        //  console.log('File avail at: ', dwnURL);
        this.profilePic = dwnURL;
        // this.dbProfile.doc(firebase.auth().currentUser.uid).update({profilePic: this.profilePic})
      });
    });
    // console.log("My pic is ", this.profilePic);
  }
  materialClicked(val) {
    this.valueC = val;
    this.infoArr = [];
    
    if (this.valueC === 'Plastic') {
      this.materialCollection.collection('Material').doc(this.valueC).onSnapshot((res) => {
        this.infoArr = res.data().plastic;
      })
    } else {
      this.materialCollection.collection('Material').doc(this.valueC).onSnapshot((res) => {
        this.infoArr = res.data().paper;
      })
    }
    
  }
  slideNext() {

    let obj = {
      profilePic: this.profilePic,
      fullName: this.fullName.value, phoneNumber: this.phoneNumber.value, regNo: this.regNo.value,
      companyName: this.cName.value, companyAddress: this.cAddress.value
    }
    console.log("my details ", obj);
    // setTimeout(() => {
    this.fb.collection('Driver').add(obj).then((res) => {
      this.slides.lockSwipes(false).then(() => {
        this.slides.slideNext().then((val) => {
          this.showHeader = false;
          this.slides.lockSwipes(true);
          // this.getPapers();
        });
      })
      res.onSnapshot((doc) => {
        this.driver_id = doc.id;
        console.log("My doc ", doc.data());
        this.driver_name = doc.data().fullName;
        this.reg_no = doc.data().regNo;
      })
    })
  }

  slideNextOutbound() {
    let obj = {
      profilePic: this.profilePic,
      fullName: this.fullName.value, phoneNumber: this.phoneNumber.value, regNo: this.regNo.value,
      companyName: this.cName.value, companyAddress: this.cAddress.value
    }
    this.fb.collection('DriverOutbound').add(obj).then((res) => {
      this.slides.lockSwipes(false).then(() => {
        this.slides.slideNext().then((val) => {
          this.showHeader = false;
          this.slides.lockSwipes(true);
        });
      })
      res.onSnapshot((doc) => {
        this.driver_id = doc.id;
        console.log("My doc ", doc.data());
        this.driver_name = doc.data().fullName;
        this.reg_no = doc.data().regNo;
      })
    })
  }
  slideNextReclaimer() {
    let obj = {
      profilePic: this.profilePic,
      fullName: this.fullName.value, phoneNumber: this.phoneNumber.value, idNumber: this.idNumber.value,
      streetName: this.streetName.value, town: this.town.value
    }
    this.fb.collection('Customer').add(obj).then((res) => {
      this.slides.lockSwipes(false).then(() => {
        this.slides.slideNext().then((val) => {
          this.showHeader = false;
          this.slides.lockSwipes(true);
        });
      })
      res.onSnapshot((doc) => {
        this.driver_id = doc.id;
        // console.log("My doc ", doc.data());
        this.driver_name = doc.data().fullName;
        this.id_no = doc.data().idNumber;
        this.phone_number = doc.data().phoneNumber;
        this.reg_no = doc.data().regNo;

      })
    })
  }
  async presentAlert(y) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure you want to use this driver?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        }, {
          text: 'Yes',
          handler: () => {
            this.slides.lockSwipes(false).then(() => {
              this.slides.slideNext().then((val) => {
                this.showHeader = false;
                this.driver_id = y.id;
                this.id_no = y.info.idNumber;
                this.phone_number = y.info.phoneNumber;
                this.driver_name = y.info.fullName;
                this.reg_no = y.info.regNo;
                this.slides.lockSwipes(true);
                // this.getPapers();
              });
            })
          }
        }
      ]
    });
    await alert.present();
  }

  getDriver() {
    if (this.value == 'Paper_Inbound' || this.value == 'Plastic_Inbound' || this.value == 'Glass_Inbound' || this.value == 'Aluminium_Inbound') {
      this.fb.collection("Driver").onSnapshot((res) => {
        this.driverArr = [];
        res.forEach((doc) => {
          this.driverArr.push({ id: doc.id, info: doc.data() });
        })
      })
    } if (this.value == 'Paper_Reclaimer' || this.value == 'Plastic_Reclaimer' || this.value == 'Glass_Reclaimer' || this.value == 'Aluminium_Reclaimer') {
      this.fb.collection("Customer").onSnapshot((res) => {
        this.reclaimerArr = [];
        res.forEach((doc) => {
          this.reclaimerArr.push({ id: doc.id, info: doc.data() });
        })
      })
    } else {
      this.fb.collection("DriverOutbound").onSnapshot((res) => {
        this.OutArr = [];
        res.forEach((doc) => {
          this.OutArr.push({ id: doc.id, info: doc.data() });
        })
      })
    }

  }
  pushToArray() {
    this.inputMass.push(this.myInput[this.myInput.length - 1]);
    setTimeout(() => {
      this.myInput = [];
    }, 100);
  }
  addInbound() {
    this.inputMass.sort().splice(this.inputMass.indexOf(undefined));
    this.fb.collection("Inbound").add({
      driverID: this.driver_id,
      driverName: this.driver_name,
      regNumber: this.reg_no,
      masses: this.inputMass,
      date: new Date().getTime()
    }).then((res) => {
      this.presentLoading();
      this.modalController.dismiss();
    })
  }
  addOutbound() {
    this.inputMass.sort().splice(this.inputMass.indexOf(undefined));
    this.fb.collection("Outbound").add({
      driverID: this.driver_id,
      driverName: this.driver_name,
      regNumber: this.reg_no,
      masses: this.inputMass,
      date: new Date().getTime()
    }).then((res) => {
      this.presentLoading();
      this.modalController.dismiss();
    })
  }
  addReclaimer() {
    this.inputMass.sort().splice(this.inputMass.indexOf(undefined));
    this.fb.collection("Reclaimer").add({
      customerID: this.driver_id,
      phoneNumber: this.phone_number,
      fullName: this.driver_name,
      idNumber: this.id_no,
      masses: this.inputMass,
      date: new Date().getTime()
    }).then((res) => {
      this.presentLoading();
      this.modalController.dismiss();
    })
  }
  searchProducts(event) {
    this.searchtxt = event.target.value;
    console.log(event);
    if (this.searchtxt == '') {
      this.getDriver();
    } else {
      let query = event.target.value.trim();
      setTimeout(() => {
        this.driverArr = this.driverArr.filter(item => item.info.fullName.toLowerCase().indexOf(query.toLowerCase()) >= 0)
        // console.log("My search results ", this.searchedItems);

      }, 1000);
    } {
      this.getDriver();
    }
  }
  searchReclaimerProducts(event) {
    this.searchtxt = event.target.value;
    console.log(event);
    if (this.searchtxt == '') {
      this.getDriver();
    } else {
      let query = event.target.value.trim();
      setTimeout(() => {
        this.driverArr = this.reclaimerArr.filter(item => item.info.fullName.toLowerCase().indexOf(query.toLowerCase()) >= 0)
        // console.log("My search results ", this.searchedItems);

      }, 1000);
    } {
      this.getDriver();
    }
  }
  searchOutboundProducts(event) {
    this.searchtxt = event.target.value;
    console.log(event);
    if (this.searchtxt == '') {
      this.getDriver();
    } else {
      let query = event.target.value.trim();
      setTimeout(() => {
        this.driverArr = this.OutArr.filter(item => item.info.fullName.toLowerCase().indexOf(query.toLowerCase()) >= 0)
        // console.log("My search results ", this.searchedItems);

      }, 1000);
    } {
      this.getDriver();
    }
  }
  slidePrev() {
    this.slides.lockSwipes(false).then(() => {
      this.slides.slidePrev().then((val) => {
        this.showHeader = true;
        this.slides.lockSwipes(true);
      });
    })
  }
  closeModal() {
    this.modalController.dismiss()
  }
  showPrice(ev, z) {

    // this.inputMass = ev.detail.value;
    this.myInput.push({ name: z.name, mass: ev.detail.value })
    // console.log("My event ",{name:z.name, mass: ev.detail.value});
    // this.pushToArray(ev.detail.value)
  }
  addPaper() {
    this.materialCollection.collection(this.value).doc('' + new Date().getTime()).set({
      paper: [{ name: 'PAP001', price: this.price1 }, { name: 'PAP003', price: this.price3 }, { name: 'PAP005', price: this.price5 }, { name: 'PAP007', price: this.price7 }]
    }).then((val) => {
      this.price1 = 0;
      this.price3 = 0;
      this.price5 = 0;
      this.price7 = 0;
    })
  }
  updatePaper() {
    this.materialCollection.collection('Paper').doc('' + new Date().getTime()).set({
      paper: [{ name: 'PAP001', price: this.info.doc.paper[0].price, newPrice: this.price1 },
      { name: 'PAP003', price: this.info.doc.paper[1].price, newPrice: this.price3 },
      { name: 'PAP005', price: this.info.doc.paper[2].price, newPrice: this.price5 },
      { name: 'PAP007', price: this.info.doc.paper[3].price, newPrice: this.price7 }]
    }).then((res)=>{
      this.materialCollection.collection('Material').doc('Paper').set({
        paper: [{ name: 'PAP001', price:  this.price1 },
      { name: 'PAP003', price: this.price3 },
      { name: 'PAP005', price: this.price5 },
      { name: 'PAP007', price: this.price7 }]
      })
    })
  }
  updatePlastic() {
    this.materialCollection.collection('Plastic').doc('' + new Date().getTime()).set({
      paper: [{ name: 'PET003', price: this.info.doc.paper[0].price, newPrice: this.pet003 },
      { name: 'PET001', price: this.info.doc.paper[1].price, newPrice: this.pet001 },
      { name: 'PET005', price: this.info.doc.paper[2].price, newPrice: this.pet005 },
      { name: 'HD001', price: this.info.doc.paper[3].price, newPrice: this.hd001 },
      { name: 'LD001', price: this.info.doc.paper[4].price, newPrice: this.ld001 },
      { name: 'LD003', price: this.info.doc.paper[5].price, newPrice: this.ld003 }]
    }).then((res)=>{
      this.materialCollection.collection('Material').doc('Plastic').set({
        plastic: [{ name: 'PET003', price: this.pet003 },
        { name: 'PET001', price: this.pet001 },
        { name: 'PET005', price: this.pet005 },
        { name: 'HD001', price: this.hd001 },
        { name: 'LD001', price: this.ld001 },
        { name: 'LD003', price: this.ld003 }]
      })
    })
  }
  updateMaterial1(info) {
    this.changeButton = true;
    this.info = info;
    if (info.doc.paper[0].newPrice == undefined) {
      this.pet003 = info.doc.paper[0].price;
      this.pet001 = info.doc.paper[1].price;
      this.pet005 = info.doc.paper[2].price;
      this.hd001 = info.doc.paper[3].price;
      this.ld001 = info.doc.paper[4].price;
      this.ld003 = info.doc.paper[5].price;
    } else {
      this.pet003 = info.doc.paper[0].newPrice;
      this.pet001 = info.doc.paper[1].newPrice;
      this.pet005 = info.doc.paper[2].newPrice;
      this.hd001 = info.doc.paper[3].newPrice;
      this.ld001 = info.doc.paper[4].newPrice;
      this.ld003 = info.doc.paper[5].newPrice;
    }

  }
  updateMaterial(info) {
    this.changeButton = true;
    this.info = info;
    if (info.doc.paper[0].newPrice == undefined) {
      this.price1 = info.doc.paper[0].price;
      this.price3 = info.doc.paper[1].price;
      this.price5 = info.doc.paper[2].price;
      this.price7 = info.doc.paper[3].price;
    } else {
      this.price1 = info.doc.paper[0].newPrice;
      this.price3 = info.doc.paper[1].newPrice;
      this.price5 = info.doc.paper[2].newPrice;
      this.price7 = info.doc.paper[3].newPrice;
    }

  }
  updateMaterial2(info) {
    this.changeButton = true;
    this.info = info;
    if (info.doc.paper[0].newPrice == undefined) {
      this.price = info.doc.paper[0].price;
    } else {
      this.price = info.doc.paper[0].newPrice;
    }
  }
  updateGlass() {
    this.materialCollection.collection('Glass').doc('' + new Date().getTime()).set({
      paper: [{ name: 'GL001', price: this.info.doc.paper[0].price, newPrice: this.price }]
    }).then((res)=>{
      this.materialCollection.collection('Material').doc('Glass').set({
        paper: [{ name: 'GL001', price: this.price }]
      })
    })
  }
  updateAl() {
    this.materialCollection.collection('Aluminium').doc('' + new Date().getTime()).set({
      paper: [{ name: 'NFALO01', price: this.info.doc.paper[0].price, newPrice : this.price }]
    }).then((res)=>{
      this.materialCollection.collection('Material').doc('Aluminium').set({
        paper: [{ name: 'NFALO01', price: this.price }]
      })
    })
  }
  getPapers(material) {
    this.infoArr = [];
    this.materialCollection.collection('Material').doc(material).onSnapshot((res) => {
      this.infoArr = res.data().paper
      console.log("info ", res.data());
    })
  }
  sortByDate() {
    this.infoArray.reverse();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 3000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  addPlastic() {
    this.materialCollection.collection(this.value).doc('' + new Date().getTime()).set({
      paper: [{ name: 'PET003', price: this.pet003 }, { name: 'PET001', price: this.pet001 }, { name: 'PET005', price: this.pet005 },
      { name: 'HD001', price: this.hd001 }, { name: 'LD001', price: this.ld001 }, { name: 'LD003', price: this.ld003 }]
    }).then((val) => {
      this.pet003 = null;
      this.pet005 = null;
      this.pet001 = null;
      this.hd001 = null;
      this.ld001 = null;
      this.ld003 = null;
    })
  }

  addGlass() {
    this.materialCollection.collection(this.value).doc('' + new Date().getTime()).set({
      paper: [{ name: 'GL001', price: this.price }]
    }).then((val) => {
      this.price = null;
    })
  }

  addAl() {
    this.materialCollection.collection(this.value).doc('' + new Date().getTime()).set({
      paper: [{ name: 'NFALO01', price: this.price }]
    }).then((val) => {
      this.price = null;
    })
  }
 
  pcsh1() {
    this.renderer.setStyle(document.getElementById('pc1'), 'display', 'flex');
    this.renderer.setStyle(document.getElementById('pc1'), 'animation-name', 'bounceInRight');
    this.renderer.setStyle(document.getElementById('pc1'), 'animation-duration', '1s');
    // this.renderer.setStyle(document.getElementById('pc1'), 'z-index','1');
  }
  closeDiv() {
    // this.renderer.setStyle(document.getElementById('pc1'), 'display','none');
    this.renderer.setStyle(document.getElementById('pc1'), 'animation-name', 'bounceOutRight');
    this.renderer.setStyle(document.getElementById('pc1'), 'animation-duration', '1s');
    setTimeout(() => {
      this.renderer.setStyle(document.getElementById('pc1'), 'display', 'none');
    }, 500);
  }
}
