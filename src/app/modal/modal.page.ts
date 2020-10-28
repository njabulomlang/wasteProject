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
  price1;
  price3;
  price5;
  price7;
  infoArr = [];
  updateArray = [];
  docUpdate = [];

  hd001
  ld003
  ld001
  pet005
  pet001
  pet003
  showHeader = true;
  valueC = '';
  mass;
  inputMass = [];
  myInput = [];

  // obj = {
  //   fullName:'',
  //   phoneNumber:0,
  //   regNo:'',
  //   cName:'',
  //   profilePic:null,
  //   cAddress:''
  // }
  fullName = new FormControl('', Validators.required);
  phoneNumber = new FormControl(null, Validators.minLength(10));
  regNo = new FormControl('', Validators.required);
  cName = new FormControl('', Validators.required);
  profilePic = new FormControl(null, Validators.required);
  cAddress = new FormControl('', Validators.required);
  // @Input() lastName: string;
  // @Input() middleInitial: string;

  storage = firebase.storage().ref();
  progress;
  fb = firebase.firestore();
  driver_id;
  driver_name;
  reg_no;
  driverArr: any[];
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
      if (this.value == 'Paper_Inbound') {
        this.materialClicked('Paper');
      } else if (this.value == 'Plastic_Inbound') {
        this.materialClicked('Plastic')
      } else if (this.value == 'Aluminium_Inbound') {
        this.materialClicked('Aluminium')
      } else {
        this.materialClicked('Glass')
      }

    }, 500);

    // document.getElementById("pc1").classList.contains("hide");
    this.getPapers();
    this.getDriver();
    // console.log("My update array ",this.updateArray);
  }
  ionViewWillEnter() {
    this.getPapers();
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
          this.getPapers();
        });
      })
      res.onSnapshot((doc) => {
        this.driver_id = doc.id;
        console.log("My doc ", doc.data());
      })
    })
    // }, 100);

  }
  async presentAlert(id) {
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
                this.driver_id = id;
                this.slides.lockSwipes(true);
                this.getPapers();
              });
            })
          }
        }
      ]
    });
    await alert.present();
  }
  // slideWithId(id) {
  //   this.presentAlert();

  // }

  getDriver() {
    this.fb.collection("Driver").onSnapshot((res) => {
      this.driverArr = [];
      res.forEach((doc) => {
        this.driverArr.push({ id: doc.id, info: doc.data() });
      })
    })
  }
  pushToArray() {
    this.inputMass.push(this.myInput[this.myInput.length - 1]);
    setTimeout(() => {
      this.myInput = [];
    }, 100);
  }
  addInbound() {
    this.fb.collection("Inbound").add({
      driverID: this.driver_id,
      masses: this.inputMass,
      date: new Date().getTime()
    })
    // console.log("My masses ", this.inputMass);
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

  getPapers() {
    // this.presentLoading();
    this.materialCollection.collection(this.value).onSnapshot((res) => {
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
  // getUpdates(id) {
  //   this.materialCollection.collection(this.value).doc(id).collection('Updates').onSnapshot((res) => {
  //     res.forEach((doc) => {
  //       this.updateArray.push({ id: doc.id, doc: doc.data() });
  //       // this.getDocUpdate(doc.id);
  //     })
  //     console.log("Upd arr ",this.updateArray);


  //     setTimeout(() => {
  //       this.getDocUpdate(id);
  //     }, 1000);
  //      console.log('My update array ', this.updateArray.length);
  //   })
  // }
  // getDocUpdate(id) {
  //   let price = 0;
  //     this.updateArray.forEach((i) => {
  //       this.docUpdate = [];
  //       this.materialCollection.collection(this.value).doc(id).collection('Updates').doc(i.id).onSnapshot((doc) => {
  //           console.log("My prices ", doc.data());
  //         // .forEach(y => {
  //         this.docUpdate.push(doc.data().paper);
  //       })
  //       // 
  //       console.log("....",this.docUpdate);
  //     })

  // }

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
