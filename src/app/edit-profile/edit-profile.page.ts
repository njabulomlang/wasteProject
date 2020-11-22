import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  @Input("id") id;
  @Input("collection") collection;
  fullName = new FormControl('', Validators.required);
  email : string = '';
  phoneNumber = new FormControl(null, Validators.minLength(10));
  regNo = new FormControl('', Validators.required);
  cName = new FormControl('', Validators.required);
  profilePic: string = '';
  cAddress = new FormControl('', Validators.required);
  idNumber = new FormControl(null, Validators.minLength(13));
  streetName = new FormControl('', Validators.required);
  town = new FormControl('', Validators.required);
  fb = firebase.firestore();
  storage = firebase.storage().ref();
  progress = 0;
  constructor(public modalCtrl : ModalController) { }

  ngOnInit() {
    // console.log("id ", this.id);
    this.getProfile();
    
  }
  addEventListener(ev) {
    // console.log("my pic ", ev.target.files[0]);
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
        if (this.collection==='Admin') {
          this.fb.collection(this.collection).doc(this.id).onSnapshot((doc)=>{
            if (doc.exists) {
              this.fb.collection(this.collection).doc(this.id).update({ profilePic: dwnURL })
            } else {
              this.fb.collection(this.collection).doc(this.id).set({ profilePic: dwnURL })
            }
          })
        } else {
          this.fb.collection(this.collection).doc(this.id).update({ profilePic: dwnURL })
        }
        
        // this.dbProfile.doc(firebase.auth().currentUser.uid).update({profilePic: this.profilePic})
      });
    });
    // console.log("My pic is ", this.profilePic);
  }
  getProfile() {
    if (this.collection == 'Customer') {
      this.fb.collection(this.collection).doc(this.id).onSnapshot((doc) => {
        this.fullName.setValue(doc.data().fullName);
        this.phoneNumber.setValue(doc.data().phoneNumber);
        this.idNumber.setValue(doc.data().idNumber);
        this.streetName.setValue(doc.data().streetName);
        this.town.setValue(doc.data().town);
        this.profilePic = doc.data().profilePic;
      })
    } else if(this.collection == 'Admin') {
      this.fb.collection(this.collection).doc(this.id).onSnapshot((doc) => {
        this.fullName.setValue(doc.data().fullName);
        this.phoneNumber.setValue(doc.data().phoneNumber);
        this.streetName.setValue(doc.data().Address);
        this.profilePic = doc.data().profilePic;
        this.email = firebase.auth().currentUser.email;
      })
    } else {
      this.fb.collection(this.collection).doc(this.id).onSnapshot((doc) => {
        this.fullName.setValue(doc.data().fullName);
        this.phoneNumber.setValue(doc.data().phoneNumber);
        this.regNo.setValue(doc.data().regNo);
        this.cName.setValue(doc.data().companyName);
        this.cAddress.setValue(doc.data().companyAddress);
        this.profilePic = doc.data().profilePic;
      })
    }

  }
  updateDetails() {
    if (this.collection === 'Customer') {
      this.fb.collection(this.collection).doc(this.id).update({
        fullName: this.fullName.value,
        phoneNumber: this.phoneNumber.value,
        idNumber: this.idNumber.value,
        streetName: this.streetName.value,
        town: this.town.value,
      }).then((res)=>{
        this.modalCtrl.dismiss();
      })
    }else if(this.collection == 'Admin') {
      this.fb.collection(this.collection).doc(this.id).set({
        fullName: this.fullName.value,
        phoneNumber: this.phoneNumber.value,
        Address: this.streetName.value,
        profilePic: this.profilePic
      }).then((res)=>{
        this.modalCtrl.dismiss();
      })
    } else {
      this.fb.collection(this.collection).doc(this.id).update({
        fullName: this.fullName.value,
        phoneNumber: this.phoneNumber.value,
        regNo: this.regNo.value,
        companyName: this.cName.value,
        companyAddress: this.cAddress.value
      }).then((res)=>{
        this.modalCtrl.dismiss();
      })
    }
  }

}
