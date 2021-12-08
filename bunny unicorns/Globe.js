//Arvid//


import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';

import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';



  const container = document.getElementById("globe");
  const canvas = container.getElementsByTagName("canvas")[0];
  
  const globeRadius = 100;
  const globeWidth = 4098 / 2;
  const globeHeight = 1968 / 2;

  var camera, scene;

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  document.addEventListener('mousedown', onDocumentMouseDown, false);

  console.log("set upp variables");
  init();

  function convertFlatCoordsToSphereCoords(x, y) {
    console.log("run cord to sper");
    let latitude = ((x - globeWidth) / globeWidth) * -180;
    let longitude = ((y - globeHeight) / globeHeight) * -90;
    latitude = (latitude * Math.PI) / 180;
    longitude = (longitude * Math.PI) / 180;
    const radius = Math.cos(longitude) * globeRadius;

    return {
      x: Math.cos(latitude) * radius,
      y: Math.sin(longitude) * globeRadius,
      z: Math.sin(latitude) * radius
    };
  }

  function makeEarth(points) {
    console.log("runing makEarth");

    const { width, height } = container.getBoundingClientRect();

    // 1. Setup scene
    scene = new THREE.Scene();
    // 2. Setup camera
    camera = new THREE.PerspectiveCamera(45, width / height);
    // 3. Setup renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, });
    renderer.setSize(width, height);
    //  4. Add points to canvas 
    const pointGeometry = new THREE.SphereGeometry(0.5, 7, 7); //try sphereBufferGeometry
    const pointRedGeometry = new THREE.SphereGeometry(1.3 , 10, 10);

    const pointMaterial = new THREE.MeshBasicMaterial(
      {color:"white"}
    ); //MeshBasicMaterial for colour without light, MeshStandardMaterial
    const pointRedMaterial = new THREE.MeshBasicMaterial(
      {color:"red"}
    ); //MeshBasicMaterial for colour without light, MeshStandardMaterial
    const globePoint = new THREE.Mesh(pointGeometry, pointMaterial);
    const globeRedPoint = new THREE.Mesh(pointRedGeometry, pointRedMaterial);

    const globeShape = new THREE.Group();

    for (let point of points) {
      const { x, y, z } = convertFlatCoordsToSphereCoords(
        point.x,
        point.y,
        width,
        height
      );
     
      if(x && y && z) {
        if(point.active == 1){
          const sphereRed = globeRedPoint.clone();
          sphereRed.userData =  { URL: point.url};
          sphereRed.position.x = x;
          sphereRed.position.y = y;
          sphereRed.position.z = z;
          globeShape.add(sphereRed);
        }
        else{
          const sphere = globePoint.clone();
          sphere.position.x = x;
          sphere.position.y = y;
          sphere.position.z = z;
          globeShape.add(sphere);
        }
      }
    } 

      scene.add(globeShape);

    
      camera.orbitControls = new OrbitControls(camera, canvas);
      camera.orbitControls.enableKeys = false;
      camera.orbitControls.enablePan = false;
      camera.orbitControls.enableZoom = true;
      camera.orbitControls.enableDamping = true;
      camera.orbitControls.enableRotate = true;
      camera.orbitControls.autoRotate = true;
      camera.orbitControls.autoRotateSpeed = 0.3;
      // Tweak this value based on how far/away you'd like the camera
      // to be from the globe.
      camera.position.z = -265;
      // 4. Use requestAnimationFrame to recursively draw the scene in the DOM.
      function animate() {
        console.log("runing animate");
        // Since autoRotate is set to true, we need tool call update
        // on each animation frame.
        camera.orbitControls.update();
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
  
      animate();
    }

  function hasWebGL() {
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl && gl instanceof WebGLRenderingContext) {
      console.log("runing haswebgl in if");
      return true;
    } else {
      return false;
    }
  }

  function init(){
    console.log("runing init");
    if (hasWebGL()){
      window.fetch("./points.json")
      .then(response => response.json())
        .then(data => {
          makeEarth(data.points);
        }
      );
    }
  }

  // -- events -- //

function onDocumentMouseDown(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children, true);
    //console.log(intersects[0].object.TestA);
   
    if (intersects.length > 0) {
      console.log(intersects[0].object.URL);
    //get a link from the userData object
        window.open(intersects[0].object.userData.URL);
  }
};
