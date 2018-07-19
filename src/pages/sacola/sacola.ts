import { HttpServicesProvider } from './../../providers/http-services/http-services';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-sacola',
  templateUrl: 'sacola.html',
})
export class SacolaPage {

  public produtos: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public alertCtrl: AlertController,
              public http: HttpServicesProvider) {
  }

  ionViewDidEnter() {
    const data = JSON.parse(localStorage.getItem('session'));
    this.produtos = data;

    console.log(this.produtos);
  }

  retirarProduto(codigo){
      
      let alert = this.alertCtrl.create({
        // title: 'Confirm purchase',
        subTitle: 'Deseja retirar esse produto da sua sacola?',
        buttons: [
          {
            text: 'Não',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Sim',
            handler: () => {
              this.removeItem(codigo);
            }
          }
        ]
      });
      alert.present();
    
  }

  removeItem(codigo) {
    var index = -1;
    var obj = JSON.parse(localStorage.getItem('session')) || {}; //fetch cart from storage
    var items = obj || []; //get the products
    for (var i = 0; i < items.length; i++) { //loop over the collection
      if (items[i].codigo === codigo) { //see if ids match
        items.splice(i, 1); //remove item from array
        break; //exit loop
      }
    }
    localStorage.setItem('session', JSON.stringify(obj)); //set item back into storage
    this.ionViewDidEnter();
  }

  comprar(){
    this.navCtrl.push(HomePage, {'sacola':true, 'pg': 'sacola'});
  }

}
