//add mesh
// source = 
const config = require("./config.json")
var source = config.source
/*
function addSphere(){
    var sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
    sphereMaterial.diffuseTexture = new BABYLON.Texture("textures/wood.jpg", scene);

    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:50}, scene);
    sphere.material = sphereMaterial;
    sphere.position = new BABYLON.Vector3(0,15,100);
    console.log(sphere.position)

    var meshTask = assetsManager.addMeshTask("Sphere","", `${source}/mesh/Sphere/`, "Sphere.obj");
    meshTask.onSuccess = function (task) {
        let Sphere = BABYLON.Mesh.MergeMeshes(task.loadedMeshes, true, true)
        Sphere.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
        Sphere.state = "Sphere"
        Sphere.position = position
    }
}*/
function addRadar(assetsManager, position, rotation = 0.7) {
    var meshTask = assetsManager.addMeshTask("radar", "", `${source}/mesh/radar/`, "rada.obj");
    meshTask.onSuccess = function (task) {
        let radar = BABYLON.Mesh.MergeMeshes(task.loadedMeshes, true, true)
        radar.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
        radar.rotation = new BABYLON.Vector3(0, Math.PI * rotation, 0)
        radar.state = "radar"
        radar.position = position
    }
}

function addA380(assetsManager) {
    var meshTask = assetsManager.addMeshTask("a380", "", `${source}/mesh/a380/`, "a380.obj");
    meshTask.onSuccess = function (task) {
        let a380 = BABYLON.Mesh.MergeMeshes(task.loadedMeshes, true, true)
        a380.scaling = new BABYLON.Vector3(0.00175, 0.00175, 0.00175)
        a380.position.y += 100
        a380.position.x = 0
        a380.position.z = 300
        a380.rotation = new BABYLON.Vector3(0, Math.PI, 0)
        a380.state = "a380"
    }
}

function addF117(assetsManager, scaling = new BABYLON.Vector3(0.2, 0.2, 0.2), y = 100, z = 300) {
    var meshTask = assetsManager.addMeshTask("f117", "", `${source}/mesh/f117/`, "f117.obj");
    meshTask.onSuccess = function (task) {
        let f117 = BABYLON.Mesh.MergeMeshes(task.loadedMeshes, true, true)
        f117.position.y += y
        f117.position.x = 0
        f117.position.z = z

        let mat = new BABYLON.StandardMaterial()
        mat.diffuseColor = new BABYLON.Color3(0.28, 0.3, 0.3);
        f117.scaling = scaling
        f117.material = mat
        f117.state = "f117"
        console.log(f117)
    }
}

function addSphere(scene) {
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 60 }, scene);
    sphere.position = new BABYLON.Vector3(50, 100, 80);
    sphere.rotation.x = Math.PI * 0.7
    sphere.state = "sphere";

    var sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
    sphereMaterial.diffuseColor = new BABYLON.Color3(0.97, 0.69, 0.17)
    sphere.material = sphereMaterial;

    return sphere;
}

function addCube(scene) {
    var cube = BABYLON.Mesh.CreateBox("cube", 50, scene);
    cube.position = new BABYLON.Vector3(50, 100, 80);
    cube.rotation.x = Math.PI * 0.7;
    cube.state = "cube";

    var materialBox = new BABYLON.StandardMaterial("texture1", scene);
    materialBox.diffuseColor = new BABYLON.Color3(0.97, 0.69, 0.17)
    cube.material = materialBox

    return cube;
}

function addColumn(scene) {
    var column = BABYLON.Mesh.CreateCylinder("column", 50, 50, 50, 100, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
    column.position = new BABYLON.Vector3(0, 100, 80);
    column.rotation.x = Math.PI * 0.7;
    column.state = "column";

    var materialBox = new BABYLON.StandardMaterial("texture1", scene)
    materialBox.diffuseColor = new BABYLON.Color3(0.97, 0.69, 0.17)
    column.material = materialBox

    return column;
}

function addAircraft(assetsManager, scaling = new BABYLON.Vector3(0.2, 0.2, 0.2), y = 100, z = 300) {
    var meshTask = assetsManager.addMeshTask("aircraft", "", `${source}/mesh/aircraft/`, "1.stl");
    meshTask.onSuccess = function (task) {
        let aircraft = BABYLON.Mesh.MergeMeshes(task.loadedMeshes, true, true)
        aircraft.position.y += y
        aircraft.position.x = 0
        aircraft.position.z = z
        let mat = new BABYLON.StandardMaterial()
        mat.diffuseColor = new BABYLON.Color3(0.28, 0.3, 0.3); //
        // mat.diffuseColor = new BABYLON.Color3(0.97, 0.69, 0.17) //暗橙色
        aircraft.scaling = scaling
        aircraft.material = mat
        aircraft.state = "aircraft"
        aircraft.rotation = new BABYLON.Vector3(-Math.PI * 0.5, 0, 0)
    }
}

//api
function getVideoUrl(exp, plane, radar, view) {
    return `./result/${exp}/${plane}/${radar}/${view}.mp4`
}

function getPictureUrl(exp, plane, radar, view) {
    return `./result/${exp}/${plane}/${radar}/${view}.jpg`
}

function getMeshByState(state) {
    let item = {}
    scene.meshes.forEach((element) => {
        if (element.state == state) {
            item = element
        }
    })
    return item
}

function indexItem(origin, value) {
    index = 0
    for (index = 0; index < origin.length; index++) {
        if (origin[index] == value)
            return index
    }
    return -1
}

function transformVertical(commond) {
    if (commond == "top")
        return BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    else if (commond == "center")
        return BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
    else
        return BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
}

function transformHorizontal(commond) {
    if (commond == "left")
        return BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    else if (commond == "center")
        return BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    else
        return BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
}
