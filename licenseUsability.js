let packageJson = require('../package.json');

module.exports = function() {
	let depsTitle = 'dependencies';
	let devDepsTitle = 'devDependencies';
	let dependencies = [];
	let devDependencies = [];

	// *** Mapping ***
	dependencies = mapDependenciesLicenses(packageJson, depsTitle);
	devDependencies = mapDependenciesLicenses(packageJson, devDepsTitle);

	// *** Validators ***
	let isProjectPackageJSON = true;
	validateLicenseByPackage(packageJson, isProjectPackageJSON);
	validateDependenciesLicenses(dependencies, depsTitle);
	validateDependenciesLicenses(devDependencies, devDepsTitle);

};

let mapDependenciesLicenses = function(pkg, title) {
	let mappedDependencies = [];
	if (pkg) {
		if (title === 'dependencies' || title === 'devDependencies') {
			// Map Dependencies Names
			for (let dependency in pkg[title]) {
				// Only props on the obj itself & not the prototype
				if (pkg[title].hasOwnProperty(dependency)) {
					mappedDependencies.push({
						'name': dependency
					});
				}
			}
			// Map Dependencies Licenses
			for (let i = 0; i < mappedDependencies.length; i++) {
				let depPackage = require('../node_modules/' + mappedDependencies[i].name + '/package');
				mappedDependencies[i]['license'] = depPackage.license;
			}
			return mappedDependencies;
		}
	}
};




let validateLicenseByPackage = function(pkg, isProjectPackageJSON) {
	let redText = '\x1b[31m%s\x1b[0m';
	if (!pkg) {
		return;
	}
	// Check License is defined
	if (!pkg.license || pkg.license.length === 0) {
		if (isProjectPackageJSON) {
			console.log(redText, ' LICENSE is undefined for ' + pkg.name + ', It is recommended to set a license for your program');
		} else {
			console.log(redText, ' LICENSE is undefined for ' + pkg.name + ', Please visit the Package \n' +
								' website and verify it is a license you can use');
		}
	} else {
		// Handle white spaces before / after & more text after first word pattern is trimmed
		if (pkg.license.indexOf(' ') !== -1) {
			pkg.license = handleSpaceBeforeText(pkg.license);
			pkg.license = handleMoreTextAfterFirstWord(pkg.license);
		}

		pkg.license.toUpperCase();
		// Friendly console print for each License
		printLicenseUsability(pkg);
	}
};

let validateDependenciesLicenses = function(dependencies, title) {
	console.log('\n * * * ' + title.toUpperCase() + ' License Usability * * *');
	dependencies.forEach((pkg) => {
		validateLicenseByPackage(pkg);
	});
};

let printLicenseUsability = function(pkg) {
	let greenText = '\x1b[32m%s\x1b[0m'; // Approved for use
	let redText = '\x1b[31m%s\x1b[0m'; // Warning to use / verify usability
	let yellowText = '\x1b[33m%s\x1b[0m'; // Not Classified by me yet

	switch (pkg.license) {
		case 'MIT':
			console.log(greenText, '\n '  + pkg.name + ' --> You are using MIT License, this is a permissive free software license, \n' +
				' it permits reuse within proprietary software provided that all copies of the \n' +
				' licensed software include a copy of MIT License terms & copyright notice \n');
			break;

		case 'Apache-2.0':
			console.log(greenText, ' ' + pkg.name + ' --> You are using Apache-2.0 License, this is a permissive free software license \n' +
						' written by the Apache Software Foundation. version 2.0 requires preservation of the \n' +
						' copyright notice and disclaimer. Like other free software licenses, the license allows \n' +
						' the user of the software the freedom to use the software for any purpose, to \n' +
						' distribute it, to modify it, and to distribute modified versions of the software, \n' +
						' under the terms of the license, without concern for royalties.\n');
			break;

		case 'ISC':
			console.log(yellowText, ' ' + pkg.name + ' --> Your using ISC License \n');
			break;

		case 'GPL':
			console.log(yellowText, ' ' + pkg.name + ' --> Your using GPL License \n');
			break;

		case 'LGPL':
			console.log(yellowText, ' ' + pkg.name + ' --> Your using LGPL License \n');
			break;

		case 'Proprietary':
			console.log(yellowText, ' ' + pkg.name + ' --> Your using Proprietary License \n');
			break;

		case 'BSD-3-Clause':
			console.log(greenText, ' '+ pkg.name + ' --> You are using BSD-3-CLAUSE License, you can use it for \n ' +
							' commercial use, modify and distribute it, need to give copyright \n' +
							' credit and include the original license in source code \n');
			break;

		case 'Apache':
			console.log(yellowText, ' '+ pkg.name + ' --> Your using Apache License \n');
			break;

		default:
			console.log(yellowText, ' In ' + pkg.name + ' --> Your ' + pkg.license +
						' License was not recognized, please contact the creator \n' +
						' of this library if you think this message is wrong \n');
	}
};

// *** Handlers ***
let handleMoreTextAfterFirstWord = function(pkgLicense) {
	let packageLicense;
	let noSpacesAfterPkgLicense;
	if (pkgLicense.indexOf(' ')) {
		packageLicense = pkgLicense.substring(0, pkgLicense.indexOf(' '));
		noSpacesAfterPkgLicense = packageLicense;
		return noSpacesAfterPkgLicense;
	}
	return pkgLicense;
};

let handleSpaceBeforeText = function(pkgLicense) {
	let packageLicense;
	let noSpacesBeforePkgLicense;
	// Handle case of all spaces before any other First character
	if (pkgLicense.indexOf(' ') === 0) {
		packageLicense = pkgLicense.replace(/[\s]*/, '');
		noSpacesBeforePkgLicense = packageLicense;
		return noSpacesBeforePkgLicense;
	}
	return pkgLicense;
};
