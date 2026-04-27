---
layout: archive
title: "Survey"
permalink: /survey/
author_profile: false
hide_title: true
---

{% include base_path %}

<div class="survey-page">

<div class="survey-lang-toggle">
  <button class="survey-lang-btn active" id="btn-pt" onclick="setLang('pt')">Portugues</button>
  <button class="survey-lang-btn" id="btn-en" onclick="setLang('en')">English</button>
</div>

<div class="survey-hero">
  <h1 class="survey-hero__title">Entrega de Produtos Portugueses <span role="img">&#x1F1F5;&#x1F1F9;</span></h1>
  <p class="survey-hero__subtitle" data-lang="pt">
    Gostaríamos de criar uma caixa com produtos portugueses — vinho, azeite, mel, queijo e mais — entregue à tua porta. Mas antes de avançar, precisamos de perceber se faz sentido para ti e se a logística (envios, custos, etc.) é viável. A tua opinião vai ajudar-nos a decidir se este projeto pode funcionar.
  </p>
  <p class="survey-hero__subtitle" data-lang="en" style="display:none;">
    We'd like to create a box of Portuguese products — wine, olive oil, honey, cheese & more — delivered to your door. But before we move forward, we need to understand if this makes sense for you and if the logistics (shipping, costs, etc.) are viable. Your feedback will help us decide if this project can work.
  </p>
  <p class="survey-hero__time" data-lang="pt">Demora menos de 3 minutos</p>
  <p class="survey-hero__time" data-lang="en" style="display:none;">Takes under 3 minutes</p>
</div>

<form class="survey-form" id="survey-form">

  <!-- Section 1: Interest gate -->
  <fieldset class="survey-section">
    <legend class="survey-section__title">
      <span data-lang="pt">Interesse</span>
      <span data-lang="en" style="display:none;">Interest</span>
    </legend>

    <div class="survey-field">
      <label class="survey-label" data-lang="pt">Terias interesse em receber produtos portugueses (vinho, azeite, mel, queijo, etc.) entregues em tua casa? <span class="required">*</span></label>
      <label class="survey-label" data-lang="en" style="display:none;">Would you be interested in receiving Portuguese products (wine, olive oil, honey, cheese, etc.) delivered to your home? <span class="required">*</span></label>
      <div class="survey-options">
        <label class="survey-radio"><input type="radio" name="interest" value="yes" required> <span data-lang="pt">Sim</span><span data-lang="en" style="display:none;">Yes</span></label>
        <label class="survey-radio"><input type="radio" name="interest" value="maybe"> <span data-lang="pt">Talvez</span><span data-lang="en" style="display:none;">Maybe</span></label>
        <label class="survey-radio"><input type="radio" name="interest" value="no"> <span data-lang="pt">Não</span><span data-lang="en" style="display:none;">No</span></label>
      </div>
    </div>
  </fieldset>

  <!-- Everything below is hidden until interest is yes/maybe -->
  <div id="survey-details" style="display:none;">

  <!-- Section 2: About You -->
  <fieldset class="survey-section">
    <legend class="survey-section__title">
      <span data-lang="pt">Sobre Ti</span>
      <span data-lang="en" style="display:none;">About You</span>
    </legend>

    <div class="survey-field">
      <label class="survey-label" data-lang="pt">Em que país vives? <span class="required">*</span></label>
      <label class="survey-label" data-lang="en" style="display:none;">What country do you live in? <span class="required">*</span></label>
      <input type="text" name="country" class="survey-input" placeholder="e.g. France, Switzerland, UK...">
    </div>

    <div class="survey-field">
      <label class="survey-label" data-lang="pt">Qual a tua ligação a Portugal? <span class="required">*</span></label>
      <label class="survey-label" data-lang="en" style="display:none;">What's your connection to Portugal? <span class="required">*</span></label>
      <div class="survey-options">
        <label class="survey-radio"><input type="radio" name="connection" value="portuguese"> <span data-lang="pt">Sou português(a)</span><span data-lang="en" style="display:none;">I'm Portuguese</span></label>
        <label class="survey-radio"><input type="radio" name="connection" value="family"> <span data-lang="pt">Parceiro(a)/família portuguesa</span><span data-lang="en" style="display:none;">Partner/family is Portuguese</span></label>
        <label class="survey-radio"><input type="radio" name="connection" value="visited"> <span data-lang="pt">Visitei Portugal</span><span data-lang="en" style="display:none;">I visited Portugal</span></label>
        <label class="survey-radio"><input type="radio" name="connection" value="none"> <span data-lang="pt">Sem ligação</span><span data-lang="en" style="display:none;">No connection</span></label>
      </div>
    </div>

    <div class="survey-field">
      <label class="survey-label" data-lang="pt">Idade <span class="required">*</span></label>
      <label class="survey-label" data-lang="en" style="display:none;">Age <span class="required">*</span></label>
      <div class="survey-options survey-options--inline">
        <label class="survey-radio"><input type="radio" name="age" value="18-25"> 18-25</label>
        <label class="survey-radio"><input type="radio" name="age" value="26-35"> 26-35</label>
        <label class="survey-radio"><input type="radio" name="age" value="36-50"> 36-50</label>
        <label class="survey-radio"><input type="radio" name="age" value="50+"> 50+</label>
      </div>
    </div>
  </fieldset>

  <!-- Section 3: Products & Format -->
  <fieldset class="survey-section">
    <legend class="survey-section__title">
      <span data-lang="pt">Produtos e Formato</span>
      <span data-lang="en" style="display:none;">Products & Format</span>
    </legend>

    <div class="survey-field">
      <label class="survey-label" data-lang="pt">Que produtos te interessam mais? <span class="survey-hint">(escolhe vários)</span></label>
      <label class="survey-label" data-lang="en" style="display:none;">What products interest you most? <span class="survey-hint">(select multiple)</span></label>
      <div class="survey-options survey-options--grid">
        <label class="survey-checkbox"><input type="checkbox" name="products" value="vinhos"> <span data-lang="pt">Vinhos e licores</span><span data-lang="en" style="display:none;">Wines & liqueurs</span></label>
        <label class="survey-checkbox"><input type="checkbox" name="products" value="enchidos"> <span data-lang="pt">Enchidos e queijos</span><span data-lang="en" style="display:none;">Cured meats & cheeses</span></label>
        <label class="survey-checkbox"><input type="checkbox" name="products" value="conservas"> <span data-lang="pt">Conservas e enlatados</span><span data-lang="en" style="display:none;">Canned fish & preserves</span></label>
        <label class="survey-checkbox"><input type="checkbox" name="products" value="doces"> <span data-lang="pt">Doces e pastelaria</span><span data-lang="en" style="display:none;">Sweets & pastries</span></label>
        <label class="survey-checkbox"><input type="checkbox" name="products" value="azeites"> <span data-lang="pt">Azeites, mel e compotas</span><span data-lang="en" style="display:none;">Olive oils, honey & jams</span></label>
        <label class="survey-checkbox"><input type="checkbox" name="products" value="other"> <span data-lang="pt">Outras (artesanato, etc.)</span><span data-lang="en" style="display:none;">Other (crafts, etc.)</span></label>
      </div>
    </div>

    <div class="survey-field">
      <label class="survey-label" data-lang="pt">Como preferes comprar? <span class="required">*</span></label>
      <label class="survey-label" data-lang="en" style="display:none;">How would you prefer to buy? <span class="required">*</span></label>
      <div class="survey-options">
        <label class="survey-radio"><input type="radio" name="purchase_type" value="subscription"> <span data-lang="pt">Subscrição regular</span><span data-lang="en" style="display:none;">Regular subscription</span></label>
        <label class="survey-radio"><input type="radio" name="purchase_type" value="one-time"> <span data-lang="pt">Compra única (sem compromisso)</span><span data-lang="en" style="display:none;">One-time purchase (no commitment)</span></label>
        <label class="survey-radio"><input type="radio" name="purchase_type" value="both"> <span data-lang="pt">Ambas as opções</span><span data-lang="en" style="display:none;">Both options available</span></label>
        <label class="survey-radio"><input type="radio" name="purchase_type" value="gift"> <span data-lang="pt">Como presente para alguém</span><span data-lang="en" style="display:none;">As a gift for someone</span></label>
      </div>
    </div>

    <div class="survey-field" id="frequency-field" style="display:none;">
      <label class="survey-label" data-lang="pt">Se subscrição, com que frequência?</label>
      <label class="survey-label" data-lang="en" style="display:none;">If subscription, how often?</label>
      <div class="survey-options">
        <label class="survey-radio"><input type="radio" name="frequency" value="monthly"> <span data-lang="pt">Mensal</span><span data-lang="en" style="display:none;">Monthly</span></label>
        <label class="survey-radio"><input type="radio" name="frequency" value="bimonthly"> <span data-lang="pt">A cada 2 meses</span><span data-lang="en" style="display:none;">Every 2 months</span></label>
        <label class="survey-radio"><input type="radio" name="frequency" value="quarterly"> <span data-lang="pt">Trimestral</span><span data-lang="en" style="display:none;">Quarterly</span></label>
      </div>
    </div>
  </fieldset>

  <!-- Section 4: Pricing & Value -->
  <fieldset class="survey-section">
    <legend class="survey-section__title">
      <span data-lang="pt">Preço e Valor</span>
      <span data-lang="en" style="display:none;">Pricing & Value</span>
    </legend>

    <div class="survey-field">
      <label class="survey-label" data-lang="pt" style="margin-bottom: 0.75rem;">Imagine uma caixa com estes produtos:</label>
      <label class="survey-label" data-lang="en" style="display:none; margin-bottom: 0.75rem;">Imagine a box with these products:</label>
      <div class="survey-box-example" data-lang="pt">
        1 garrafa de vinho regional<br>
        1 azeite artesanal (250ml)<br>
        1 mel ou compota local<br>
        1 queijo ou enchido<br>
        2 conservas<br>
        1 doce tradicional (pastel de nata, queijada, etc.)
      </div>
      <div class="survey-box-example" data-lang="en" style="display:none;">
        1 regional wine bottle<br>
        1 artisanal olive oil (250ml)<br>
        1 local honey or jam<br>
        1 cheese or cured meat<br>
        2 canned fish<br>
        1 traditional sweet (pastel de nata, queijada, etc.)
      </div>
    </div>

    <div class="survey-field">
      <label class="survey-label" data-lang="pt">Quanto pagarias por estes produtos (sem portes)? <span class="required">*</span></label>
      <label class="survey-label" data-lang="en" style="display:none;">How much would you pay for these products (without shipping)? <span class="required">*</span></label>
      <div class="survey-options">
        <label class="survey-radio"><input type="radio" name="box_price" value="20-30" required> 20-30€</label>
        <label class="survey-radio"><input type="radio" name="box_price" value="30-40"> 30-40€</label>
        <label class="survey-radio"><input type="radio" name="box_price" value="40-50"> 40-50€</label>
        <label class="survey-radio"><input type="radio" name="box_price" value="50+"> 50€+</label>
      </div>
    </div>

    <div class="survey-field">
      <label class="survey-label" data-lang="pt">Qual o MÁXIMO que estarias disposto(a) a pagar no total (produtos + portes)? <span class="required">*</span></label>
      <label class="survey-label" data-lang="en" style="display:none;">What is the MAXIMUM you'd be willing to pay in total (products + shipping)? <span class="required">*</span></label>
      <div class="survey-options">
        <label class="survey-radio"><input type="radio" name="max_total" value="30" required> 30€</label>
        <label class="survey-radio"><input type="radio" name="max_total" value="40"> 40€</label>
        <label class="survey-radio"><input type="radio" name="max_total" value="50"> 50€</label>
        <label class="survey-radio"><input type="radio" name="max_total" value="60"> 60€</label>
        <label class="survey-radio"><input type="radio" name="max_total" value="70"> 70€</label>
        <label class="survey-radio"><input type="radio" name="max_total" value="80+"> 80€+</label>
      </div>
    </div>

    <div class="survey-field">
      <label class="survey-label" data-lang="pt">Um dos nossos maiores desafios é o custo dos portes. Quanto estarias disposto(a) a pagar EXTRA pelo envio? <span class="required">*</span></label>
      <label class="survey-label" data-lang="en" style="display:none;">One of our biggest challenges is shipping costs. How much extra would you pay for delivery? <span class="required">*</span></label>
      <div class="survey-options">
        <label class="survey-radio"><input type="radio" name="shipping_willing" value="0" required> <span data-lang="pt">Nada, só compraria com portes grátis</span><span data-lang="en" style="display:none;">Nothing, only with free shipping</span></label>
        <label class="survey-radio"><input type="radio" name="shipping_willing" value="5-10"> 5-10€</label>
        <label class="survey-radio"><input type="radio" name="shipping_willing" value="10-15"> 10-15€</label>
        <label class="survey-radio"><input type="radio" name="shipping_willing" value="15-20"> 15-20€</label>
        <label class="survey-radio"><input type="radio" name="shipping_willing" value="20+"> <span data-lang="pt">20€+ (se os produtos valerem a pena)</span><span data-lang="en" style="display:none;">20€+ (if the products are worth it)</span></label>
      </div>
    </div>

    <div class="survey-field">
      <label class="survey-label" data-lang="pt">Preferes uma caixa mais pequena e barata ou maior e completa?</label>
      <label class="survey-label" data-lang="en" style="display:none;">Do you prefer a smaller cheaper box or a bigger complete one?</label>
      <div class="survey-options">
        <label class="survey-radio"><input type="radio" name="box_size" value="small"> <span data-lang="pt">Pequena (~3 produtos)</span><span data-lang="en" style="display:none;">Small (~3 products)</span></label>
        <label class="survey-radio"><input type="radio" name="box_size" value="medium"> <span data-lang="pt">Média (~5 produtos)</span><span data-lang="en" style="display:none;">Medium (~5 products)</span></label>
        <label class="survey-radio"><input type="radio" name="box_size" value="large"> <span data-lang="pt">Grande (~7 produtos)</span><span data-lang="en" style="display:none;">Large (~7 products)</span></label>
        <label class="survey-radio"><input type="radio" name="box_size" value="choice"> <span data-lang="pt">Quero poder escolher</span><span data-lang="en" style="display:none;">I'd like to choose</span></label>
      </div>
    </div>

    <div class="survey-field">
      <label class="survey-label" data-lang="pt">O que te faria NÃO comprar? <span class="survey-hint">(escolhe vários)</span></label>
      <label class="survey-label" data-lang="en" style="display:none;">What would make you NOT buy? <span class="survey-hint">(select multiple)</span></label>
      <div class="survey-options">
        <label class="survey-checkbox"><input type="checkbox" name="blockers" value="expensive"> <span data-lang="pt">Demasiado caro</span><span data-lang="en" style="display:none;">Too expensive</span></label>
        <label class="survey-checkbox"><input type="checkbox" name="blockers" value="quality"> <span data-lang="pt">Não confio na qualidade</span><span data-lang="en" style="display:none;">Don't trust quality</span></label>
        <label class="survey-checkbox"><input type="checkbox" name="blockers" value="visit"> <span data-lang="pt">Prefiro comprar quando visito Portugal</span><span data-lang="en" style="display:none;">Prefer to buy when visiting Portugal</span></label>
        <label class="survey-checkbox"><input type="checkbox" name="blockers" value="shipping"> <span data-lang="pt">Portes demasiado caros</span><span data-lang="en" style="display:none;">Shipping too expensive</span></label>
        <label class="survey-checkbox"><input type="checkbox" name="blockers" value="perishable"> <span data-lang="pt">Preocupação com produtos perecíveis</span><span data-lang="en" style="display:none;">Worried about perishable products</span></label>
        <label class="survey-checkbox"><input type="checkbox" name="blockers" value="other"> <span data-lang="pt">Outro</span><span data-lang="en" style="display:none;">Other</span></label>
      </div>
    </div>
  </fieldset>

  <!-- Section 5: Logistics -->
  <fieldset class="survey-section">
    <legend class="survey-section__title">
      <span data-lang="pt">Logística</span>
      <span data-lang="en" style="display:none;">Logistics</span>
    </legend>

    <div class="survey-field">
      <label class="survey-label" data-lang="pt">Tens dificuldade em encontrar produtos portugueses onde vives?</label>
      <label class="survey-label" data-lang="en" style="display:none;">Do you have difficulty finding Portuguese products where you live?</label>
      <div class="survey-options survey-options--inline">
        <label class="survey-radio"><input type="radio" name="difficulty" value="yes"> <span data-lang="pt">Sim</span><span data-lang="en" style="display:none;">Yes</span></label>
        <label class="survey-radio"><input type="radio" name="difficulty" value="some"> <span data-lang="pt">Alguns</span><span data-lang="en" style="display:none;">Some things</span></label>
        <label class="survey-radio"><input type="radio" name="difficulty" value="no"> <span data-lang="pt">Não</span><span data-lang="en" style="display:none;">No</span></label>
      </div>
    </div>

    <div class="survey-field">
      <label class="survey-label" data-lang="pt">Onde compras atualmente produtos portugueses? <span class="survey-hint">(escolhe vários)</span></label>
      <label class="survey-label" data-lang="en" style="display:none;">Where do you currently buy Portuguese products? <span class="survey-hint">(select multiple)</span></label>
      <div class="survey-options">
        <label class="survey-checkbox"><input type="checkbox" name="current_source" value="shops"> <span data-lang="pt">Lojas portuguesas no estrangeiro</span><span data-lang="en" style="display:none;">Portuguese shops abroad</span></label>
        <label class="survey-checkbox"><input type="checkbox" name="current_source" value="online"> Online</label>
        <label class="survey-checkbox"><input type="checkbox" name="current_source" value="family"> <span data-lang="pt">A família envia</span><span data-lang="en" style="display:none;">Family sends them</span></label>
        <label class="survey-checkbox"><input type="checkbox" name="current_source" value="none"> <span data-lang="pt">Não compro</span><span data-lang="en" style="display:none;">I don't</span></label>
      </div>
    </div>
  </fieldset>

  <!-- Section 6: Final -->
  <fieldset class="survey-section">
    <legend class="survey-section__title">
      <span data-lang="pt">Para Terminar</span>
      <span data-lang="en" style="display:none;">Final</span>
    </legend>

    <div class="survey-field">
      <label class="survey-label" data-lang="pt">Que produto gostarias MAIS de ver na primeira caixa?</label>
      <label class="survey-label" data-lang="en" style="display:none;">What product would you MOST want in the first box?</label>
      <textarea name="first_product" class="survey-textarea" rows="2" placeholder="e.g. Vinho do Douro, Queijo da Serra..."></textarea>
    </div>

    <div class="survey-field">
      <label class="survey-label" data-lang="pt">Deixa o teu email para acesso antecipado (opcional)</label>
      <label class="survey-label" data-lang="en" style="display:none;">Leave your email for early access (optional)</label>
      <input type="email" name="email" class="survey-input" placeholder="seu@email.com">
    </div>
  </fieldset>

  </div><!-- end survey-details -->

  <button type="submit" class="survey-submit">
    <span data-lang="pt">Enviar</span>
    <span data-lang="en" style="display:none;">Submit</span>
  </button>
</form>

<div class="survey-thanks" id="survey-thanks" style="display:none;">
  <h2 data-lang="pt">Obrigado!</h2>
  <h2 data-lang="en" style="display:none;">Thank you!</h2>
  <p data-lang="pt">A tua resposta foi registada e vai ajudar-nos a perceber se este projeto é viável. Se deixaste o teu email, entraremos em contacto se avançarmos!</p>
  <p data-lang="en" style="display:none;">Your response has been recorded and will help us understand if this project is viable. If you left your email, we'll reach out if we move forward!</p>
</div>

</div>

<style>
.survey-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 1rem;
}

.survey-lang-toggle {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.survey-lang-btn {
  padding: 0.5rem 1.5rem;
  border: 2px solid #ddd;
  border-radius: 25px;
  background: transparent;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.survey-lang-btn.active {
  background: #27ae60;
  color: #fff;
  border-color: #27ae60;
}

.survey-lang-btn:not(.active):hover {
  border-color: #27ae60;
  color: #27ae60;
}

[data-theme="dark"] .survey-lang-btn {
  border-color: #444;
  color: #ccc;
}

[data-theme="dark"] .survey-lang-btn.active {
  background: #27ae60;
  color: #fff;
  border-color: #27ae60;
}

.survey-hero {
  text-align: center;
  margin-bottom: 2.5rem;
}

.survey-hero__title {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.survey-hero__subtitle {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
}

[data-theme="dark"] .survey-hero__subtitle,
[data-theme="dark"] .survey-hint {
  color: #aab;
}

.survey-hero__time {
  font-size: 0.9rem;
  color: #888;
  margin-top: 0.5rem;
}

.survey-section {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: #fafafa;
}

[data-theme="dark"] .survey-section {
  border-color: #333;
  background: #1a1a2e;
}

.survey-section__title {
  font-size: 1.2rem;
  font-weight: 600;
  padding: 0 0.5rem;
}

.survey-field {
  margin-bottom: 1.25rem;
}

.survey-field:last-child {
  margin-bottom: 0;
}

.survey-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.required {
  color: #e74c3c;
}

.survey-hint {
  font-weight: 400;
  font-size: 0.85rem;
  color: #777;
}

.survey-input,
.survey-textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
}

[data-theme="dark"] .survey-input,
[data-theme="dark"] .survey-textarea {
  background: #0b1a2e;
  border-color: #444;
  color: #e0e0e0;
}

.survey-input:focus,
.survey-textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
}

.survey-options {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.survey-options--inline {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
}

.survey-options--grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
}

.survey-radio,
.survey-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0;
  cursor: pointer;
  font-size: 0.95rem;
}

.survey-radio input,
.survey-checkbox input {
  margin: 0;
  cursor: pointer;
}

.survey-submit {
  display: block;
  width: 100%;
  padding: 0.9rem;
  background: #27ae60;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.survey-submit:hover {
  background: #219a52;
}

.survey-thanks {
  text-align: center;
  padding: 3rem 1rem;
}

.survey-thanks h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.survey-box-example {
  background: #f0f7f0;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  line-height: 1.8;
  font-size: 0.95rem;
}

[data-theme="dark"] .survey-box-example {
  background: #1a2e1a;
  border-color: #2e4a2e;
}

@media (max-width: 500px) {
  .survey-options--grid {
    grid-template-columns: 1fr;
  }
  .survey-hero__title {
    font-size: 1.5rem;
  }
}
</style>

<script>
var GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxA67wD1nzifeICtUC5G7-WSkmPUIjrLm03_tBFfJWfMvKn6XNmBG07iTxtdIRPB78wnw/exec';

// Language toggle
var currentLang = 'pt';

function setLang(lang) {
  currentLang = lang;
  var allPt = document.querySelectorAll('[data-lang="pt"]');
  var allEn = document.querySelectorAll('[data-lang="en"]');

  if (lang === 'pt') {
    allPt.forEach(function(el) { el.style.display = ''; });
    allEn.forEach(function(el) { el.style.display = 'none'; });
    document.getElementById('btn-pt').classList.add('active');
    document.getElementById('btn-en').classList.remove('active');
  } else {
    allPt.forEach(function(el) { el.style.display = 'none'; });
    allEn.forEach(function(el) { el.style.display = ''; });
    document.getElementById('btn-en').classList.add('active');
    document.getElementById('btn-pt').classList.remove('active');
  }
}

// Show/hide rest of survey based on interest
var interestRadios = document.querySelectorAll('input[name="interest"]');
var detailsDiv = document.getElementById('survey-details');

interestRadios.forEach(function(radio) {
  radio.addEventListener('change', function() {
    if (this.value === 'yes' || this.value === 'maybe') {
      detailsDiv.style.display = 'block';
    } else {
      detailsDiv.style.display = 'none';
    }
  });
});

// Show frequency only when subscription is selected
var purchaseRadios = document.querySelectorAll('input[name="purchase_type"]');
var frequencyField = document.getElementById('frequency-field');

purchaseRadios.forEach(function(radio) {
  radio.addEventListener('change', function() {
    if (this.value === 'subscription' || this.value === 'both') {
      frequencyField.style.display = 'block';
    } else {
      frequencyField.style.display = 'none';
    }
  });
});

// Submit
document.getElementById('survey-form').addEventListener('submit', function(e) {
  e.preventDefault();

  var form = e.target;
  var submitBtn = form.querySelector('.survey-submit');
  var ptSpan = submitBtn.querySelector('[data-lang="pt"]');
  var enSpan = submitBtn.querySelector('[data-lang="en"]');
  if (ptSpan) ptSpan.textContent = 'A enviar...';
  if (enSpan) enSpan.textContent = 'Sending...';
  submitBtn.disabled = true;

  var data = new FormData(form);
  var response = {};

  var entries = data.entries();
  var entry = entries.next();
  while (!entry.done) {
    var key = entry.value[0];
    var val = entry.value[1];
    if (response[key]) {
      if (Array.isArray(response[key])) {
        response[key].push(val);
      } else {
        response[key] = [response[key], val];
      }
    } else {
      response[key] = val;
    }
    entry = entries.next();
  }

  var flat = {};
  for (var k in response) {
    flat[k] = Array.isArray(response[k]) ? response[k].join(', ') : response[k];
  }
  flat.timestamp = new Date().toISOString();
  flat.language = currentLang;

  fetch(GOOGLE_SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(flat)
  }).then(function() {
    form.style.display = 'none';
    document.getElementById('survey-thanks').style.display = 'block';
  }).catch(function() {
    var responses = JSON.parse(localStorage.getItem('survey_responses') || '[]');
    responses.push(flat);
    localStorage.setItem('survey_responses', JSON.stringify(responses));
    form.style.display = 'none';
    document.getElementById('survey-thanks').style.display = 'block';
  });
});
</script>
