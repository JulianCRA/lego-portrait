let filedrop;
let sketch;
let imageFile;

window.onload = () => {
	filedrop = document.getElementById('filedrop');
	sketch = document.getElementById('sketch');

	filedrop.onclick = handleClick;
	filedrop.ondragover = handleDragOver;
	filedrop.ondrop = handleDrop;

	sketch.onclick = () => console.log("SKETCH CLIC")
}

handleDragOver = (e) => {
	e.preventDefault();
}

handleDrop = (e) => {
	e.preventDefault();
	let item = e.dataTransfer.items[0];
	if(item.kind === 'file'){
		if (item.type.indexOf('image/') === 0) {
			imageFile = URL.createObjectURL(item.getAsFile());
			//new p5(sk, 'filedrop');
			console.log(imageFile);
		}else{
			console.log(item);
			console.log('Images, please.');
		}
	}else{
		item.getAsString(data => {
			console.log(data);
			testImage(data, 3000)
				.then(
					success => {
						console.log(success);
						imageFile = data;
						new p5(sk, 'sketch');
					}, 
					() => console.log("Can't and/or won't")
				);
		});
	}
}

handleClick = () => {
	let input = document.createElement("input");
	input.setAttribute("type", "file");
	input.setAttribute("accept", "image/*");
	input.onchange = handleFileSelect;
	input.click();

	function handleFileSelect(e){
		const file = e.target.files[0];
		
		if (file.type.match("image.*")) {
			const reader = new FileReader();
			reader.onload = (e) => {
				imageFile = e.target.result; 
				//new p5(sk, 'sketch');
				console.log(imageFile);
			};
			reader.readAsDataURL(file);
		}else{
			console.log('Images, please.');
		}
	}
}

toggleHidden = () => {
	filedrop.classList.toggle("hidden");
	sketch.classList.toggle("hidden");
}