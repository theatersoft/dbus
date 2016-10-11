'use strict'

const
    {default: bus, proxy} = require('@theatersoft/bus'),
    dbus = proxy('DBus'),
    intf = {
        service: 'com.theatersoft',
        path: '/com/theatersoft/echo',
        name: 'com.theatersoft.Echo'
    }

bus.start().then(() => {
    bus.registerObject('Echo', new Echo())
        .then(() =>
            dbus.registerObject(intf, 'Echo', __Echo__types))
        //.then(() =>
        //    dbus.callMethod(intf, 'echo', ['test']))
        .then(res =>
            console.log('returned', res))
        .catch(err =>
            console.log('rejected', err))
})

class Echo {
    echo (str) {
        console.log('Echo.echo', str)
        return str.toUpperCase()
    }
}

const __Echo__types = {
    echo: {in: [{type: 's', name: 'str'}], out: {type: 's'}},
}
