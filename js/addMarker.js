AFRAME.registerComponent("add-marker",{
    init:async function(){
        var mainScene = document.querySelector("#main-scene");
        
        var toys = await this.getToysData()

        console.log("got data")
        toys.map(toy => {
            var marker = document.createElement("a-marker")
            marker.setAttribute("id",toy.id)
            marker.setAttribute("url",toy.marker_pattern_url)
            marker.setAttribute("type","pattern")
            marker.setAttribute("cursor",{
                rayOrigin:"mouse"
            })
            marker.setAttribute("handle-marker",{})
            mainScene.appendChild(marker)
            console.log("marker created")

            var model = document.createElement("a-entity")
            model.setAttribute("id",`model-${toy.id}`)
            model.setAttribute("gltf-model",`url(${toy.model_url})`)
            model.setAttribute("position",toy.model_geometry.position)
            model.setAttribute("rotation",toy.model_geometry.rotation)
            model.setAttribute("scale",toy.model_geometry.scale)
            model.setAttribute("gesture_handler",{})
            model.setAttribute("visible",false)
            marker.appendChild(model)
            console.log("model created")

            var desPlain = document.createElement("a-plane")
            desPlain.setAttribute("id",`main-plain-${toy.id}`)
            desPlain.setAttribute("height",2)
            desPlain.setAttribute("width",2)
            desPlain.setAttribute("position",{x:0,y:0,z:0})
            desPlain.setAttribute("rotation",{x:-90,y:0,z:0})
            desPlain.setAttribute("visible",false)
            marker.appendChild(desPlain)

            var titlePlane = document.createElement("a-plane")
            titlePlane.setAttribute("id",`title-plain-${toy.id}`)
            titlePlane.setAttribute("position",{x:0,y:1,z:0})
            titlePlane.setAttribute("height",0.5)
            titlePlane.setAttribute("width",2)
            desPlain.appendChild(titlePlane)

            var title = document.createElement("a-entity")
            title.setAttribute("id",`title-${toy.id}`)
            title.setAttribute("position",{x:0,y:0,z:0})
            title.setAttribute("text",{
                value:toy.name.toUpperCase(),
                width:2,
                height:0.3,
                align:"center",
                color:"black"
            })
            titlePlane.appendChild(title)

            var info = document.createElement("a-entity")
            info.setAttribute("id",`info-${toy.id}`)
            info.setAttribute("position",{x:0,y:0,z:0})
            info.setAttribute("text",{
                value:` ${toy.description}\n ${toy.age_group}`,
                color:"black",
                width:2,
                align:"left"
            })
            desPlain.appendChild(info)
            console.log("Plain created")
        })
    },
    getToysData:async function(){
        return await firebase
        .firestore()
        .collection("toys")
        .get()
        .then(snap=>{
            return snap.docs.map(doc => doc.data())
        })
    }
})