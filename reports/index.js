const fs = require('fs');

fs.readFile('report-10000-joinmonster.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);

        const formatNumber = number => number.toLocaleString('sv-SE');

        jsonData.forEach(item => {
        const name = item.name;
        const p50 = formatNumber(item.histogram.json.p50);
        const mean = formatNumber(item.histogram.json.mean);

        console.log(`Name: ${name}`);
        console.log(`P50: ${p50}`);
        console.log(`Mean: ${mean}`);
        });
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
});
