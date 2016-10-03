import {Bus} from '@theatersoft/bus'
import DBus from '@theatersoft/dbus'
Bus.start().then(bus => new DBus(bus)._register())