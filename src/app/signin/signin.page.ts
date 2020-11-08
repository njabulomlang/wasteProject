import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController, MenuController, NavController, ToastController } from '@ionic/angular';
//import { animate } from 'highcharts';
import * as firebase from 'firebase';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  email
  password
  loginForm
  emailPattern: string = "[a-zA-Z0-9-_.+#$!=%^&*/?]+[@][a-zA-Z0-9-]+[.][a-zA-Z0-9]+"
  constructor(public menuCtrl: MenuController, private navCtrl: NavController, private formBuilder: FormBuilder,
    public toastController: ToastController, public loadingController: LoadingController, public alertController: AlertController) {
    this.menuCtrl.enable(false);
    this.loginForm = formBuilder.group({
      email: [this.email, Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      password: [this.password, Validators.compose([Validators.required, Validators.minLength(6)])]
    })
  }

  ngOnInit() {
  }

  loginUser() {
    firebase.auth().signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password).then((val) => {
      this.presentLoading();
      if (val.user) {
        this.presentToast('Logged In successfully..');
      } else {
        this.presentToast('Error while logging in..');
      }
    }).catch((error) => {
      this.presentAlert(error.message)
    });
  }
  
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Enter your email',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          // disabled : true,
          text: 'Ok',
          handler: (data) => {
            // console.log(data.name1);
            firebase.auth().sendPasswordResetEmail(data.name1).then((value)=>{
              // console.log("password sent");
              this.presentToast("Password sent");
            }).catch((err)=>{
              // console.error(err.message)
              this.presentToast(err.message);
            })
          }
        }
      ]
    });

    await alert.present();
  }
  async presentAlert(msg) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Login failed",
      // subHeader: 'Subtitle',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Signing In...',
      duration: 3000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    // console.log('Loading dismissed!');
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
