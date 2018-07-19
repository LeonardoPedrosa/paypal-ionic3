import { SacolaPage } from './../sacola/sacola';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpServicesProvider } from './../../providers/http-services/http-services';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage{

  public produtos: any;
  public produto: any;
  public nProdutos: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public http: HttpServicesProvider) {
    
    
  }

  //METODO PARA DAR REFRESH SEMPRE QUE INICIAR A PAGINA
  ionViewDidEnter(){
    const data = JSON.parse(localStorage.getItem('session'));
    console.log(data);
    if(data != null){
      this.nProdutos = data.length;
      if(this.nProdutos == 0 ){
        localStorage.removeItem("session");
        this.nProdutos = null;
      }
      console.log(data.length);
    }
    //LISTANDO PRODUTOS
    this.http.get('pagseguro')   
    .subscribe(data => {
      this.produtos = data;
      console.log(this.produtos);       
    });
  }
  
  //PEGANDO O CODIGO DO PRODUTO E REPASSANDO PARA PR�XIMA ETAPA
  getInfoProduto(codigo){ 
    this.http.get('pagseguro/'+codigo)   
    .subscribe(data => {
      this.produto = data;
      console.log(this.produto); 
         
      this.navCtrl.push(HomePage,{
        'codigo': codigo,  
      });  

    });
    
  }
  doRefresh(refresher) {
    this.http.get('pagseguro')   
    .subscribe(data => {
      this.produtos = data;
      console.log(this.produtos);     
      refresher.complete();  
    });

    // setTimeout(() => {
    //   console.log('Async operation has ended');
    //   refresher.complete();
    // }, 2000);
  }

  sacola(){
    this.navCtrl.push(SacolaPage);
  }

}
