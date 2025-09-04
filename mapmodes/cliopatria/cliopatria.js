global.cliopatria_obj = JSON.parse(fs.readFileSync("./mapmodes/cliopatria/cliopatria_polities_only.geojson", "utf8"));

if (global.year == undefined) global.year = 2000;

//Iterate over all features after clearing map
clearMap();

for (let i = 0; i < cliopatria_obj.features.length; i++) {
	let local_feature = cliopatria_obj.features[i];
}

window.alert("This mapmode is not yet complete.");