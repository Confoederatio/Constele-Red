console.log(`global.path`, global.path);
var path = global.path;

function getClosest(arr, target) {
    return arr.reduce((prev, curr) =>
        Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
    );
}
function listFiles(dir) {
    return fs.readdirSync(dir).filter(file =>
        fs.statSync(path.join(dir, file)).isFile()
    );
}

var eoscala_years = listFiles(`./mapmodes/eoscala_data/gdp_ppp/`);

for (let i = 0; i < eoscala_years.length; i++) {
  eoscala_years[i] = eoscala_years[i].split("_");
  eoscala_years[i] = eoscala_years[i][eoscala_years[i].length - 1];
  eoscala_years[i] = eoscala_years[i].replace(".png", "");
}
console.log(eoscala_years, `Closest year: ${getClosest(eoscala_years, year)}`);

var closest_year = getClosest(eoscala_years, year);

clearMap();
new GeoPNG({
    file_path: './mapmodes/eoscala_data/gdp_ppp/gdp_ppp_' + closest_year + '.png',
    width: 4320,
    height: 2160,
    extent: [-180, -90, 180, 90],
    scaling: 0.05 // Z scale, where 1000 = 1m
    // format: 'int', // optional, default is 'int'
});