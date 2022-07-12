document.addEventListener("DOMContentLoaded", function () {
  let customerId;
  let orderId;
  let tokenizedCard;
  let cvv;

  saveCustomer.addEventListener("click", function () {
    let isValid;

    $(".customerForm").each(function () {
      isValid = true;
      let element = $(this);
      if (element.val() == "") {
        alert("preencha todos campos do cliente");
        return (isValid = false);
      }
    });
    if (isValid) {
      let token = $("#token").val();
      let firstname = $("#firstname").val();
      let lastname = $("#lastname").val();
      let email = $("#email").val();
      let telephone = $("#telephone").val();
      let postcode = $("#postcode").val();
      let address_street = $("#address_street").val();
      let address_street_number = $("#address_street_number").val();
      let address_street_complement = $("#address_street_complement").val();
      let address_city = $("#address_city").val();
      let address_state = $("#address_state").val();
      let address_street_district = $("#address_street_district").val();

      let jsonText = {
        firstname: "" + firstname + "",
        lastname: "" + lastname + "",
        email: "" + email + "",
        telephone: "" + telephone + "",
        postcode: "" + postcode + "",
        address_street: "" + address_street + "",
        address_street_number: "" + address_street_number + "",
        address_street_complement: "" + address_street_complement + "",
        address_street_district: "" + address_street_district + "",
        address_city: "" + address_city + "",
        address_state: "" + address_state + "",
        ip: "127.0.0.1",
        custom_txt: "Tênis de Corrida 39",
        products: [
          {
            product_sku: "123456",
            product_qty: 2,
          },
        ],
        tracking: {
          utm_source: "google",
          utm_campaign: "black-friday",
          utm_medium: "cpc",
          utm_content: "tenis-corrida",
          utm_term: "logo-link",
        },
      };

      var myJSON = JSON.stringify(jsonText);
      var myHEADER =
        "https://admin.appmax.com.br/api/v3/customer?access-token=" +
        token +
        "";
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          var res = JSON.parse(this.response);
          console.log(res);
          console.log(res.data.id);
          customerId = res.data.id;
          alert("customer criado. ID:" + customerId + "");
        }
      };

      xmlhttp.open("POST", myHEADER);
      xmlhttp.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );
      xmlhttp.send(myJSON);
      console.log("acabou");
    }
  });

  saveOrder.addEventListener("click", function () {
    if (!customerId) {
      alert("preencha o formulário de cliente");
    } else {
      $(".orderForm").each(function () {
        isValid = true;
        let element = $(this);
        if (element.val() == "") {
          alert("preencha todos os campos do cartão");
          return (isValid = false);
        }
      });
      if (isValid) {
        let token = $("#token").val();

        jsonText = {
          total: 750.0,
          products: [
            {
              sku: "123123",
              name: "My product 1",
              qty: 1,
            },
            {
              sku: "234234",
              name: "My product 2",
              qty: 2,
              digital_product: 1,
            },
          ],
          shipping: 39.9,
          customer_id: "" + customerId + "",
          discount: 0,
          freight_type: "PAC",
        };
        myJSON = JSON.stringify(jsonText);
        myHEADER =
          "https://admin.appmax.com.br/api/v3/order?access-token=" + token + "";
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.response);
            console.log(res);
            console.log(res.data.id);
            orderId = res.data.id;
            alert("order criada. Order id:" + orderId + "");
          }
        };

        xmlhttp.open("POST", myHEADER);
        xmlhttp.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
        xmlhttp.send(myJSON);
        console.log("acabou order");
      }
    }
  });

  tokenizeCard.addEventListener("click", function () {
    let name = $("#name").val();
    let number = $("#number").val();
    cvv = $("#cvv").val();
    let month = $("#month").val();
    let year = $("#year").val();
    token = $("#token").val();

    jsonText = {
      card: {
        name: "" + name + "",
        number: "" + number + "",
        cvv: "" + cvv + "",
        month: "" + month + "",
        year: "" + year + "",
      },
    };
    myJSON = JSON.stringify(jsonText);
    myHEADER =
      "https://admin.appmax.com.br/api/v3/tokenize/card?access-token=" +
      token +
      "";
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if ((this.readyState == 4 && this.status == 200) || this.status == 201) {
        var res = JSON.parse(this.response);
        console.log("tokenize");
        console.log(res);
        tokenizedCard = res.data.token;
        alert("cartão tokenizado. Token:" + tokenizedCard + "");
      } else {
        console.log("nao teve retorno do token");
      }
    };

    xmlhttp.open("POST", myHEADER);
    xmlhttp.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    xmlhttp.send(myJSON);
    console.log("acabou token");
  });
  payment.addEventListener("click", function () {
    token = $("#token").val();
    let document_number = $("#document_number");

    jsonText = {
      cart: {
        order_id: "" + orderId + "",
      },
      customer: {
        customer_id: "" + customerId + "",
      },
      payment: {
        CreditCard: {
          token: "" + tokenizedCard + "",
          document_number: "" + document_number + "",
          cvv: "" + cvv + "",
          installments: 12,
          soft_descriptor: "MYSTORE",
        },
      },
    };
    myJSON = JSON.stringify(jsonText);
    myHEADER =
      "https://admin.appmax.com.br/api/v3/payment/credit-card?access-token=" +
      token +
      "";
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if ((this.readyState == 4 && this.status == 200) || this.status == 201) {
        var res = JSON.parse(this.response);
        console.log("tokenize");
        console.log(res);
        let payment = res.data;
        alert("pagamento feito" + payment + "");
      } else {
        console.log("nao teve retorno do pagamento");
      }
    };

    xmlhttp.open("POST", myHEADER);
    xmlhttp.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    xmlhttp.send(myJSON);
    console.log("acabou pagamento");
  });
});
