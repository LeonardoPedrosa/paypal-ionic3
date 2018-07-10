import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpServicesProvider } from './../../providers/http-services/http-services';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage implements OnInit {

  public produtos: any;
  public produto: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public http: HttpServicesProvider) {
  }

  ngOnInit(){
    this.http.get('pagseguro')   
      .subscribe(data => {
        this.produtos = data;
        console.log(this.produtos);       
      });
    }

  //PEGANDO O CODIGO DO PRODUTO E REPASSANDO PARA PRÓXIMA ETAPA
  getInfoProduto(codigo){ 
    this.http.get('pagseguro/'+codigo)   
    .subscribe(data => {
      this.produto = data;
      console.log(this.produto); 
         
      this.navCtrl.setRoot(HomePage,{
        'codigo': codigo,  
      });  

    });
  
  }

}
