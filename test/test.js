'use strict'

const
    {Bus} = require('@theatersoft/bus'),
    DBus = Bus.proxy('DBus')

Bus.start().then((bus) => {
    DBus.ping()
        .then(res => {
            console.log('DBus.ping returned', res)
        })
})


