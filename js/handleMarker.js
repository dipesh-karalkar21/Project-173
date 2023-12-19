AFRAME.registerComponent("handle-marker",{
    init:async function(){
        var iconUrl = "https://raw.githubusercontent.com/dipesh-karalkar21/Project-169/main/logo-3d.png";
        var uid = ""
        swal({
            icon : iconUrl,
            title : "Welcome to Toy Store!!",
            content : {
            element : "input",
            attributes : {
                placeholder : "Enter UID",
                type : "string",
            },
            },
            closeOnClickOutside : false,
        }).then(userInput=>{
            uid = userInput
        })

        var toys = await this.getToys()
        
        this.el.addEventListener("markerFound",()=>{
            console.log("marker found")
            var markerId = this.el.id
            this.handleMarkerFound(toys,markerId,uid)
        })
        this.el.addEventListener("markerLost",()=>{
            console.log("marker lost")
            document.getElementById("button-div").style.display = "none"
        })
    },
    getToys:async function(){
        return await firebase
        .firestore()
        .collection("toys")
        .get()
        .then(snap=>{
            return snap.docs.map(doc => doc.data())
        })
    },
    handleMarkerFound: async function(toys,markerId,uid){
        var toy = toys.filter(toy => toy.id == markerId)[0]

        if(!toy.outOfStock){

            var model = document.querySelector(`#model-${toy.id}`)
            model.setAttribute("visible",true)
            var des = document.querySelector(`#main-plain-${toy.id}`)
            des.setAttribute("visible",true) 

            document.getElementById("button-div").style.display = "flex"

            button1 = document.getElementById("order-button")
            button2 = document.getElementById("order-summary-button")
            button3 = document.getElementById("order-rating-button")
            button1.addEventListener("click",()=>{
                this.handleOrder(uid,toy)
            })
            button2.addEventListener("click",()=>{
                this.handleSummary(uid)
            })
            button3.addEventListener("click",()=>{
                console.log("clicked")
                this.handleRating(toy)
            })
            var payButton = document.getElementById("pay-button");
            payButton.addEventListener("click", () => this.handlePayment(uid));
        }

    },
    handleRating:function(toy){
        document.getElementById("rating-modal-div").style.display = "flex";
        document.getElementById("rating-input").style.value = "0"

        var saveButton = document.getElementById("save-rating-button")
        saveButton.addEventListener("click",()=>{
            document.getElementById("rating-modal-div").style.display = "none";
            var ratings = document.getElementById("rating-input").value
            
            firebase.firestore().collection("toys").doc(toy.id).update({
                rating : ratings
            }).then(()=>{
                swal({
                    icon:"success",
                    title : "Thanks for Rating",
                    text : "We you like the toy",
                    timer : 2500,
                    buttons:false
                })
            })

        })
    },
    handlePayment: function (uid) {
        document.getElementById("modal-div").style.display = "none";
    
        firebase.firestore().collection("users").doc(uid).update({
          current_orders : {},
          total_bill : 0,
        }).then(()=>{
          swal({
            icon : "success",
            title : "Payment Successful",
            text : "Thanks for Visiting!",
            timer : 3000,
            buttons : false
          })
        }) 
      },
    handleOrder: function(uid,toy){
        firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then(snap=>{
            var detail = snap.data()

            if(detail["current_orders"][toy.id]){
                detail["current_orders"][toy.id]["quantity"] += 1
                detail["current_orders"][toy.id]["subtotal"] = (toy.price)*(detail["current_orders"][toy.id]["quantity"])
            }
            else{
                detail["current_orders"][toy.id] = {
                    item : toy.name,
                    price : toy.price,
                    subtotal : toy.price,
                    quantity : 1
                }
            }

            detail["total_bill"] += toy.price

            firebase.firestore().collection("users").doc(uid).update(detail).then(()=>{
                swal({
                    icon : "success",
                    title : "Thanks for order !!",
                    text : "Your order is placed."
                })
            })

        })
    },
    handleSummary: async function (uid) {
        var orderSummary = await this.getSummary(uid);
        
        console.log(orderSummary)

        var modalDiv = document.getElementById("modal-div");
        modalDiv.style.display = "flex";
    
        var tableBodyTag = document.getElementById("bill-table-body");
    
        tableBodyTag.innerHTML = "";
    
        var currentOrders = Object.keys(orderSummary.current_orders);
    
        currentOrders.map(i => {
    
          var tr = document.createElement("tr");
    
          var item = document.createElement("td");
          var price = document.createElement("td");
          var quantity = document.createElement("td");
          var subtotal = document.createElement("td");
    
          item.innerHTML = orderSummary.current_orders[i].item;
    
          price.innerHTML = "$" + orderSummary.current_orders[i].price;
          price.setAttribute("class", "text-center");
    
          quantity.innerHTML = orderSummary.current_orders[i].quantity;
          quantity.setAttribute("class", "text-center");
    
          subtotal.innerHTML = "$" + orderSummary.current_orders[i].subtotal;
          subtotal.setAttribute("class", "text-center");
    
          tr.appendChild(item);
          tr.appendChild(price);
          tr.appendChild(quantity);
          tr.appendChild(subtotal);
    
          tableBodyTag.appendChild(tr);
        });
    
        var totalTr = document.createElement("tr");
    
        var td1 = document.createElement("td");
        td1.setAttribute("class", "no-line");
    
        var td2 = document.createElement("td");
        td2.setAttribute("class", "no-line");
    
        var td3 = document.createElement("th");
        td3.setAttribute("class", "no-line");
        td3.innerHTML = "Total"
        
        var td4 = document.createElement("td");
        td4.setAttribute("class", "no-line");
        td4.innerHTML = "$" + orderSummary.total_bill
        
        
        totalTr.appendChild(td1);
        totalTr.appendChild(td2);
        totalTr.appendChild(td3);
        totalTr.appendChild(td4);
    
        tableBodyTag.appendChild(totalTr);
      },
      
      handlePayment: function (uid) {
        document.getElementById("modal-div").style.display = "none";
    
    
        firebase.firestore().collection("users").doc(uid).update({
          current_orders : {},
          total_bill : 0,
        }).then(()=>{
          swal({
            icon : "success",
            title : "Payment Successful",
            text : "Thanks for Visiting!",
            timer : 3000,
            buttons : false
          })
        }) 
      },
    getSummary:async function (uid){
        return await firebase.firestore().collection("users").doc(uid).get().then(doc=>doc.data())
    }
})