var renderer = new THREE.WebGLRenderer( { antialias: false } );
//renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var clock = new THREE.Clock();
var scene = new THREE.Scene();
var FAR = 500;
scene.fog = new THREE.FogExp2( 0x0041ff, .00028)
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.01, 1000);
camera.position.y = 50;
var controls = new THREE.FirstPersonControls(camera);
controls.handleResize();
controls.noFly = true;
controls.lookVertical=false;
controls.lookSpeed = 0;
controls.movementSpeed = 40;
oculuscontrol = new THREE.OculusControls( camera );
oculuscontrol.connect();

effect = new THREE.OculusRiftEffect( renderer, {worldScale: 10} );
effect.setSize( window.innerWidth, window.innerHeight );

var ambientLight   = new THREE.AmbientLight( 0x888888,.1 )
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
var skyGeometry = new THREE.SphereGeometry(3200, 20, 20);
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

//skybg
var skybgGeometry = new THREE.SphereGeometry(3300, 20, 20);
var skyMaterial = new THREE.MeshBasicMaterial()
var skybgSphere = new THREE.Mesh(skybgGeometry,skyMaterial)
skyMaterial.color = new THREE.Color(0xffffff)
skybgSphere.scale.set(-1, 1, 1);
scene.add(skybgSphere)

//OBJECT IMPORT
var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
var dae;
loader.load( 'resources/stanfordquad-model/stanfordquad.dae', function ( collada ) {

    dae = collada.scene;
    /*dae.traverse( function ( child ) {
        if ( child instanceof THREE.SkinnedMesh ) {
            var animation = new THREE.Animation( child, child.geometry.animation );
            animation.play();
        }
    } );*/
    dae.scale.x = dae.scale.y = dae.scale.z = 0.2;
    dae.updateMatrix();
    scene.add( dae );
    animate();
} );
/*var loader = new THREE.OBJMTLLoader();
loader.load( 'resources/stanfordquad-model/stanfordquad.obj', 'resources/stanfordquad-model/stanfordquad.mtl', function ( object ) {
    scene.add( object );
}, onProgress, onError );
*/
//ANIMATION
function animate() {
    requestAnimationFrame(animate);
    render();
    controls.update( clock.getDelta() );
    oculuscontrol.update( clock.getDelta() );
}

function init(){

}

/*var directionalLight1 = new THREE.DirectionalLight( 0x0000ff, 1 );
directionalLight1.position.set( 0, 1, 0 );
scene.add( directionalLight1 );

var directionalLight2 = new THREE.DirectionalLight( 0x00ff00, 1 );
directionalLight2.target.position.set(0,100,0);
scene.add( directionalLight2 );*/


function render() {
    //controls.update(clock.getDelta());

    var time = Date.now() * 0.00025;
    effect.render(scene, camera);

}

function initSky(){
    // Add Sky Mesh
    sky = new THREE.Sky();
    scene.add( sky.mesh );


    // Add Sun Helper
    sunSphere = new THREE.Mesh( new THREE.SphereGeometry( 20000, 30, 30 ),
        new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: false }));
    sunSphere.position.y = -700000;
    sunSphere.visible = true;
    scene.add( sunSphere );

    /// GUI

    var effectController  = {
        turbidity: 10,
        reileigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        luminance: 1,
        inclination: 0.49, // elevation / inclination
        azimuth: 0.25, // Facing front,                 
        sun: !true
    }

    var distance = 400000;

    function guiChanged() {
        var uniforms = sky.uniforms;
        uniforms.turbidity.value = effectController.turbidity;
        uniforms.reileigh.value = effectController.reileigh;
        uniforms.luminance.value = effectController.luminance;
        uniforms.mieCoefficient.value = effectController.mieCoefficient;
        uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

        var theta = Math.PI * (effectController.inclination - 0.5);
        var phi = 2 * Math.PI * (effectController.azimuth - 0.5);

        sunSphere.position.x = distance * Math.cos(phi);
        sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta); 
        sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta); 

        sunSphere.visible = effectController.sun;

        sky.uniforms.sunPosition.value.copy(sunSphere.position);

    }


    var gui = new dat.GUI();


    gui.add( effectController, "turbidity", 1.0, 20.0, 0.1 ).onChange( guiChanged );
    gui.add( effectController, "reileigh", 0.0, 4, 0.001 ).onChange( guiChanged );
    gui.add( effectController, "mieCoefficient", 0.0, 0.1, 0.001 ).onChange( guiChanged );
    gui.add( effectController, "mieDirectionalG", 0.0, 1, 0.001 ).onChange( guiChanged );
    gui.add( effectController, "luminance", 0.0, 2).onChange( guiChanged );;
    gui.add( effectController, "inclination", 0, 1, 0.0001).onChange( guiChanged );
    gui.add( effectController, "azimuth", 0, 1, 0.0001).onChange( guiChanged );
    gui.add( effectController, "sun").onChange( guiChanged );
    

    guiChanged();


    camera.lookAt(sunSphere.position)


}

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
