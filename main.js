
function init(){
	//khởi tạo cảnh
	scene = new THREE.Scene();

	//khởi tạo gui và đặt tên cho gui để đặt vị trí trong style.css
	gui = new dat.GUI( { autoPlace: false } );
    	$('.moveGUI').append($(gui.domElement));

	// Tạo nền với kích thước và bề mặt truyền vào
	var plane = new THREE.Mesh(GetGeometry('Plane'),GetMaterial('Phong'));
	plane.name = 'plane';
	plane.receiveShadow = true;
	plane.rotation.x = Math.PI / 2;
	plane.visible = false;
	scene.add(plane);

	//khởi tạo container cố định chứa vật thể và áp dụng các transformControls và animation
	//làm material của container trong suốt để thấy được vật thể bên trong
	Container = GetSurface(GetGeometry('Box'), GetMaterial('Solid'), 'Solid');
    	Container.material.transparent = true;
	Container.material.opacity = 0;
	// Tạo vật thể với tùy chọn hình dạng và bề mặt
	var ObjectOne = GetSurface(GetGeometry('Box'), GetMaterial('Solid'), 'Solid');
	ObjectOne.name = "objectOne";
	ObjectOne.castShadow = true;
	Container.add(ObjectOne);
	scene.add(Container);

	animation1 = anime.timeline({
		targets: Container.position,
		keyframes: [
			{x: 5, z:-5, duration: 0},
			{z: 5, duration: 2000},
			{x: -5, duration: 2000},
			{z: -5, duration: 2000},
			{x: 5, duration: 1000},
			{x: -5, duration: 600, direction: 'easeOutElastic'},
			{x: 5, duration: 400, direction: 'easeOutElastic'}
			],
		easing: 'linear',
		loop: true,
		autoplay: false,
		direction: 'normal'
	})

	animation1.add({
		targets: Container.rotation,
		keyframes: [
			{x: Math.PI*2},
			{z: Math.PI*2},
			{x: -Math.PI*2},
			{z: -Math.PI*2}],
		duration: 8000,
		easing: 'linear'
	}, 0);

	animation1.add({
		targets: Container.position,
		keyframes: [
			{y: 4, duration: 1000, easing: 'easeInBounce'},
			{y: 0, duration: 1000, easing: 'easeOutBounce'}],
		easing: 'linear'
	}, 0);

	animation1.add({
		targets: Container.position,
		keyframes: [
			{y: -4, duration: 800, easing: 'easeOutCubic'},
			{y: 1.5, duration: 700, easing: 'easeInCubic'},
			{y: 0, duration: 400, easing: 'easeInOutCubic'}],
		easing: 'linear'
	}, 2000);

	animation1.add({
		targets: Container.position,
		keyframes: [
			{y: -3, duration: 200, easing: 'easeOutQuad'},
			{y: 3, duration: 500, easing: 'easeOutQuad'},
			{y: -3, duration: 500, easing: 'easeOutQuad'},
			{y: 3, duration: 500, easing: 'easeOutQuad'},
			{y: 0, duration: 300, easing: 'easeOutQuad'}],
		easing: 'linear'
	}, 4000);

	animation2 = anime.timeline({
		targets: Container.scale,
		keyframes: [
			{x: 3, z: 2, y:-3},
			{x: 1, z: -2, y: 3},
			{x: -4, z: -2, y: 2},
			{x: 1, z: 1, y: 1}],
		duration: 4000,
		easing: 'easeInOutSine',
		loop: true,
		autoplay: false
	});

	animation2.add({
		targets: Container.position,
		keyframes: [
			{x: 0, y: 0, z: 0, duration: 0},
			{x: 5},
			{x: 0},
			{x: -5},
			{x: 0}],
		duration: 5000,
		easing: 'linear',
		loop: true,
	}, 0);

	animation3 = anime.timeline({
		targets: Container.position,
		keyframes: [
			{x: 0, y: 0, z: 0, duration: 0},
			{y: 5, duration: 1500}],
		easing: 'easeInBounce',
		loop: true,
		autoplay: false,
		direction: 'alternate'
	});

	animation3.add({
		targets: Container.rotation,
		y: Math.PI*2,
		duration: 1500,
		easing: 'linear'
	}, 0);
	
	// Tạo một lưới vuông với 4 tham số lần lượt là:
	// kích thước của toàn lưới, độ chia nhỏ ô, màu của 2 đường trung tâm, màu lưới.
	GridHelp = new THREE.GridHelper(100, 20, 0xBAC2C6, 0x6A7B81);
	GridHelp.receiveShadow = true;
	scene.add(GridHelp);
	
	//tạo hình cầu
	var Sphere = new THREE.Mesh(new THREE.SphereGeometry(0.1,12,12),GetMaterial('Solid'));

	// tạo ánh sáng
	var pointLight = GetPointLight(1);
	pointLight.name = 'light';
	pointLight.visible = false;
	pointLight.add(Sphere);
	scene.add(pointLight);

	//thêm điều khiển tọa độ và màu của ánh sáng.
	lightGUI = gui.addFolder('Light');
	lightGUI.add(pointLight,'intensity',0,10).name("int");
	lightGUI.add(pointLight.position,'x',-5,5);
	lightGUI.add(pointLight.position,'y',-5,5);
	lightGUI.add(pointLight.position,'z',-5,5);
	var parameters = {color: 0xffffff};
	lightGUI.addColor(parameters, 'color').onChange( function () {
		pointLight.color.set( parameters.color );
	}).name('Color');
	lightGUI.open();
	lightGUI.hide();

	// tạo Camera.
	var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,100);
	camera.position.set(0, 15, 20);
	camera.lookAt(new THREE.Vector3(0,0,0));
	scene.add(camera);

	//thêm điều khiển camera
	var cameraGUI = gui.addFolder('Camera');
	cameraGUI.add(camera, 'fov', 1, 180).name("FOV");
	cameraGUI.add(camera,'near',0.1,50).name("Near");
	cameraGUI.add(camera,'far',1,100).name("Far");
	cameraGUI.open();
	
	//tạo render
	var renderer = new THREE. WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.setClearColor('rgb(51, 57, 65)');
	document.getElementById('webgl').appendChild(renderer.domElement);
	renderer.render(scene, camera);

	//kiểm soát camera bằng chuột
	var controls = new THREE.OrbitControls(camera,renderer.domElement);

	//gọi update để cập nhật liên tục animation
	update(renderer,scene,camera,controls);

	// Transform control, for using mouse for scale, rotation...
	transformControls = new THREE.TransformControls(camera,renderer.domElement);
	transformControls.addEventListener( 'dragging-changed', function ( event ) 
		{
			controls.enabled = ! event.value;
		});
	
	transformControls.mode = 'translate'; // rotate & translate & scale are code at here.
	transformControls.setMode('translate');	//"translate", "rotate" and "scale". Default is translate.
	transformControls.attach(Container);
	scene.add(transformControls);

	// For Fun
	const listener = new THREE.AudioListener();
	camera.add( listener );
	sound = new THREE.Audio( listener );

	audioLoader = new THREE.AudioLoader();
	audioLoader.load( './assests/sounds/DDD.mkv', function( buffer ) {
		sound.setBuffer( buffer );
		sound.setLoop(true);
		sound.setVolume( 1 );
		sound.play();});
	audioLoader.autoplay = false;
	
	ResetObject();
}

function SetMusic(){
	if (music == 0){
		$('#mute').find('.fas').removeClass('fa-volume-mute')
    	.addClass('fa-volume-up')
		music = 1;
		sound.play();
	} else {
		$('#mute').find('.fas').removeClass('fa-volume-up')
    	.addClass('fa-volume-mute')
		music = 0;
		sound.pause();
	}
}

function PlayMusic(type, url){
	switch(type){
		case 1:
			sound.stop();
			audioLoader.load( './assests/sounds/DDD.mkv', function( buffer ) {
				sound.setBuffer( buffer );
				sound.setLoop(true);
				sound.setVolume( 1 );
				sound.play();});
			
			break;
		case 2:
			sound.stop();
			audioLoader.load( './assests/sounds/laylalay.mp3', function( buffer ) {
				sound.setBuffer( buffer );
				sound.setLoop(true);
				sound.setVolume( 1 );
				sound.play();});
			break;
		case 3:
			sound.stop();
			audioLoader.load( './assests/sounds/VachNgocNga.mp3', function( buffer ) {
				sound.setBuffer( buffer );
				sound.setLoop(true);
				sound.setVolume( 1 );
				sound.play();});
			break;
		case 4:
			sound.stop();
			audioLoader.load( url, function( buffer ) {
				sound.setBuffer( buffer );
				sound.setLoop(true);
				sound.setVolume( 1 );
				sound.play();});
			break;
	}
}

function SelecteMusic(){
	var input = document.getElementById('music-input');
	input.onchange = e => {
		var file = e.target.files[0]; 
		
		const reader = new FileReader();

		reader.addEventListener("load", function () {
			PlayMusic(4, reader.result);
		}, false);
	
		if (file) {
			reader.readAsDataURL(file);
		}
	} 
	input.click();
}

function GetPointLight(intensity)
{
	var pointLight = new THREE.PointLight('white',intensity);
	pointLight.castShadow = true;
	pointLight.position.x = 2;
	pointLight.position.y = 1;
	pointLight.position.z = 1;
	return pointLight;
}

function GetGeometry(type)
{
	var Geometry;
	switch(type)
	{
		case 'Box':
			Geometry = new THREE.BoxGeometry(1,1,1);
			break;
		case 'Circle':
			Geometry = new THREE.CircleGeometry(1,32);
			break;
		case 'Sphere':
			Geometry = new THREE.SphereGeometry(1,42,42);
			break;
		case 'Cone':
			Geometry = new THREE.ConeGeometry(0.4,2,16);
			break;
		case 'Cylinder':
			Geometry = new THREE.CylinderGeometry(1,1,1,25);
			break;
		case 'Octahedron':
			Geometry = new THREE.OctahedronGeometry(1,0);
			break;
		case 'Ring':
			Geometry = new THREE.RingGeometry(0.5,3,5);
			break;
		case 'Plane':
			Geometry = new THREE.PlaneGeometry(10,10);
			break;
		case 'Torus':
			Geometry = new THREE.TorusGeometry(1,0.4,6,100);
			break;
		case 'TeaPot':
			Geometry = new THREE.TeapotGeometry(0.5,10);
			break;
	}
	return Geometry;
}

function GetMaterial(type, url)
{		
	var textures;
	if(url){
		textures = new THREE.TextureLoader().load(url);
		textures.warpS = THREE.RepeatWrapping;
		textures.warpT = THREE.RepeatWrapping;
	}

	var selectedMaterial;
	switch(type)
	{
		case 'Line':
			selectedMaterial = new THREE.LineBasicMaterial({color: 'white'});
			break;
		case 'Points':
			selectedMaterial = new THREE.PointsMaterial({size: 0.05, color: 'white'});
			break;
		case 'Solid':
			selectedMaterial = new THREE.MeshBasicMaterial({color: 'white', side: THREE.DoubleSide});
			break;
		case 'Texture':
			selectedMaterial = new THREE.MeshBasicMaterial({color: 'white', side: THREE.DoubleSide, map: textures});
			break;
		default:
			selectedMaterial = new THREE.MeshPhongMaterial({color: 'white', side: THREE.DoubleSide});
	}

	return selectedMaterial;
}

function GetSurface(geometry, material, type)
{
	var Surface;
	switch(type)
	{
		case 'Line':
			Surface = new THREE.Line(geometry,material);
			break;
		case 'Points':
			Surface = new THREE.Points(geometry,material);
			break;
		case 'Solid':
			Surface = new THREE.Mesh(geometry,material);
			break;
		default:
			Surface = new THREE.Mesh(geometry,material);
	}
	return Surface;

}

function update(renderer,scene,camera,controls){
	renderer.render(scene,camera);
	controls.update();

	requestAnimationFrame(function(){
		camera.updateProjectionMatrix();
		update(renderer,scene,camera,controls);

	})
}

function SetGeometry(type){
	var ObjectOne = Container.getObjectByName('objectOne');
	switch(type)
	{
		case 1:
			ObjectOne.geometry = GetGeometry("Box");
			break;
		case 2:
			ObjectOne.geometry = GetGeometry("Circle");
			break;
		case 3:
			ObjectOne.geometry = GetGeometry("Sphere");
			break;
		case 4:
			ObjectOne.geometry = GetGeometry("Cone");
			break;
		case 5:
			ObjectOne.geometry = GetGeometry("Cylinder");
			break;
		case 6:
			ObjectOne.geometry = GetGeometry("Octahedron");
			break;
		case 7:
			ObjectOne.geometry = GetGeometry("Ring");
			break;
		case 8:
			ObjectOne.geometry = GetGeometry("Plane");
			break;
		case 9:
			ObjectOne.geometry = GetGeometry("Torus");
			break;
		case 10:
			ObjectOne.geometry = GetGeometry("TeaPot");
			break;
	};
}

function loadNew(ObjectNew, ObjectOld){
	//load hết thông số object cũ sang cái mới
	ObjectNew.position.copy(ObjectOld.position);
	ObjectNew.rotation.copy(ObjectOld.rotation);
	ObjectNew.scale.copy(ObjectOld.scale);
	ObjectNew.name = ObjectOld.name;

	//dọn sạch object cũ
	Container.remove(ObjectOld);
	ObjectOld.geometry.dispose();
    ObjectOld.material.dispose();

	Container.add(ObjectNew);
}

function SetSurface(type){
	var ObjectOld = Container.getObjectByName('objectOne');
	var ObjectNew;
	var url;
	switch(type)
	{
		case 1:
			ObjectNew = new THREE.Points(ObjectOld.geometry, GetMaterial('Points'));
			loadNew(ObjectNew, ObjectOld);
			break;
		case 2:
			ObjectNew = new THREE.Line(ObjectOld.geometry, GetMaterial("Line"));
			loadNew(ObjectNew, ObjectOld);
			break;
		case 3:
			ObjectNew = new THREE.Mesh(ObjectOld.geometry, GetMaterial('Solid'));
			loadNew(ObjectNew, ObjectOld);
			break;
		case 4:
			var input = document.getElementById('file-input');
			input.onchange = e => {
				// getting a hold of the file reference
				var file = e.target.files[0]; 
				
				const reader = new FileReader();
  
				reader.addEventListener("load", function () {
					// convert image file to base64 string
					ObjectNew = new THREE.Mesh(ObjectOld.geometry, GetMaterial("Texture", reader.result));
					loadNew(ObjectNew, ObjectOld);
				}, false);
			
				if (file) {
					reader.readAsDataURL(file);
				}
			} 
			input.click();
			break;
	}

	
}

function SetLight(){
	lightGUI.show();

	//hiển thị ánh sáng
	scene.getObjectByName('light').visible = true;

	//thay đổi lại material của object thành Phong để không tự phát sáng như basic
	Container.getObjectByName('objectOne').material = GetMaterial("Phong");

	//hiển thị nền để tạo shadow
	scene.getObjectByName('plane').visible = true;
}

function RemoveLight(){
	lightGUI.hide();
	//tắt ánh sáng
	scene.getObjectByName('light').visible = false;

	//thay đổi lại material của object thành basic để tự phát
	Container.getObjectByName('objectOne').material = GetMaterial("Solid");

	//ẩn nền
	scene.getObjectByName('plane').visible = false;
}

function SetTranformMode(type){
	switch(type)
	{
		case 1: transformControls.mode = 'translate';
			break;
		case 2: transformControls.mode = 'rotate';
			break;
		case 3: transformControls.mode = 'scale';
			break;	
	}
}

function SetAnimation(type){
	switch(type){
		case 1: 
			transformControls.visible = false;
			animation2.pause();
			animation3.pause();
			animation1.play();
			break;
		case 2:
			transformControls.visible = false;
			animation2.play();
			animation1.pause();
			animation3.pause();
			break;
		case 3:
			transformControls.visible = false;
			animation3.play();
			animation1.pause();
			animation2.pause();
			break;
		case 4:
			Container.getObjectByName('objectOne').position.set(0, 0, 0);
			Container.getObjectByName('objectOne').rotation.set(0, 0, 0);
			transformControls.visible = true;
			animation1.pause();
			animation2.pause();
			animation3.pause();
			break;
	}
}

function ResetObject(){
	Container.position.set(0,0,0);
	Container.rotation.set(0,0,0);
	Container.scale.set(1,1,1);
}

var scene, Container, transformControls, lightGUI;
var audioLoader, sound, music = 1;
var animation1, animation2, animation3;
init();
