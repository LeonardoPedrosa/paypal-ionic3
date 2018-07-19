import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-sacola',
  templateUrl: 'sacola.html',
})
export class SacolaPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public alertCtrl: AlertController) {
  }

  ionViewDidEnter() {
    const data = JSON.parse(localStorage.getItem('session'));
    console.log(data);
  }

  retirarProduto(){
    
      let alert = this.alertCtrl.create({
        // title: 'Olá, ',
        subTitle: 'Deseja retirar "Nome do produto" da sua sacola?',
        buttons: ['Sim']
      });
      alert.present();
    
  }

  comprar(){
    this.navCtrl.push(HomePage, {'sacola':true, 'pg': 'sacola'});
  }

}
