/// <reference path="./node_modules/CordovaPlatformProject/src/CordovaProject.d.ts" />

var pp = require('CordovaPlatformProject');
var CordovaProject = pp.CordovaProject;
var et = require('elementtree');
var path = require('path');
var fs = require('fs');

var proj = null;
CordovaProject.create('test', 'net.robpaveza.testapiapp', 'Test Creation from API').then(function(project) {
	console.log('created "test"');
	proj = project;
	return project.addPlatform('windows@https://aka.ms/cordova-win10');
}).then(function(result) {
	console.log('added win10');
	return proj.addPlatform('android');
}).then(function(result) {
	console.log('added android');
	return proj.addPlugin('cordova-plugin-device');
}).then(function(result) {
	console.log('added cordova-plugin-device');
	
	var configPath = path.join(proj._path, 'config.xml');
	var contents = fs.readFileSync(configPath, 'utf-8');
    if(contents) {
        //Windows is the BOM. Skip the Byte Order Mark.
        contents = contents.substring(contents.indexOf('<'));
    }
    
	var doc = new et.ElementTree(et.XML(contents));
	var pref = new et.Element('preference');
	pref.attrib.name = 'windows-target-version';
	pref.attrib.value = '10.0';
	doc.getroot().append(pref);
	fs.writeFileSync(configPath, doc.write({indent: 4}), 'utf-8');
	
	console.log('Set windows-target-version to 10.0');
	return proj.build('windows');
}).then(function(result) {
	console.log('build success');
	return proj.run('windows', ['--', '--nobuild']);
}).then(function(result) {
	console.log('run success');
	return proj.getPlatforms();
}).then(function(platformList) {
	console.log('Detected platforms:');
	console.dir(platformList);
	return proj.getPlugins();
}).then(function(pluginList) {
	console.log('Detected plugins:');
	console.dir(pluginList);
});