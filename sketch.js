let filedrop;
let sketch;
let imageFile;

window.onload = () => {
	filedrop = document.getElementById('filedrop');
	sketch = document.getElementById('sketch');

	window.ondragover = (e) => e.preventDefault();
	window.ondrop = (e) => e.preventDefault();
	sketch.ondragover = (e) => e.preventDefault();
	sketch.ondrop = (e) => e.preventDefault();

	filedrop.onclick = handleClick;
	filedrop.ondragover = handleDragOver;
	filedrop.ondrop = handleDrop;

	
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
			new p5(tetrisSketch, 'sketch');
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
						new p5(tetrisSketch, 'sketch');
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
				new p5(tetrisSketch, 'sketch');
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

testImage = (url, timeoutT) => {
	return new Promise(function (resolve, reject) {
        var timeout = timeoutT || 5000;
        var timer, img = new Image();
        img.onerror = img.onabort = function () {
            clearTimeout(timer);
            reject("error");
        };
        img.onload = function () {
            clearTimeout(timer);
            resolve(img);
        };
        timer = setTimeout(function () {
            // reset .src to invalid URL so it stops previous
            // loading, but doesn't trigger new load
            img.src = "//!!!!/test.jpg";
            reject("timeout");
        }, timeout);
        img.src = url;
    });
}

const tetrisSketch = (p) => {
	let img;
	p.preload = () => {
		img = p.loadImage(imageFile, ()=>{}, 
			e => {
				const pic = e.target;
				pic.crossOrigin = null, pic.src = pic.src;
			}
		);
	}

	p.setup = () => {
		toggleHidden();
		p.createCanvas(sketch.offsetWidth, sketch.offsetHeight);
		p.noLoop();
	}

	p.draw = () => {
		const ratio = Math.min(p.width/img.width, p.height/img.height);
		p.image(img, (p.width-(img.width*ratio))/2, (p.height-(img.height*ratio))/2, img.width*ratio, img.height*ratio);
	}

	p.windowResized = () => {
		p.resizeCanvas(sketch.offsetWidth, sketch.offsetHeight);
	}
}