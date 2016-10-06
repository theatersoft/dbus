'use strict'

const
    Bus = require('@theatersoft/bus').default,
    DBus = require('@theatersoft/dbus')

Bus.start().then(bus => new DBus(bus)._register())