var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { 'title': 'Is my data big?' });
});

results = {
    'tiny': 'Your data is <span class="result-result">tiny</span>.<br/>' +
	'<p class="note">We are sorry.</p>',
    'small': 'Your data is <span class="result-result">small</span>.<br/>' +
	'<p class="note">But it can still be useful!</p>',
    'medium': 'Your data is <span class="result-result">not big</span>.<br/>' +
	'<p class="note">You can probably analyze it on a single computer.</p>',
    'biggish': 'Your data is <span class="result-result">biggish</span>.<br/>' +
	'<p class="note">You can still rent a machine in the ' +
	'cloud that can just load all of it at once.</p>',
    'big': 'Congratulations, your data is <span class="result-result">big</span>.<br/>' +
	'<p class="note">But there is still a good ' +
	'chance that you can analyze it on a regular computer. Often you ' +
	'can simply drop irrelevant variables. Or try sampling, ' +
	'you can fit good predictive models with just ' +
	'1% of the data! Explore these options before buying a ' +
	'huge computer cluster and hiring a team of 10 to manage it.</p>',
    'huge': 'You are kidding, right?',
    'unknown': 'Can you please just behave yourself and use the form to select the unit? Thanks much!',
    'nodata': 'So you have no data? That\'s OK, you can still live a happy life.'
};

router.get("/result", function(req, res, next) {
    var size = req.query.size;
    var unit = req.query.unit;
    var result = classify_size(size, unit);
    res.render('result', { 'title': 'Tadaaaaam',
			   'size': size,
			   'unit': unit,
			   'result': results[result] });
});

// We just calculate in TB
function classify_size(size, unit) {
    if (unit == 'MB') {
	size = size / 1000 / 1000;
    } else if (unit == 'GB') {
	size = size / 1000;
    } else if (unit == 'PB') {
	size = size * 1000;
    } else if (unit == 'EB') {
	size = size * 1000 * 1000;
    } else if (unit == 'ZB') {
	size = size * 1000 * 1000 * 1000;
    } else if (unit == 'YB') {
	size = size * 1000 * 1000 * 1000 * 1000;
    } else if (unit == 'TB') {
	// do nothing, in TB
    } else {
	return 'unknown';
    }

    // Unit is TB now
    if (size == 0) {
	return 'nodata';
    } else if (size < .1) {
	return 'tiny';
    } else if (size < .5) {
	return 'small';
    } else if (size < 1) {
	return 'medium';
    } else if (size < 2) {
	return 'biggish';
    } else if (size < 1000 * 1000) {
	// 1000 PB (eBay has a 90PB data warehouse....)
	return 'big';
    } else {
	return 'huge';
    }
}

module.exports = router;
