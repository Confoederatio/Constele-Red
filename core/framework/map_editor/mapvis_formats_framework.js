//Initialise classes
//[WIP] - Refactor at a later point
class GeoPNG {
	constructor (arg0_options) {
		//Convert from parameters
		var options = arg0_options ? arg0_options : {};
		
		// Initialise options
		if (!options.extent) options.extent = [-180, -90, 180, 90];
		if (!options.format) options.format = "int"; // Default format
		if (!options.height) options.height = 4320;
		if (!options.scaling) options.scaling = 0.05;
		if (!options.width) options.width = 2160;
		
		//Declare local instance variables
		this.material = new THREE.MeshPhongMaterial();
		this.options = options;
		this.scene_config = {
			postProcess: {
				enable: true,
				antialias: { enable: true }
			}
		};
		this.three_layer = new maptalks.ThreeLayer(options.file_path, {
			forceRenderOnMoving: true,
			forceRenderOnRotating: true
		});
			this.three_layer.prepareToDraw = (gl, scene, camera) => {
				// Add light
				var light = new THREE.DirectionalLight(0xffffff);
				light.position.set(0, -10, 10).normalize();
				scene.add(light);
				
				// Extent
				var extent = new maptalks.Extent(...options.extent);
				
				// Create GeoPNG_Primitive, pass getRGBData as a function
				this.geopng_obj = new GeoPNG_Primitive(extent, {
					texture: options.file_path,
					imageWidth: options.width,
					imageHeight: options.height,
					getRGBData: this.getRGBData.bind(this)
				}, this.material, this.three_layer);
				
				this.three_layer.addMesh(this.geopng_obj);
				
				// Animation
				this.animation();
				
				// Set Z scale
				this.geopng_obj.getObject3d().scale.z = options.scaling / 1000;
			};
		
		//Add to group layer
		this.canvas = document.createElement("canvas");
		this.group_layer = new maptalks.GroupGLLayer(options.file_path, [this.three_layer], {
			sceneConfig: this.scene_config,
			single: false
		});
		this.group_layer.addTo(map, { single: false });
		this.tile_size = 256;
	}
	
	animation = () => {
		// Layer animation support for skipping frames
		this.three_layer._needsUpdate = !this.three_layer._needsUpdate;
		if (this.three_layer._needsUpdate) this.three_layer.redraw();
		requestAnimationFrame(this.animation);
	}
	
	static generateImage (arg0_image) {
		//Convert from parameters
		var image = arg0_image;
		
		//Internal guard clause if image is undefined
		if (!image) return null;
		var img;
		
		//Parse image based on type
		if (image instanceof HTMLCanvasElement) {
			img = new Image();
			img.src = image.toDataURL();
		} else if (image instanceof Image) {
			img = new Image();
			img.src = image.src;
			img.crossOrigin = image.crossOrigin;
		} else if (typeof image === "string") {
			img = new Image();
			img.src = image;
		}
		if (img && !img.crossOrigin) img.crossOrigin = "Anonymous";
		
		//Return statement
		return img;
	}
	
	getRGBData (arg0_image, arg1_width, arg2_height) {
		//Convert from parameters
		var image = arg0_image;
		var width = returnSafeNumber(arg1_width, this.tile_size);
		var height = returnSafeNumber(arg2_height, this.tile_size);
		
		//Declare local instance variables
		this.canvas.width = width;
		this.canvas.height = height;
		
		var ctx = this.canvas.getContext("2d");
			ctx.drawImage(image, 0, 0, width, height);
		
		//Return statement
		return ctx.getImageData(0, 0, width, height).data;
	}
}

//Quarantined primitive class
class GeoPNG_Primitive extends maptalks.BaseObject {
	constructor(extent, options, material, layer) {
		options = maptalks.Util.extend({}, {
			interactive: false,
			altitude: 0,
			imageWidth: 256,
			imageHeight: 256,
			texture: null,
			getRGBData: null
		}, options);
		
		const { texture, altitude, imageHeight, imageWidth, getRGBData } = options;
		if (!(extent instanceof maptalks.Extent)) {
			extent = new maptalks.Extent(extent);
		}
		const { xmin, ymin, xmax, ymax } = extent;
		const coords = [
			[xmin, ymin],
			[xmin, ymax],
			[xmax, ymax],
			[xmax, ymin]
		];
		let vxmin = Infinity, vymin = Infinity, vxmax = -Infinity, vymax = -Infinity;
		coords.forEach(coord => {
			const v = layer.coordinateToVector3(coord);
			const { x, y } = v;
			vxmin = Math.min(x, vxmin);
			vymin = Math.min(y, vymin);
			vxmax = Math.max(x, vxmax);
			vymax = Math.max(y, vymax);
		});
		const w = Math.abs(vxmax - vxmin), h = Math.abs(vymax - vymin);
		const rgbImg = GeoPNG.generateImage(texture);
		const geometry = new THREE.PlaneBufferGeometry(w, h, imageWidth - 1, imageHeight - 1);
		
		super();
		this._initOptions(options);
		this._createMesh(geometry, material);
		
		const z = layer.altitudeToVector3(altitude, altitude).x;
		const v = layer.coordinateToVector3(extent.getCenter(), z);
		this.getObject3d().position.copy(v);
		material.transparent = true;
		
		
		if (rgbImg && typeof getRGBData === "function") {
			material.opacity = 0;
			rgbImg.onload = () => {
				const width = imageWidth, height = imageHeight;
				const imgdata = getRGBData(rgbImg, width, height);
				
				// 1. Decode heights and compute log-heights for positive values
				const heights = [];
				const logHeights = [];
				let minLog = Infinity, maxLog = -Infinity;
				for (let i = 0, len = imgdata.length; i < len; i += 4) {
					const R = imgdata[i], G = imgdata[i + 1], B = imgdata[i + 2], A = imgdata[i + 3];
					const h = decodeRGBAAsNumber([R, G, B, A]);
					heights.push(h);
					if (h > 0) {
						const logh = Math.log10(h); // or Math.log(h) for natural log
						logHeights.push(logh);
						if (logh < minLog) minLog = logh;
						if (logh > maxLog) maxLog = logh;
					} else {
						logHeights.push(null);
					}
				}

// 2. Assign Z, color, and alpha using log-normalized value
				let idx = 0;
				const colorArray = new Float32Array((imgdata.length / 4) * 4); // RGBA
				for (let i = 0, len = imgdata.length; i < len; i += 4) {
					const h = heights[idx];
					let t = 0;
					if (h > 0) {
						const logh = logHeights[idx];
						t = (logh - minLog) / (maxLog - minLog || 1);
					}
					// Get Viridis color as RGB
					const color = d3.interpolateViridis(t);
					const rgb = d3.color(color);
					
					colorArray[idx * 4 + 0] = rgb.r / 255;
					colorArray[idx * 4 + 1] = rgb.g / 255;
					colorArray[idx * 4 + 2] = rgb.b / 255;
					colorArray[idx * 4 + 3] = h > 0 ? 1.0 : 0.0; // Alpha: 0 if h <= 0
					
					// Set Z as before
					geometry.attributes.position.array[idx * 3 + 2] = h;
					idx++;
				}
				
				geometry.setAttribute(
					'color',
					new THREE.BufferAttribute(colorArray, 4)
				);
				geometry.attributes.position.needsUpdate = true;
				geometry.attributes.color.needsUpdate = true;
				
				const shaderMaterial = new THREE.ShaderMaterial({
					uniforms: {
						globalOpacity: { value: 0.5 } // default to 50% opacity
					},
					vertexColors: true,
					transparent: true,
					vertexShader: `
                        varying vec4 vColor;
                        void main() {
                            vColor = color;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `,
					fragmentShader: `
                        uniform float globalOpacity;
                        varying vec4 vColor;
                        void main() {
                            float alpha = vColor.a * globalOpacity;
                            if (alpha < 0.01) discard;
                            gl_FragColor = vec4(vColor.rgb, alpha);
                        }
                    `
				});
				
				// Replace the mesh's material
				this.getObject3d().material = shaderMaterial;
			};
			rgbImg.onerror = function () {
				console.error(`not load ${rgbImg.src}`);
			};
		}
		// --- END OF BLOCK ---
	}
}