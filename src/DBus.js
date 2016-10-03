import __dbus from 'dbus'

const
    _dbus = new __dbus(),
    _bus = _dbus.getBus('system')

export default class DBus {
    constructor (bus) {
        this.bus = bus
    }

    _register () {
        return this.bus.registerObject('DBus', this)
    }

    ping () {
        return 'ping'
    }
}
