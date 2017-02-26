'use strict'

const
    {bus, proxy} = require('@theatersoft/bus'),
    dbus = proxy('DBus'),
    intf = {
        service: 'com.theatersoft',
        path: '/com/theatersoft/echo',
        name: 'com.theatersoft.Echo'
    }

bus.start().then(() => {
        dbus.callMethod(intf, 'echo', ['test'])
        .then(res =>
            console.log('returned', res))
        .catch(err =>
            console.log('rejected', err))
})
