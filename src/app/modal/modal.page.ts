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
  price3 : number;
  price5 : number;
  price7 : number;
  infoArr = [];
  updateArray = [];
  docUpdate = [];

  hd001 : number;
  ld003 : number;
  ld001 : number;
  pet005 : number;
  pet001 : number;
  pet003 : number;
  showHeader = true;
  valueC = '';
  mass;
  inputMass = [];
  myInput = [];
  fullName = new FormControl('', Validators.required);
  phoneNumber = new FormControl(null, Validators.minLength(10));
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
  constructor(public loadingController: LoadingController, public renderer: Renderer2,
    public modalController: ModalController, public alertController: AlertController) {
   
    // this.materialCollection = .;
    setTimeout(() => {
      this.renderer.setStyle(document.getElementById('pc1'), 'display', 'none');

    }, 0);

  }

  ngOnInit() {
    //print 123
    // console.log(this.value);
    // this.valueC = 'Paper';

    setTimeout(() => {
      this.slides.lockSwipes(true);
      if (this.value == 'Paper_Inbound' || this.value == 'Paper_Outbound' || this.value == 'Paper_Reclaimer') {
        this.materialClicked('Paper');
        this.getPapers('Paper');
      } else if (this.value == 'Plastic_Inbound' || this.value == 'Plastic_Outbound' || this.value == 'Plastic_Reclaimer') {
        this.materialClicked('Plastic');
        this.getPapers('Plastic');
      } else if (this.value == 'Aluminium_Inbound' || this.value == 'Aluminium_Outbound' || this.value == 'Aluminium_Reclaimer') {
        this.materialClicked('Aluminium');
        this.getPapers('Aluminium');
      } else {
        this.materialClicked('Glass');
        this.getPapers('Glass')
      }
    }, 500);

    // document.getElementById("pc1").classList.contains("hide");
    // this.getPapers();
    this.getDriver();
    // console.log("My update array ",this.updateArray);
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
    this.materialCollection.collection(this.valueC).onSnapshot((res) => {
      this.infoArr = [];
      res.forEach((data) => {
        this.infoArr.push({ id: data.id, doc: data.data() });
      })
    })
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
    // console.log("My ...", this.inputMass);

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
    //  console.log("My masses ", this.inputMass);
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
    // this.infoArr.forEach((el)=>{
    //   console.log("My element ", el);

    // })

    // setTimeout(() => {
    // if (this.infoArr.length !== this.updateArray.length) {
    //    console.log("Update ");

    //   // this.materialCollection.collection(this.value).doc(this.infoArr[this.infoArr.length - 1].id).collection('Updates').doc('' + new Date().getTime()).set({
    //   //   paper: [{ name: 'PAP001', price: this.price1 }, { name: 'PAP003', price: this.price3 }, { name: 'PAP005', price: this.price5 }, { name: 'PAP007', price: this.price7 }]
    //   // }).then((res) => {
    //   //   this.price1 = 0;
    //   //   this.price3 = 0;
    //   //   this.price5 = 0;
    //   //   this.price7 = 0;
    //   //   // console.log("updated");

    //   //   // this.getPapers();
    //   // })
    // }
    // else {
    //   console.log("add");

    this.materialCollection.collection(this.value).doc('' + new Date().getTime()).set({
      paper: [{ name: 'PAP001', price: this.price1 }, { name: 'PAP003', price: this.price3 }, { name: 'PAP005', price: this.price5 }, { name: 'PAP007', price: this.price7 }]
    }).then((val) => {
      this.price1 = 0;
      this.price3 = 0;
      this.price5 = 0;
      this.price7 = 0;
      // console.log("added");

      // this.getPapers();
    })
    // }
    // }, 1000);
  }

  getPapers(material) {
    // this.presentLoading();
    this.materialCollection.collection(material).onSnapshot((res) => {
      this.infoArr = [];
      this.updateArray = [];
      res.forEach((data) => {
        this.infoArr.push({ id: data.id, doc: data.data() });

        // this.getUpdates(data.id);
        // this.getDocUpdate(data.id);
        //  setTimeout(() => {

        //  }, 1500);


      })

    })
  }
  sortByDate() {
    this.infoArr.reverse();
    this.docUpdate.reverse();
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
    // this.infoArr.forEach((el)=>{
    //   console.log("My element ", el);

    // })

    // setTimeout(() => {
    // if (this.infoArr.length !== this.updateArray.length) {
    //    console.log("Update ");

    //   // this.materialCollection.collection(this.value).doc(this.infoArr[this.infoArr.length - 1].id).collection('Updates').doc('' + new Date().getTime()).set({
    //   //   paper: [{ name: 'PAP001', price: this.price1 }, { name: 'PAP003', price: this.price3 }, { name: 'PAP005', price: this.price5 }, { name: 'PAP007', price: this.price7 }]
    //   // }).then((res) => {
    //   //   this.price1 = 0;
    //   //   this.price3 = 0;
    //   //   this.price5 = 0;
    //   //   this.price7 = 0;
    //   //   // console.log("updated");

    //   //   // this.getPapers();
    //   // })
    // }
    // else {
    //   console.log("add");

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
      // console.log("added");

      // this.getPapers();
    })
    // }
    // }, 1000);
  }

  addGlass() {
    // this.infoArr.forEach((el)=>{
    //   console.log("My element ", el);

    // })

    // setTimeout(() => {
    // if (this.infoArr.length !== this.updateArray.length) {
    //    console.log("Update ");

    //   // this.materialCollection.collection(this.value).doc(this.infoArr[this.infoArr.length - 1].id).collection('Updates').doc('' + new Date().getTime()).set({
    //   //   paper: [{ name: 'PAP001', price: this.price1 }, { name: 'PAP003', price: this.price3 }, { name: 'PAP005', price: this.price5 }, { name: 'PAP007', price: this.price7 }]
    //   // }).then((res) => {
    //   //   this.price1 = 0;
    //   //   this.price3 = 0;
    //   //   this.price5 = 0;
    //   //   this.price7 = 0;
    //   //   // console.log("updated");

    //   //   // this.getPapers();
    //   // })
    // }
    // else {
    //   console.log("add");

    this.materialCollection.collection(this.value).doc('' + new Date().getTime()).set({
      paper: [{ name: 'GL001', price: this.price }]
    }).then((val) => {
      this.price = null;
      // console.log("added");

      // this.getPapers();
    })
    // }
    // }, 1000);
  }

  addAl() {
    // this.infoArr.forEach((el)=>{
    //   console.log("My element ", el);

    // })

    // setTimeout(() => {
    // if (this.infoArr.length !== this.updateArray.length) {
    //    console.log("Update ");

    //   // this.materialCollection.collection(this.value).doc(this.infoArr[this.infoArr.length - 1].id).collection('Updates').doc('' + new Date().getTime()).set({
    //   //   paper: [{ name: 'PAP001', price: this.price1 }, { name: 'PAP003', price: this.price3 }, { name: 'PAP005', price: this.price5 }, { name: 'PAP007', price: this.price7 }]
    //   // }).then((res) => {
    //   //   this.price1 = 0;
    //   //   this.price3 = 0;
    //   //   this.price5 = 0;
    //   //   this.price7 = 0;
    //   //   // console.log("updated");

    //   //   // this.getPapers();
    //   // })
    // }
    // else {
    //   console.log("add");

    this.materialCollection.collection(this.value).doc('' + new Date().getTime()).set({
      paper: [{ name: 'NFALO01', price: this.price }]
    }).then((val) => {
      this.price = null;

      // console.log("added");

      // this.getPapers();
    })
    // }
    // }, 1000);
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
