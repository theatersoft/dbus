'use strict'
require('shelljs/make')

const
    path = require('path'),
    fs = require('fs'),
    rollup = require('rollup'),
    babel = require('rollup-plugin-babel'),
//babili = require('babel-preset-babili'),
    copyright = `/*
 Copyright (C) 2016 Theatersoft

 This program is free software: you can redistribute it and/or modify it under
 the terms of the GNU Affero General Public License as published by the Free
 Software Foundation, version 3.

 This program is distributed in the hope that it will be useful, but WITHOUT
 ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 details.

 You should have received a copy of the GNU Affero General Public License along
 with this program. If not, see <http://www.gnu.org/licenses/>
  */`,
    pkg = require('./package.json'),
    execo = c => exec(c, {silent: true}).trim(),
    liftUndefined = x => x === 'undefined' ? undefined : x,
    getVar = n => liftUndefined(execo('npm config get dbus:' + n)),
    DIST = getVar('dist') === 'true',
    plugins = DIST && [
            babel({
                babelrc: false,
                //exclude: 'node_modules/**',
                comments: false,
                minified: true,
                //presets: [babili],
                plugins: [
                    require("babel-plugin-minify-constant-folding"),
                    require("babel-plugin-minify-dead-code-elimination"),
                    require("babel-plugin-minify-flip-comparisons"),
                    require("babel-plugin-minify-guarded-expressions"),
                    require("babel-plugin-minify-infinity"),
                    require("babel-plugin-minify-mangle-names"),
                    require("babel-plugin-minify-replace"),
                    //FAIL require("babel-plugin-minify-simplify"),
                    require("babel-plugin-minify-type-constructors"),
                    require("babel-plugin-transform-member-expression-literals"),
                    require("babel-plugin-transform-merge-sibling-variables"),
                    require("babel-plugin-transform-minify-booleans"),
                    require("babel-plugin-transform-property-literals"),
                    require("babel-plugin-transform-simplify-comparison-operators"),
                    require("babel-plugin-transform-undefined-to-void")
                ]
            })
        ]

target.node = function () {
    console.log('target node')
    exec('mkdir -p dist')
    rollup.rollup({
            entry: 'src/DBus.js',
            external: Object.keys(pkg.dependencies),
            plugins
        })
        .then(bundle => {
            bundle.write({
                    dest: 'dist/dbus.js',
                    format: 'cjs',
                    moduleName: 'dbus',
                    banner: copyright,
                    sourceMap: DIST ? false : 'inline'
                })
                .then(() => console.log('wrote dist/dbus.js'))
        })
    rollup.rollup({
            entry: 'src/start.js',
            external: Object.keys(pkg.dependencies),
            plugins
        })
        .then(bundle => {
            bundle.write({
                    dest: 'dist/start.js',
                    format: 'cjs',
                    moduleName: 'dbus',
                    banner: copyright,
                    sourceMap: DIST ? false : 'inline'
                })
                .then(() => console.log('wrote dist/start.js'))
        })
}

target.watch = function () {
    require('watch')
        .watchTree('src', function (f, curr, prev) {
            if (typeof f === "object" && prev === null && curr === null) {
                // Finished walking the tree
            } else if (prev === null) {
                // f is a new file
            } else if (curr.nlink === 0) {
                // f was removed
            } else {
                // f was changed
                console.log(f)
                target.node()
            }
        })
}

target.package = function () {
    const p = Object.entries(pkg).reduce((o, [k, v]) => {
        if (!['private', 'devDependencies', 'scripts'].includes(k)) o[k] = v
        return o
    }, {})
    fs.writeFileSync('dist/package.json', JSON.stringify(p, null, '  '), 'utf-8')
    exec('sed -i "s|dist/||g" dist/package.json ')
    exec('cp LICENSE dist')
}

target.client = function () {
    console.log('target client')
    exec('cd test; ../node_modules/.bin/browserify client.js -d -v -o pub/test.js')
}

target.publish = function () {
    console.log('target publish')
    exec('npm publish --access=public dist')
}

target.all = function () {
    target.node()
    //target['node-es']()
    target.package()
}