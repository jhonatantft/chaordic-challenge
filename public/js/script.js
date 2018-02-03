
(function () {

  'use strict';

  var jsonp = '';
  var i = 0;
  var itemsPage = 4;
  var jsonpUrl = (function(){

    var object = {};

    object.has = function(src, selection) {

      var callback = selection.jsonpCallbackName || 'X',
        success = selection.ifSuccess || function(){},
        fail = selection.ifFail || function(){};

      var timeout = window.setTimeout(function(){
        window[callback] = function(){};
        fail();
      }, 10000);

      window[callback] = function(data){
        window.clearTimeout(timeout);
        success(data);
      };

      var script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      script.async = true;
      document.getElementsByTagName('head')[0].appendChild(script);
    };

    return object;
  })();

  function getJsonpResponse(response) {
    return jsonp = response;
  }

  function getJsonpReference() {
    return jsonp.data.reference.item;
  }

  function getJsonpRecommendation() {
    return jsonp.data.recommendation;
  }

  function render() {
    renderReferenceItem(getJsonpReference());
    renderRecommendationItem(getJsonpRecommendation());
  }

  function renderReferenceItem(jsonp) {

    document.querySelector('.item__name--span').innerHTML = jsonp.name;
    document.querySelector('.item__href').href = 'http:' + jsonp.detailUrl;
    document.querySelector('.item-reference__image').src = 'http:' + jsonp.imageName;
    document.querySelector('.item__price--old').innerHTML = 'De: ' + jsonp.oldPrice;
    document.querySelector('.item__price--new').innerHTML = 'Por: ' + '<strong style=\'font-size: 17px;\'>' + jsonp.price + '</strong>';
    document.querySelector('.item__payment-conditions').innerHTML = '<strong>' + jsonp.productInfo.paymentConditions.replace(".",",") + '</strong></br><span style=\'font-size: 10px\'>' + 'sem juros' + '</span>';
  }

  function renderRecommendationItem(jsonp){

    for( i; i < itemsPage; i++) {
      var div = document.getElementById('item-recommendation');
      var url = document.createElement('a');
      url.setAttribute('class', 'item__href');
      url.setAttribute('id', 'item-reference_' + i);
      url.setAttribute('href', 'http:' + jsonp[i].detailUrl);
      div.appendChild(url);

      var itemCol = document.createElement('div');
      itemCol.setAttribute('class', 'item ' + 'item-reference ' + 'col');
      url.appendChild(itemCol);

      var imageBox = document.createElement('div');
      imageBox.setAttribute('class', 'item__image--box');
      itemCol.appendChild(imageBox);

      var image = document.createElement('img');
      image.setAttribute('class', 'item__image--box');
      image.setAttribute('src', 'http:' + jsonp[i].imageName);
      imageBox.appendChild(image);

      var name = document.createElement('div');
      name.setAttribute('class', 'item__name');
      itemCol.appendChild(name);

      var nameSpan = document.createElement('div');
      nameSpan.setAttribute('class', 'item__name--span');
      nameSpan.appendChild(document.createTextNode(jsonp[i].name));
      name.appendChild(nameSpan);

      var price = document.createElement('div');
      price.setAttribute('class', 'item-reference__price');
      itemCol.appendChild(price);

      var oldPrice = document.createElement('div');
      oldPrice.setAttribute('class', 'item__price--old ' + 'price-tag');
      if (jsonp[i].oldPrice) {
        oldPrice.appendChild(document.createTextNode('De: ' + jsonp[i].oldPrice));
        price.appendChild(oldPrice);
      }

      var newPrice = document.createElement('div');
      newPrice.setAttribute('class', 'item__price--new ' + 'price-tag');
      newPrice.innerHTML = 'Por: ' + '<strong style=\'font-size: 17px;\'>' + jsonp[i].price + '</strong>';
      // newPrice.appendChild(document.createTextNode('Por: ' + jsonp[i].price));
      price.appendChild(newPrice);

      var payment = document.createElement('div');
      payment.setAttribute('class', 'item__payment-conditions ' + 'price-tag');
      payment.innerHTML = '<strong>' + jsonp[i].productInfo.paymentConditions.replace(".", ",") + "</strong></br><span style='font-size: 10px'>" + "sem juros" + "</span>";
      price.appendChild(payment);
    }
  }

  document.getElementById('next').addEventListener('click', function () {
    if (i <= 9) {
      var element = document.getElementById('item-reference_' + (i - 4));
      element.setAttribute('style', 'display: none');
      itemsPage++;
      var first = document.getElementById('item-reference_' + (i - 1));
      first.setAttribute('style', 'display: initial');
      renderRecommendationItem(getJsonpRecommendation())
    }
  });

  document.getElementById('prev').addEventListener('click', function () {

    i = 0;
    itemsPage = 4;
    var elem = document.getElementById('item-recommendation');
    elem.parentNode.removeChild(elem);

    var div = document.createElement('div');
    div.setAttribute('class', 'item-recommendation');
    div.setAttribute('id', 'item-recommendation');

    var wrap = document.getElementById('wrap-item-recommendation');
    var wrapDiv = wrap.getElementsByTagName('div')[0];
    wrapDiv.appendChild(div);
    renderRecommendationItem(getJsonpRecommendation())
  });

  jsonpUrl.has('https://goo.gl/bfpzSC', {
    jsonpCallbackName: 'X',
    ifSuccess: function(response){
      getJsonpResponse(response);
      render();
    },

    ifFail: function(){
      console.log('There is a problem!');
    },

    timeout: 5
  });
})();

