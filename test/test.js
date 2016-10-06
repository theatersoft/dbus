'use strict'

const
    {default: bus, proxy} = require('@theatersoft/bus'),
    dbus = proxy('DBus'),
    networkManager = {
        service: 'org.freedesktop.NetworkManager',
        path: '/org/freedesktop/NetworkManager',
        name: 'org.freedesktop.NetworkManager'
    }

bus.start().then(() => {
    dbus.getProperty(networkManager, 'NetworkingEnabled')
        .then(res =>
            console.log('1. getProperty NetworkingEnabled returned', res))
        .catch(err =>
            console.log('1. getProperty NetworkingEnabled rejected', err))
})

/*
 dbus-send --system --print-reply \
 >             --dest=org.freedesktop.NetworkManager \
 >             /org/freedesktop/NetworkManager \
 >             org.freedesktop.DBus.Properties.Get \
 >             string:"org.freedesktop.NetworkManager" \
 >             string:"NetworkingEnabled"
 */