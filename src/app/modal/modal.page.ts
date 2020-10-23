import { Component, Input, OnInit } from '@angular/core';

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
  materialForm;
  price1;
  price3;
  price5;
  price7;
  infoArr = [];
  updateArray = [];
  constructor() {
    // this.materialCollection = .;

  }

  ngOnInit() {
    //print 123
    console.log(this.value);
    this.getPapers();
    setTimeout(() => {
      // this.infoArr.forEach((i)=>{

      // })
     this.getUpdates();

    }, 1000);


  }
  addPaper() {
    if (this.infoArr.length == 1 && this.updateArray.length == 0 || this.infoArr.length==0 ) {
      console.log("My update array ", this.updateArray.length);
      
      this.materialCollection.collection(this.value).doc(this.infoArr[this.infoArr.length - 1].id).collection('Updates').doc('' + new Date().getTime()).set({
        paper: [{ name: 'PAP001', price: this.price1 }, { name: 'PAP003', price: this.price3 }, { name: 'PAP005', price: this.price5 }, { name: 'PAP007', price: this.price7 }]
      }).then((res) => {
        this.price1 = 0;
        this.price3 = 0;
        this.price5 = 0;
        this.price7 = 0;
      })
    } 
    //  else if (this.infoArr.length == 1 && this.updateArray.length == 1 ) {
    //   console.log("My array ", this.infoArr.length);
    //   this.materialCollection.collection(this.value).doc('' + new Date().getTime()).set({
    //     paper: [{ name: 'PAP001', price: this.price1 }, { name: 'PAP003', price: this.price3 }, { name: 'PAP005', price: this.price5 }, { name: 'PAP007', price: this.price7 }]
    //   }).then((val) => {
    //     this.price1 = 0;
    //     this.price3 = 0;
    //     this.price5 = 0;
    //     this.price7 = 0;
    //   })
    // } else if (this.infoArr.length == 1 && this.updateArray.length == 0 ) {
    //   this.materialCollection.collection(this.value).doc('' + new Date().getTime()).set({
    //     paper: [{ name: 'PAP001', price: this.price1 }, { name: 'PAP003', price: this.price3 }, { name: 'PAP005', price: this.price5 }, { name: 'PAP007', price: this.price7 }]
    //   }).then((val) => {
    //     this.price1 = 0;
    //     this.price3 = 0;
    //     this.price5 = 0;
    //     this.price7 = 0;
    //   })
    // } 
    else {
      this.materialCollection.collection(this.value).doc('' + new Date().getTime()).set({
        paper: [{ name: 'PAP001', price: this.price1 }, { name: 'PAP003', price: this.price3 }, { name: 'PAP005', price: this.price5 }, { name: 'PAP007', price: this.price7 }]
      }).then((val) => {
        this.price1 = 0;
        this.price3 = 0;
        this.price5 = 0;
        this.price7 = 0;
      })
    }

  }
  getPapers() {
    this.materialCollection.collection(this.value).onSnapshot((res) => {
      this.infoArr = [];
      res.forEach((data) => {
        this.infoArr.push({ id: data.id, doc: data.data() });
      })
      //  console.log('My array ', this.infoArr);

    })
  }
  getUpdates() {
    // this.materialCollection.collection(this.value).doc(this.infoArr[this.infoArr.length - 1].id).collection('Updates')
    this.infoArr.forEach((i)=>{
      this.materialCollection.collection(this.value).doc(i.id).collection('Updates').onSnapshot((res)=>{
        res.forEach((doc)=>{
          this.updateArray.push(doc.data());  
        })
      })
    })
  }
}
