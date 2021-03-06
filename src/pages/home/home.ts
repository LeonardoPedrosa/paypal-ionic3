import { ProdutosPage } from './../produtos/produtos';
import { HttpServicesProvider } from './../../providers/http-services/http-services';

import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration, PayPalPaymentDetails, PayPalItem} from '@ionic-native/paypal';
import { Http } from '../../../node_modules/@angular/http';
import xml2js from 'xml2js';

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
  public fretes = false;
  public valor_resultado: any;
  public valor_resultado_sedex: any;
  public prazo: any;
  public prazo_sedex: any;
  public cep_5: any;
  public cep_3: any;
  public editar_id: any;
  public sacola: any;
  public pag: any;
  public vlr_total: any;
  public qtd: any;
  // public valor_produto: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public payPal: PayPal,
              public http: HttpServicesProvider,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              public httpteste: Http,
              public loadingCtrl: LoadingController
              ) {

  //PEGANDO CODIGO DO PRODUTO
  this.codigo  = this.navParams.get('codigo');
  console.log(this.codigo);
  
  const sacola = this.navParams.get('sacola');
  if(sacola != undefined){
    this.div_dados = sacola;
  }

  const pag = this.navParams.get('pg');
  if(pag != undefined){
    this.pag = pag;
  }

  const vlr_total = this.navParams.get('vl_total');
  if(vlr_total != undefined){
    this.vlr_total = vlr_total;
    console.log(this.vlr_total)
  }

  const qtd = this.navParams.get('qtd');
  if(qtd != undefined){
    this.qtd = qtd;
  }

  }//FIM CONSTRUTOR
 

  ngOnInit(){
  //CHAMANDO DADOS DO USUARIO
   this.http.get('usuario/1')
   .subscribe(data =>{
     this.usuario = data;
     console.log(this.usuario);
   })

   this.editar_id = '';
    //SETANDO VALOR DO PRODUTO EM VARIAVEL DO PROVIDER
    let loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loading.present();
    if(this.codigo == undefined){
      this.valor_total = this.vlr_total;
      this.quant = this.qtd;
      loading.dismiss();
    }else{
    this.http.get('pagseguro/'+this.codigo)   
     .subscribe(data => {
      this.produto = data;
      console.log(this.produto);  
      // this.valor_produto = this.produto.preco_produto;
      this.valor_total = this.produto.preco_produto; 
           
      loading.dismiss();
     
      });
    }
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
        if(this.produto.nome_produto == undefined){
          this.produto.nome_produto = 'Total'
        }
       
        let details = new PayPalPaymentDetails(this.valor_total+'.00', '0.00', '0.00'); //especializar
        let payment = new PayPalPayment(this.valor_total, 'BRL', this.produto.nome_produto, 'Sale', details); //especializar
        this.payPal.renderSinglePaymentUI(payment).then((response) =>{
        //resposta para caso pagamento seja efetuado com sucesso
         this.quantidade();         
         this.clearSacola();
         this.navCtrl.setRoot(ProdutosPage);
         this.alertaCompraEfetuada();

        }, () =>{
          //resposta para erro no pagamento
          console.log('erro ao redenrizar pagamento do paypal');
        })
      })
    })
  }

  quantidade(){ //melhorar
    let update ={
      quantidade_disponivel: this.produto.quantidade_disponivel - this.quant,
    }

    this.http.update('pagseguro/'+this.codigo, update)
      .subscribe(data => {
        // this.ngOnInit();
       
    });

  }

  //MELHORAR CHAMADA DE ITENS
  item(){
    let item = new PayPalItem(this.produto.nome_produto, this.quant, this.valor_total, 'BRL');
    console.log(item)
  }

  alertaCompraEfetuada() {
    let alert = this.alertCtrl.create({
      title: 'Olá, '+this.usuario.nome,
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
    //condição para caso o usuario esteja editando informações
    if(this.editar_id != ''){
      this.editar_id = '';
    }
    else if(this.pag == 'sacola'){
      this.navCtrl.setRoot(ProdutosPage);
    }
    else{
      this.div_dados = false;
      this.editar_id = '';
    }
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

  sedex(){
    let self = this;
    this.httpteste.get('http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdEmpresa=08082650&sDsSenha=564321&sCepOrigem=52010130&sCepDestino='+this.cep_5+this.cep_3+'&nVlPeso=1&nCdFormato=1&nVlComprimento=20&nVlAltura=20&nVlLargura=20&sCdMaoPropria=n&nVlValorDeclarado=0&sCdAvisoRecebimento=n&nCdServico=40010&nVlDiametro=0&StrRetorno=xml&nIndicaCalculo=3')
    .subscribe(data => {
     
       xml2js.parseString(data["_body"], function (err, result) {
        var valor = JSON.stringify(result.Servicos.cServico[0].Valor[0]).replace(/[</>],/g, '');
        valor = JSON.parse(valor);
        self.valor_resultado_sedex = valor;
        console.log(valor);

        var prazo =  JSON.stringify(result.Servicos.cServico[0].PrazoEntrega[0]).replace(/[</>],/g, '');
        prazo = JSON.parse(prazo)
        self.prazo_sedex = prazo;
        console.log(prazo);
       
      });
    
      this.fretes = true;
    });

  }

  calcularFretes(){
    
    console.log(this.cep_5, this.cep_3);
    let self = this;
    this.httpteste.get('http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdEmpresa=08082650&sDsSenha=564321&sCepOrigem=52010130&sCepDestino='+this.cep_5+this.cep_3+'&nVlPeso=1&nCdFormato=1&nVlComprimento=20&nVlAltura=20&nVlLargura=20&sCdMaoPropria=n&nVlValorDeclarado=0&sCdAvisoRecebimento=n&nCdServico=41106&nVlDiametro=0&StrRetorno=xml&nIndicaCalculo=3')
    .subscribe(data => {
      
       xml2js.parseString(data["_body"], function (err, result) {
        var valor = JSON.stringify(result.Servicos.cServico[0].Valor[0]).replace(/[</>],/g, '');
        valor = JSON.parse(valor);
        self.valor_resultado = valor;
        console.log(valor);

        var prazo =  JSON.stringify(result.Servicos.cServico[0].PrazoEntrega[0]).replace(/[</>],/g, '');
        prazo = JSON.parse(prazo)
        self.prazo = prazo;
        console.log(prazo);
       
      });
      this.sedex();
      this.fretes = true;

    });
   
  }

  editar(id) {
        
    if(id == 'dados_usuario'){
      this.editar_id = 'dados_usuario';
      console.log("CLICK EDICAO USUARIO");

    }else if(id == 'endereco_entrega'){
      this.editar_id = 'endereco_entrega';
      console.log("CLICK ENDERECO ENTREGA");
    }
 }

 salvar(){
   if(this.editar_id == 'dados_usuario'){
      let update ={
          nome: this.usuario.nome,
          endereco: this.usuario.endereco,
          email: this.usuario.email,
          telefone: this.usuario.telefone,
          sexo: this.usuario.sexo,
          cpf: this.usuario.cpf,
          nascimento: this.usuario.nascimento,
          bairro: this.usuario.bairro,
          cidade: this.usuario.cidade,
          cep: this.usuario.cep,
      }

      this.http.update('usuario/1', update)
        .subscribe(data => {
          this.editar_id = '';
          this.presentToast("Dados editados com sucesso.")
          // this.ngOnInit();
        
      });
  }else if(this.editar_id == 'endereco_entrega'){
    this.editar_id = '';
  }
 }

 adicionarSacola(codigo, nome, valor, qtd, valor_total){
    // valor = this.valor_produto;
    qtd = this.quant;
    valor_total = this.valor_total;
    this.sacola = localStorage.getItem("session");// Recupera os dados armazenados
    this.sacola = JSON.parse(this.sacola); // Converte string para objeto
    if(this.sacola == null) // Caso não haja conteúdo, iniciamos um vetor vazio
    this.sacola = [];
    this.add(codigo, nome, valor, qtd, valor_total);
 }

 add(codigo, nome, valor, qtd, valor_total){
    // valor = this.valor_produto;
    qtd = this.quant;
    valor_total = this.valor_total;
    this.sacola.push({codigo: codigo, nome: nome, valor: valor, qtd: qtd, valor_total: valor_total});
    localStorage.setItem("session", JSON.stringify(this.sacola));
    this.presentToast(this.produto.nome_produto+ ", adicionado a sua sacola.")
    return true;
 }

 clearSacola(){
  localStorage.removeItem("session");
 }
  
  ///ENVIO DE E-MAIL APÃÂS COMPRA REALIZADA COM SUCESSO
  
 
 
}
