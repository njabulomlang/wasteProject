import { Component, OnInit, Renderer2 } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Dashboard',
      url: '/folder/Dashboard',
      image: '../assets/SVG/homeW.svg'
    },
    {
      title: 'Inbound',
      url: '/folder/Inbound',
      image: '../assets/inboundW.svg'
    },
    {
      title: 'Outbound',
      url: '/folder/Outbound',
      image: '../assets/outboundW.svg'
    },
    {
      title: 'Reclaimers',
      url: '/folder/Reclaimers',
      image: '../assets/reclaimerW.svg'
    },
    {
      title: 'Manage Users',
      url: '/folder/Manage Users',
      image: '../assets/SVG/manageUserz.svg'
    },
    {
      title: 'Profile',
      url: '/folder/Profile',
      image: '../assets/user (1).png'
    }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, 
    public renderer : Renderer2
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
