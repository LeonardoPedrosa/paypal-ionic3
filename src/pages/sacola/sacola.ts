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
  public total = 0;
  public qtd = 0;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public alertCtrl: AlertController,
              public http: HttpServicesProvider) {
  }

  ionViewDidEnter() {
    const data = JSON.parse(localStorage.getItem('session'));
    this.produtos = data;
    this.somar();

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
    var obj = JSON.parse(localStorage.getItem('session')) || {}; //chamando a lista
    var items = obj || []; //chamando a lista
    for (var i = 0; i < items.length; i++) { //loop para pecorrer o array
      if (items[i].codigo === codigo) { //checando o codigo
        items.splice(i, 1); //remove item do array
        break; //exit loop
      }
    }
    localStorage.setItem('session', JSON.stringify(obj)); 
    this.total = 0;
    this.ionViewDidEnter();
  }

  somar(){
    var obj = JSON.parse(localStorage.getItem('session'));
    for(var i =0; i< obj.length; i++){
      this.total+= parseInt(obj[i].valor_total);
      this.qtd+= parseInt(obj[i].qtd);
      
    }
    
    console.log(this.total);
    console.log(this.qtd);
    
  }

  comprar(){
    this.navCtrl.push(HomePage, 
      {
        'sacola':true, 
        'pg': 'sacola', 
        'qtd': this.qtd,
        'vl_total': this.total  
      
      });
  }

}
