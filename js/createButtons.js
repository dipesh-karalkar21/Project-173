AFRAME.registerComponent("create-button", {
    init:function(){
        console.log("Function Called")
        var button1 = document.createElement("button");
        button1.innerHTML = "ORDER NOW";
        button1.setAttribute("id","order-button");
        button1.setAttribute("class","btn btn-danger ml-3 mr-3");
        console.log("btn 1 created")
        var button2 = document.createElement("button");
        button2.innerHTML = "ORDER SUMMARY"
        button2.setAttribute("id","order-summary-button");
        button2.setAttribute("class","btn btn-danger ml-3")
        console.log("btn 2 created")
        var button3 = document.createElement("button")
        button3.innerHTML = "RATE NOW"
        button3.setAttribute("id","order-rating-button");
        button3.setAttribute("class","btn btn-danger ml-3")
        console.log("btn 3 created")
        var buttonDiv = document.getElementById("button-div")
        buttonDiv.appendChild(button1)
        buttonDiv.appendChild(button2)
        buttonDiv.appendChild(button3)
        console.log("btn 1 and btn 2 appended")
    }
})