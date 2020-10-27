import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { LoadingController, ModalController, IonSlides } from '@ionic/angular';

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
  constructor(public loadingController: LoadingController, public renderer: Renderer2,
    public modalController: ModalController) {

    // this.materialCollection = .;
    setTimeout(() => {
      this.renderer.setStyle(document.getElementById('pc1'), 'display', 'none');
      
      
      console.log("Slide index ",this.slides.getActiveIndex());
      
    }, 0);

  }

  ngOnInit() {
    //print 123
    // console.log(this.value);
    // this.valueC = 'Paper';
    setTimeout(() => {
      this.slides.lockSwipes(true);
      this.materialClicked('Paper');
    }, 500);
    
    // document.getElementById("pc1").classList.contains("hide");
    this.getPapers();
    // console.log("My update array ",this.updateArray);

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
    this.slides.lockSwipes(false).then(() => {
      this.slides.slideNext().then((val) => {
        this.showHeader = false;
        this.slides.lockSwipes(true);
      });
    })

  }
  slidePrev(){
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
