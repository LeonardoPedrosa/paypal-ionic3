import { ProdutosPage } from './../produtos/produtos';
import { HttpServicesProvider } from './../../providers/http-services/http-services';

import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration, PayPalPaymentDetails, PayPalItem} from '@ionic-native/paypal';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit{
  
  public codigo: any;
  public produto: any = {};
  public usuario: any = {};
  public quant = 1;
  public div_dados = false;
  public alerta = false;
  public valor_total: any;
  public favorito = 'favorito';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public payPal: PayPal,
              public http: HttpServicesProvider,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController
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
     this.valor_total = this.produto.preco_produto; 
     // this.pagseg.dados.amount = this.produto.preco_produto; 
     // this.pagseg.dados.codigo_produto = this.codigo;
     // this.pagseg.dados.nome_produto = this.produto.nome_produto;
     // this.pagseg.dados.preco_produto = this.produto.preco_produto+'.00';
     // console.log(this.pagseg.dados.preco_produto)
   });

   //CHAMANDO DADOS DO USUARIO
   this.http.get('usuario/1')
    .subscribe(data =>{
      this.usuario = data;
      console.log(this.usuario);
    })

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
       
        let details = new PayPalPaymentDetails(this.valor_total+'.00', '0.00', '0.00'); //especializar
        let payment = new PayPalPayment(this.valor_total, 'BRL', this.produto.nome_produto, 'Sale', details); //especializar
        this.payPal.renderSinglePaymentUI(payment).then((response) =>{
        //resposta para caso pagamento seja efetuado com sucesso
         this.quantidade();         
         this.navCtrl.setRoot(ProdutosPage);
         this.alertaCompraEfetuada();

        }, () =>{
          //resposta para erro no pagamento
          console.log('erro ao redenrizar pagamento do paypal');
        })
      })
    })
  }

  quantidade(){
    let update ={
      quantidade_disponivel: this.produto.quantidade_disponivel - this.quant,
    }

    this.http.update('pagseguro/'+this.codigo, update)
      .subscribe(data => {
       
    });

  }

  //MELHORAR CHAMADA DE ITENS
  item(){
    let item = new PayPalItem(this.produto.nome_produto, this.quant, this.valor_total, 'BRL');
    console.log(item)
  }

  alertaCompraEfetuada() {
    let alert = this.alertCtrl.create({
      title: 'Olá, nome usuário',
      subTitle: 'Sua compra foi efetuada com sucesso. Parabens! (:',
      buttons: ['Ok']
    });
    alert.present();
  }

  quantMais(){
    if(this.quant < this.produto.quantidade_disponivel){
      this.quant ++;
      this.valor_total = this.produto.preco_produto * this.quant;
    }
  }

  quantMenos(){
    if(this.quant > 1){
      this.quant --;
      this.valor_total = this.valor_total - this.produto.preco_produto;
    }
  }

  favoritar(){
    if(this.favorito == 'favorito'){
      this.favorito = 'favoritado'
      this.presentToast(this.produto.nome_produto+ ' foi adicionado aos favoritos.');
      
    }else{
      this.favorito = 'favorito'
     
    }
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2500
    });
    toast.present();
  }

  dados(){
    if(this.alerta == false){
     this.alertaDados();
    }
    this.div_dados = true;
  }

  voltar(){
    this.div_dados = false;
  }

  alertaDados() {
    this.alerta = true;
    let alert = this.alertCtrl.create({
      title: 'Olá, '+this.usuario.nome,
      subTitle: 'Estamos quase finalizando! (: Vamos checar seus dados antes?',
      buttons: ['Sim']
    });
    alert.present();
  }

  ///ENVIO DE E-MAIL APÓS COMPRA REALIZADA COM SUCESSO
  
 
 
}
