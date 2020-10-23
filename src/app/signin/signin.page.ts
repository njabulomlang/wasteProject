import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  constructor(public menuCtrl : MenuController, private navCtrl : NavController) { 
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
  }
  loginUser() {
    this.navCtrl.navigateRoot('folder/Dashboard');
  }
}
