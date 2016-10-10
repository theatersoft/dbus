'use strict'

const
    {default: bus, proxy} = require('@theatersoft/bus'),
    dbus = proxy('DBus')

bus.start().then(() => {
    const
        service = 'org.example',
        path = '/org/example/echo',
        name = 'org.example.Echo'
    bus.registerObject('Echo', new Echo())
        .then(() =>
            dbus.registerObject({service, path, name}, 'Echo', __Echo__types))
        .then(() =>
            dbus.callMethod({service, path, name}, 'echo', ['test']))
        .then(res =>
            console.log('returned', res))
        .catch(err =>
            console.log('rejected', err))
})


class Echo {
    echo (s) {
        console.log('Echo.echo', s)
        return s.toUpperCase()
    }
}

const __Echo__types = {
    echo: {in: [{type: 's', name: 'str'}], out: {type: 's'}},
}

/*
<interface name="org.example.Echo">
<method name="echo">
<arg direction="in" type="s" name="str"/>
<arg direction="out" type="s"/>
</method>
</interface>
*/