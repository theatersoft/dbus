'use strict'

const
    {default: bus, proxy} = require('@theatersoft/bus'),
    dbus = proxy('DBus')

bus.start().then(() => {
    dbus.registerService('org.example')
        .then(res =>
            console.log('registerService returned', res))
        .catch(err =>
            console.log('registerService rejected', err))
})
