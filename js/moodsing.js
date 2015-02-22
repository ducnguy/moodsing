var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('lightblue', 1);
document.body.appendChild(renderer.domElement);

//var onRenderFcts= [];
var clock = new THREE.Clock();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.01, 1000);
var controls = new THREE.FirstPersonControls(camera);
camera.position.y = .2;
controls.handleResize();
controls.noFly = true;
controls.lookVertical=true;
controls.lookSpeed = 0.07;
controls.movementSpeed = 2.5;

var ambientLight   = new THREE.AmbientLight( 0xd9d9d9 )
scene.add( ambientLight )

// ENVIRONMENT AND EFFECTS
//grass floor
var grassTextureUrl  = 'img/grasslight-small.jpg'
var grassTexture = THREE.ImageUtils.loadTexture(grassTextureUrl);//load grass texture
grassTexture.wrapS   = THREE.RepeatWrapping;
grassTexture.wrapT   = THREE.RepeatWrapping;
grassTexture.repeat.x= 10
grassTexture.repeat.y= 10
grassTexture.anisotropy = renderer.getMaxAnisotropy()
var geometry    = new THREE.PlaneGeometry(100, 100)//make geometry
var grassMaterial    = new THREE.MeshPhongMaterial({//make material from above texture
    map : grassTexture,
    emissive: 'green',
})
var object3d    = new THREE.Mesh(geometry, grassMaterial)//create mesh
object3d.rotateX(-Math.PI/2)
scene.add(object3d)
//skysphere
var skyGeometry = new THREE.SphereGeometry(300, 20, 20);
var skyTextureUrl = 'img/electric-bg_masked.png'
var skyTexture = THREE.ImageUtils.loadTexture(skyTextureUrl)
skyTexture.wrapS = THREE.RepeatWrapping
skyTexture.wrapT = THREE.RepeatWrapping
skyTexture.repeat.set(4,4);
var skyMaterial = new THREE.MeshPhongMaterial({map:skyTexture,emissive:'blue',transparent:true});
skySphere = new THREE.Mesh(skyGeometry, skyMaterial);
skySphere.scale.set(-1, 1, 1);
skySphere.position.set( 0, 0,0 );
skySphere.rotation.order = 'XZY';
skySphere.renderDepth = 1000.0;
scene.add(skySphere);
/*var sphereSpotlight = new THREE.DirectionalLight( 0xffffff );
sphereSpotlight.position.set( 1, 1, -2 ).normalize();
scene.add( sphereSpotlight );*/
//skybg
var skybgGeometry = new THREE.SphereGeometry(3001, 20, 20);
var skybgTexture = skyMaterial = new THREE.MeshLambertMaterial()
var skybgSphere = new THREE.Mesh(skybgGeometry,skyMaterial)
skybgSphere.scale.set(-1, 1, 1);
scene.add(skybgSphere)
//ANIMATION
function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    controls.update(clock.getDelta());
    renderer.render(scene, camera);
}

animate();

/*onRenderFcts.push(function(){
        renderer.render( scene, camera );       
    })
    
    //////////////////////////////////////////////////////////////////////////////////
    //      loop runner                         //
    //////////////////////////////////////////////////////////////////////////////////
    var lastTimeMsec= null
    requestAnimationFrame(function animate(nowMsec){
        // keep looping
        requestAnimationFrame( animate );
        // measure time
        lastTimeMsec    = lastTimeMsec || nowMsec-1000/60
        var deltaMsec   = Math.min(200, nowMsec - lastTimeMsec)
        lastTimeMsec    = nowMsec
        // call each update function
        onRenderFcts.forEach(function(onRenderFct){
            onRenderFct(deltaMsec/1000, nowMsec/1000)
        })
    })*/
