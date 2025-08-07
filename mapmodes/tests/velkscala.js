console.log(`global.path`, global.path);
var path = global.path;

function getClosest(arr, target) {
    return arr.reduce((prev, curr) =>
        Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
    );
}
function getHYDEYearName (arg0_year) {
  //Convert from parameters
  var year = parseInt(arg0_year);

  //Return statement
  return `${Math.abs(year)}${(year >= 0) ? "AD" : "BC"}`;
};
function listFiles(dir) {
    return fs.readdirSync(dir).filter(file =>
        fs.statSync(path.join(dir, file)).isFile()
    );
}

var eoscala_years = listFiles(`./mapmodes/velkscala_data/`);

for (let i = 0; i < eoscala_years.length; i++) {
  eoscala_years[i] = eoscala_years[i].split("_");
  eoscala_years[i] = eoscala_years[i][eoscala_years[i].length - 2].replace("AD", "").replace("BC", "");
  eoscala_years[i] = eoscala_years[i].replace(".png", "");
}
console.log(eoscala_years, `Closest year: ${getClosest(eoscala_years, year)}`);

var closest_year = getClosest(eoscala_years, year);

clearMap();
new GeoPNG({
    file_path: './mapmodes/velkscala_data/pop_' + getHYDEYearName(closest_year) + '_number.png',
    width: 4320,
    height: 2160,
    extent: [-180, -90, 180, 90],
    scaling: 20 // Z scale, where 1000 = 1m
    // format: 'int', // optional, default is 'int'
});