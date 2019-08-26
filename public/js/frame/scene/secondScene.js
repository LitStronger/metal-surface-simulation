var secondScene = function (aeroplane = "F117") {
    var scene = new BABYLON.Scene(engine);

    video = ""

    var light = setLight(scene)
    frontCamera = frontCam(scene)
    sideCamera = sideCam(scene)
    scene.activeCamera = sideCamera
    var ground = frameGround(scene)
    var two_panel = addFrequencePanel(scene, aeroplane)
    var vrHelper = vr(scene, ground)
    var tri_panel = addBackButton("表面电场分布（频率）")

    var assetsManager = new BABYLON.AssetsManager(scene);
    assetsManager.onTaskError = function (task) {  
        console.log("error while loading " + task.name);
    }
    assetsManager.onFinish = function (tasks) {
        engine.runRenderLoop(function () {
            scene.render();
        });
    };
    addSkyAndFloor(scene);
    if (aeroplane == "F117") {
        addRadar(assetsManager, new BABYLON.Vector3(260, -10, -100))
        addF117(assetsManager)
        assetsManager.load();
    } else {
        addRadar(assetsManager, new BABYLON.Vector3(260, -10, -100))
        addA380(assetsManager)
        assetsManager.load();
    }
    console.log(scene)
    return scene;
};

// -----------------------------------------
function addFrequencePanel(scene_t, aeroplane) {
    wave = ""
    type = "side"
    radar = "433MHz"
    let columns = [
        "目标一",
        "目标二",
        "目标三",
        "目标四",
        "目标五"
    ]
    var columns_l = [
        "正视图",
        "侧视图"
    ]
    var columns_2 = [
        "0°方向",
        "45°方向",
        "90°方向",
        "135°方向",
        "180°方向",
        "225°方向",
        "270°方向",
        "315°方向"
    ]
    var columns_radar = [
        "433MHz",
        "2.4GHz"
    ]

    let columns_power=[
        "0dBm",
        "10dBm"
    ]
    

    // aero_type
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("plane_r");
    let panel = miniFormitem(columns, "目 标 类 型", "300px", "250px", 30, 60, "left", "top", onRatioClick = (aero) => {
        if (aero == "目标一") {
            scene.dispose()
            scene = secondScene_ball("square")
        } else if(aero == "目标二") {
            scene.dispose()
            scene = secondScene_ball("column")
        } else if(aero == "目标三"){
            scene.dispose();
            scene = secondScene_ball("sphere")
        } else if(aero == "目标四"){
            scene.dispose();
            scene = secondScene("F117")
        } else if(aero == "目标五"){
            scene.dispose();
            scene = secondScene("a380")
        }
    })
    advancedTexture.addControl(panel);

    var advancedTexture_rr = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("plane_rr");
    let panel_rr = miniFormitem(columns_power, "入射功率", "300px", "145px", 30, 320, "left", "top")
    advancedTexture_rr.addControl(panel_rr);

    // radar_type
    var clickFlag = true;
    var advancedTexture_l = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("plane_l");
    let panel_l = downFormitem_s(clickFlag, columns_radar, "开始实验", "雷 达 类 型", 30, 660,"300px","175px", "left", "top", onRatioClick = (value) => {
        radar = "433MHz";
        if (value >= 0 && value < 20) {          
            radar = "433MHz"
        } else if (value >= 20 && value < 40) {
            radar = "600MHz"
        }else if(value >= 40 && value < 60){
            radar = "900MHz"
        }else if(value >= 60 && value < 80){
            radar = "1.2GHz"
        }else if(value >= 80 && value <= 100){
            radar = "2.4GHz"
        }
        console.log("value:" + value);
        console.log("radar" + radar);
    }, onButtonClick = () => {       
        if(clickFlag == true){
            clickFlag = false;
            if (aeroplane != "" && radar != "" && type != "") {
                scene.meshes.forEach((element) => {
                    if (element.state == "f117" || element.state == "a380") {
                        aerofly_2(element, radar)
                    }
                    setTimeout(() => {
                        video = addPicture("exp_2", aeroplane, radar, type, x = 300, y = 80, z = 40)
                        clickFlag = true;
                        console.log("出现图片后的flag  :"+clickFlag);
                    }, 10000)
                })
            } else {
                console.log(aeroplane, wave, type)
                alert("请填写完所有参数")
                clickFlag = true;
            }
        }
    })
    advancedTexture_l.addControl(panel_l)
    
    //   view_type
    let panel_2 = addAngleSlider(columns_2,"选 择 角 度",30 , 475, "left", "top", onRatioClick = (index) =>{
        //element.rotation.y = 0;
        console.log(index+"角度");
        console.log("angle's : "+clickFlag);
        if(clickFlag == true)
        if (index == 0) {
            type = "front"//用于检测是否选择了相关参数
            scene.meshes.forEach((element) => {
                if (element.state == "f117" || element.state == "a380") {
                    if (element.position.x != 0 || element.position.z != 300) {
                        element.rotation.y = 0;
                        element.position = new BABYLON.Vector3(0, element.position.y, 300)
                        element.rotation.y = 0;
                        if(element.state == "a380") element.rotation.y = Math.PI;
                    }
                    console.log(element.position)
                }
            })
        }else if(index == 1){
            type = "side"           
            scene.meshes.forEach((element) => {  
                if (element.state == "f117" || element.state == "a380") {
                    if (element.position.x != -212 || element.position.z != 212) {
                        element.rotation.y = 0;
                        if(element.state == "a380") element.rotation.y = Math.PI;
                        element.position = new BABYLON.Vector3(-212, element.position.y, 212)
                        element.rotation.y -= 0.25 * Math.PI;
                    }
                    console.log("1:"+element.position)
                }
            })
            console.log("??");
        }else if(index == 2){
            scene.meshes.forEach((element) => {
                type = "side"
                if (element.state == "f117" || element.state == "a380") {
                    if (element.position.x != -300 || element.position.z != 0) {
                        element.rotation.y = 0;
                        if(element.state == "a380") element.rotation.y = Math.PI;
                        element.position = new BABYLON.Vector3(-300, element.position.y, 0)
                        element.rotation.y -= 0.5 * Math.PI
                    }
                    console.log(element.position)
                }
            })
        }else if(index == 3){
            scene.meshes.forEach((element) => {
                type = "side"
                if (element.state == "f117" || element.state == "a380") {
                    console.log(element.position)
                    if (element.position.x != -212 || element.position.z != -212) {
                        element.rotation.y = 0;
                        if(element.state == "a380") element.rotation.y = Math.PI;
                        element.position = new BABYLON.Vector3(-212, element.position.y, -212)
                        element.rotation.y -= 0.75 * Math.PI
                    }
                    console.log(element.position)
                }
            })
        }else if(index == 4){
            scene.meshes.forEach((element) => {
                type = "side"
                if (element.state == "f117" || element.state == "a380") {
                    if (element.position.x != 0 || element.position.z != -300) {
                        element.rotation.y = 0;
                        if(element.state == "a380") element.rotation.y = Math.PI;
                        element.position = new BABYLON.Vector3(0, element.position.y, -300)
                        element.rotation.y -= 1.0 * Math.PI
                    }
                    console.log(element.position)
                }
            })
        }else if(index == 5){
            scene.meshes.forEach((element) => {
                type = "side"
                if (element.state == "f117" || element.state == "a380") {
                    if (element.position.x != 212 || element.position.z != -212) {
                        element.rotation.y = 0;
                        if(element.state == "a380") element.rotation.y = Math.PI;
                        element.position = new BABYLON.Vector3(212, element.position.y, -212)
                        element.rotation.y -= 1.25 * Math.PI
                    }
                    console.log(element.position)
                }
            })
        }else if(index == 6){
            scene.meshes.forEach((element) => {
                type = "side"
                if (element.state == "f117" || element.state == "a380") {
                    if (element.position.x != 300 || element.position.z != 0) {
                        element.rotation.y = 0;
                        if(element.state == "a380") element.rotation.y = Math.PI;
                        element.position = new BABYLON.Vector3(300, element.position.y, 0)
                        element.rotation.y -= 1.5 * Math.PI
                    }
                    console.log(element.position)
                }
            })
        }else if(index == 7){
            scene.meshes.forEach((element) => {
                type = "side"
                if (element.state == "f117" || element.state == "a380") {
                    if (element.position.x != 212 || element.position.z != 212) {
                        element.rotation.y = 0;
                        if(element.state == "a380") element.rotation.y = Math.PI;
                        element.position = new BABYLON.Vector3(212, element.position.y, 212)
                        element.rotation.y -= 1.75 * Math.PI
                    }
                     console.log(element.position)
                }
            })
        }


        if (video != "") {
            video.dispose();
            video = "";
        }
    })
    advancedTexture.addControl(panel_2);
    //
    
    // view_type
   /* let panel_r2 = miniFormitem(columns_l, "选择角度", 30, 180, "left", "top", onRatioClick = (towards) => {
        console.log(towards);
        if (towards == 0) {
            type = "front"//用于检测是否选择了相关参数
            scene.meshes.forEach((element) => {
                if (element.state == "f117" || element.state == "a380") {
                    console.log(element.position)
                    if (element.position.z != 0) {
                        element.position = new BABYLON.Vector3(-300, element.position.y, 0)
                        element.rotation.y -= 0.5 * Math.PI
                    }
                }
            })
        } else {
            scene.meshes.forEach((element) => {
                type = "side"
                if (element.state == "f117" || element.state == "a380") {
                    console.log(element.position)
                    if (element.position.x != 0) {
                        element.position = new BABYLON.Vector3(0, element.position.y, 300)
                        element.rotation.y += 0.5 * Math.PI
                    }
                }
            })
        }
        if (video != "") {
            video.dispose()
            video = ""
        }
    })
    advancedTexture.addControl(panel_r2);*/
}

function aerofly_2(aeroplane, frequency) {
    let temp_pos
    let radar = getMeshByState("radar")
    radar = radar.position
    //let wave = createRadarSphere(scene, frequency == "433MHz" ? 2 : 0.7, new BABYLON.Vector3(257, 15, -98), new BABYLON.Vector3(Math.PI * 0.3, Math.PI * 0.69, Math.PI * 0))
    let wave;
    console.log("wave:"+frequency);

    if (frequency == "433MHz")
        wave = createRadarSphere(scene, 0.8, new BABYLON.Vector3(257, 15, -98), new BABYLON.Vector3(Math.PI * 0.3, Math.PI * 0.69, Math.PI * 0))
    else if(frequency == "600MHz"){
        wave = createRadarSphere(scene, 0.65, new BABYLON.Vector3(257, 15, -98), new BABYLON.Vector3(Math.PI * 0.3, Math.PI * 0.69, Math.PI * 0))
    }else if(frequency == "900MHz")
        wave = createRadarSphere(scene, 0.5, new BABYLON.Vector3(257, 15, -98), new BABYLON.Vector3(Math.PI * 0.3, Math.PI * 0.69, Math.PI * 0))
    else if(frequency == "1.2GHz")
        wave = createRadarSphere(scene, 0.35, new BABYLON.Vector3(257, 15, -98), new BABYLON.Vector3(Math.PI * 0.3, Math.PI * 0.69, Math.PI * 0))
    else if(frequency == "2.4GHz")
        wave = createRadarSphere(scene, 0.2, new BABYLON.Vector3(257, 15, -98), new BABYLON.Vector3(Math.PI * 0.3, Math.PI * 0.69, Math.PI * 0))
    /*setTimeout(() => {
        clearInterval(wave)
    }, 5000)*/
    console.log("position:"+aeroplane.position);
    console.log(aeroplane.position.x == 0 && aeroplane.position.z == -300);
    if (aeroplane.position.z == 300  && aeroplane.position.x == 0) {
        let back = 0
        setTimeout(() => {
            back = setInterval(() => {
                temp_pos = new BABYLON.Vector3(aeroplane.position.x, aeroplane.position.y, aeroplane.position.z)
                setTimeout(()=>{
                    createBackSphere(scene, temp_pos, radar)
                },1500)
            }, 200)
        }, 500)
        let move = setInterval(() => {
            aeroplane.position.z -= 0.5;//0.5
            if (aeroplane.position.z <= -600) {
                clearInterval(move)
                clearInterval(back)
                clearInterval(wave)
                //aeroplane.position = new BABYLON.Vector3(0, aeroplane.position.y, 300)//飞机复位
                
            }
        }, 1)
    }else if (aeroplane.position.z > -424 && aeroplane.position.x < 424 && aeroplane.position.z == 212 && aeroplane.position.x == -212) {
        let back = 0
        setTimeout(() => {
            back = setInterval(() => {
                temp_pos = new BABYLON.Vector3(aeroplane.position.x, aeroplane.position.y, aeroplane.position.z)
                setTimeout(()=>{
                    createBackSphere(scene, temp_pos, radar)
                },1500)
            }, 300)
        }, 1000)
        let move = setInterval(() => {
            aeroplane.position.z -= 0.35
            aeroplane.position.x += 0.35
            if (aeroplane.position.z <= -424) {
                clearInterval(move)
                clearInterval(back)
                clearInterval(wave)
                //aeroplane.position = new BABYLON.Vector3(-212, aeroplane.position.y, 212)
            }
        }, 1)
    }else if (aeroplane.position.z == 0 && aeroplane.position.x == -300) {//90
        let back = 0
        setTimeout(() => {
            back = setInterval(() => {
                temp_pos = new BABYLON.Vector3(aeroplane.position.x, aeroplane.position.y, aeroplane.position.z)
                setTimeout(()=>{
                    createBackSphere(scene, temp_pos, radar)
                },1500)
            }, 300)
        }, 1000)
        let move = setInterval(() => {
            aeroplane.position.x += 0.5
            if (aeroplane.position.x >= 600) {
                clearInterval(move)
                clearInterval(back)
                clearInterval(wave)
                //aeroplane.position = new BABYLON.Vector3(-300, aeroplane.position.y, 0)
            }
        }, 1)
    }else if (aeroplane.position.x == -212 && aeroplane.position.z == -212) {//135
        let back = 0
        setTimeout(() => {
            back = setInterval(() => {
                temp_pos = new BABYLON.Vector3(aeroplane.position.x, aeroplane.position.y, aeroplane.position.z)
                setTimeout(()=>{
                    createBackSphere(scene, temp_pos, radar)
                },1500)
            }, 300)
        }, 1000)
        let move = setInterval(() => {
            aeroplane.position.z += 0.35;
            aeroplane.position.x += 0.35;
            if (aeroplane.position.z >= 424 && aeroplane.position.x >= 424) {
                clearInterval(move)
                clearInterval(back)
                clearInterval(wave)
                //aeroplane.position = new BABYLON.Vector3(-212, aeroplane.position.y, -212)
            }
        }, 1)
    }else if (aeroplane.position.x == 0 && aeroplane.position.z == -300) {//180
        let back = 0
        console.log("into if")
        setTimeout(() => {
            back = setInterval(() => {
                temp_pos = new BABYLON.Vector3(aeroplane.position.x, aeroplane.position.y, aeroplane.position.z)
                setTimeout(()=>{
                    createBackSphere(scene, temp_pos, radar)
                },1500)
            }, 300)
        }, 1000)
        let move = setInterval(() => {
            aeroplane.position.z += 0.5
            console.log("if move?")
            if (aeroplane.position.z >= 600) {
                clearInterval(move)
                clearInterval(back)
                clearInterval(wave)
                //aeroplane.position = new BABYLON.Vector3(0, aeroplane.position.y, -300)
            }
        }, 1)
    }else if (aeroplane.position.x == 212 && aeroplane.position.z == -212) {//225
        let back = 0
        setTimeout(() => {
            back = setInterval(() => {
                temp_pos = new BABYLON.Vector3(aeroplane.position.x, aeroplane.position.y, aeroplane.position.z)
                setTimeout(()=>{
                    createBackSphere(scene, temp_pos, radar)
                },1500)
            }, 300)
        }, 1000)
        let move = setInterval(() => {
            aeroplane.position.x -= 0.35
            aeroplane.position.z += 0.35
            if (aeroplane.position.z >= 424) {
                clearInterval(move)
                clearInterval(back)
                clearInterval(wave)
                //aeroplane.position = new BABYLON.Vector3(212, aeroplane.position.y, -212)
            }
        }, 1)
    }else if (aeroplane.position.x == 300 && aeroplane.position.z == 0) {//270
        let back = 0
        setTimeout(() => {
            back = setInterval(() => {
                temp_pos = new BABYLON.Vector3(aeroplane.position.x, aeroplane.position.y, aeroplane.position.z)
                setTimeout(()=>{
                    createBackSphere(scene, temp_pos, radar)
                },1500)
            }, 300)
        }, 1000)
        let move = setInterval(() => {
            aeroplane.position.x -= 0.5
            if (aeroplane.position.x <= -600) {
                clearInterval(move)
                clearInterval(back)
                clearInterval(wave)
                //aeroplane.position = new BABYLON.Vector3(300, aeroplane.position.y, 0)
            }
        }, 1)
    }else if (aeroplane.position.x == 212 && aeroplane.position.z == 212) {
        let back = 0
        setTimeout(() => {
            back = setInterval(() => {
                temp_pos = new BABYLON.Vector3(aeroplane.position.x, aeroplane.position.y, aeroplane.position.z)
                setTimeout(()=>{
                    createBackSphere(scene, temp_pos, radar)
                },1500)
            }, 300)
        }, 1000)
        let move = setInterval(() => {
            aeroplane.position.x -= 0.35
            aeroplane.position.z -= 0.35
            if (aeroplane.position.z <= -424) {
                clearInterval(move)
                clearInterval(back)
                clearInterval(wave)
                //aeroplane.position = new BABYLON.Vector3(212, aeroplane.position.y, 212)
            }
        }, 1)
    }
}