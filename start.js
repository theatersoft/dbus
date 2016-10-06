'use strict'

const
    bus = require('@theatersoft/bus').default,
    DBus = require('@theatersoft/dbus')

bus.start().then(() => new DBus()._register())