import { ProdutosPage } from './../produtos/produtos';
import { HttpServicesProvider } from './../../providers/http-services/http-services';

import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration, PayPalPaymentDetails} from '@ionic-native/paypal';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit{
  public codigo: any;
  public produto: any = {};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public payPal: PayPal,
              public http: HttpServicesProvider,
              private alertCtrl: AlertController 
              ) {

  //PEGANDO CODIGO DO PRODUTO
  this.codigo  = this.navParams.get('codigo');
  console.log(this.codigo);

 

  }//FIM CONSTRUTOR

  ngOnInit(){
     //SETANDO VALOR DO PRODUTO EM VARIAVEL DO PROVIDER
   this.http.get('pagseguro/'+this.codigo)   
   .subscribe(data => {
     this.produto = data;
     console.log(this.produto);   
     // this.pagseg.dados.amount = this.produto.preco_produto; 
     // this.pagseg.dados.codigo_produto = this.codigo;
     // this.pagseg.dados.nome_produto = this.produto.nome_produto;
     // this.pagseg.dados.preco_produto = this.produto.preco_produto+'.00';
     // console.log(this.pagseg.dados.preco_produto)
   });

  }

 
  comprar(){
    this.payPal.init({
      PayPalEnvironmentProduction: '',
      PayPalEnvironmentSandbox:'ARMZbn7Vq0IgnI1zO0g-ojHOTwMBmW_CpuUyym5vigvBINI6NTDskIOu0k2CStWWPPChD3_rhkjjUQRm'

    }).then(() =>{
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        acceptCreditCards: true,
        languageOrLocale: 'pt-BR',
        merchantName: 'Leonardo Pedrosa',
        merchantPrivacyPolicyURL: '',
        merchantUserAgreementURL: ''
      })).then(() => {
        let details = new PayPalPaymentDetails(this.produto.preco_produto+'.00', '0.00', '0.00'); //especializar
        let payment = new PayPalPayment(this.produto.preco_produto, 'BRL', this.produto.nome_produto, 'Sale', details); //especializar
        this.payPal.renderSinglePaymentUI(payment).then((response) =>{
         //resposta para caso pagamento seja efetuado com sucesso
         this.navCtrl.setRoot(ProdutosPage);
         this.alertaCompraEfetuada();

        }, () =>{
          //resposta para erro no pagamento
          console.log('erro ao redenrizar pagamento do paypal');
        })
      })
    })
  }

  voltar(){
    this.navCtrl.setRoot(ProdutosPage);
  }

  alertaCompraEfetuada() {
    let alert = this.alertCtrl.create({
      title: 'Olá, nome usuário',
      subTitle: 'Sua compra foi efetuada com sucesso. Parabens! (:',
      buttons: ['Ok']
    });
    alert.present();
  }
}
