console.log(`global.path`, global.path);
var path = global.path;

function getClosest(arr, target) {
    return arr.reduce((prev, curr) =>
        Math.abs(curr.year - target) < Math.abs(prev.year - target) ? curr : prev
    );
}
function getHYDEYearName(arg0_year) {
    var year = parseInt(arg0_year);
    return `${Math.abs(year)}${year >= 0 ? "AD" : "BC"}`;
}
function listFiles(dir) {
    return fs.readdirSync(dir).filter(file =>
        fs.statSync(path.join(dir, file)).isFile()
    );
}
function extractYearFromFilename(filename) {
    // Matches __2000BC_ or __1000AD_ etc.
    const match = filename.match(/__(\d+)(BC|AD)_/);
    if (!match) return null;
    let year = parseInt(match[1], 10);
    if (match[2] === "BC") year = -year;
    return year;
}

var eoscala_files = listFiles(`./mapmodes/velkscala_data/`);
var eoscala_years = [];
for (let i = 0; i < eoscala_files.length; i++) {
    let year = extractYearFromFilename(eoscala_files[i]);
    if (year !== null) {
        eoscala_years.push({ year: year, filename: eoscala_files[i] });
    }
}

var closest = getClosest(eoscala_years, year);

console.log(
    eoscala_years.map(obj => obj.year),
    `Closest year: ${closest.year}`
);

console.log(
    `Loading ./mapmodes/velkscala_data/${closest.filename}`
);
clearMap();
new GeoPNG({
    file_path: './mapmodes/velkscala_data/' + closest.filename,
    width: 4320,
    height: 2160,
    extent: [-180, -90, 180, 90],
    scaling: 20 // Z scale, where 1000 = 1m
    // format: 'int', // optional, default is 'int'
});