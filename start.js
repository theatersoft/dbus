'use strict'

const
    {Bus} = require('@theatersoft/bus'),
    DBus = require('@theatersoft/dbus')

Bus.start().then(bus => new DBus(bus)._register())