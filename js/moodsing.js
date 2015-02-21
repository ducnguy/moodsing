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
var geometry = new THREE.SphereGeometry(1000, 20, 20);
var skyTextureUrl = 'img/electric-bg.png'
var skyTexture = THREE.ImageUtils.loadTexture(skyTextureUrl)
skyTexture.wrapS = THREE.RepeatWrapping
skyTexture.wrapT = THREE.RepeatWrapping
skyTexture.repeat.set(1,1);

var skyMaterial = new THREE.MeshLambertMaterial({map:skyTexture});

skySphere = new THREE.Mesh(geometry, skyMaterial);
skySphere.scale.set(-1, 1, 1);
skySphere.position.set( 0, 0,0 );
skySphere.rotation.order = 'XZY';
skySphere.renderDepth = 1000.0;
scene.add(skySphere);
var sphereSpotlight = new THREE.DirectionalLight( 0xffffff );
sphereSpotlight.position.set( 1, 1, -2 ).normalize();
scene.add( sphereSpotlight );
/*var sphere = new THREE.SphereGeometry( .2,20,20);
var material_sphere1 = new THREE.MeshLambertMaterial( { color: 0xffaa00, shading: THREE.FlatShading } );
var mesh1 = new THREE.Mesh( sphere, material_sphere1 );
mesh1.position.set( 0, .2,.577 );
scene.add( mesh1 );*/

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
