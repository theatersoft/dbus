import bus, {proxy} from '@theatersoft/bus'
import __dbus from 'dbus'

const
    _dbus = new __dbus(),
    _system = _dbus.getBus('system')

const
    getInterface = ({service, path, name}) => new Promise((r, j) =>
        _system.getInterface(service, path, name, (err, intf) => {
            if (err) j(err)
            else r(intf)
        })),
    getProperty = (_intf, property) => new Promise((r, j) =>
        _intf.getProperty(property, (err, value) => {
            if (err) j(err)
            else r(value)
        })),
    setProperty = (_intf, property, value) => new Promise((r, j) =>
        _intf.setProperty(property, value, err => {
            if (err) j(err)
            else r()
        })),
    callMethod = (_intf, method, args) => {
        method = _intf[method] //// TODO
        return new Promise((r, j) => {
            method.finish = ret => r(ret)
            method.error = err => j(err)
            method.apply(_intf, args)
        })
    }

export default class DBus {
    constructor () {
    }

    _register () {
        return bus.registerObject('DBus', this)
    }

    getInterface (service, path, name) {
        const _intf = getInterface(service, path, name)
        //TODO introspection
    }

    getProperty (intf, property) {
        console.log('getProperty', intf, property)
        return getInterface(intf).then(_intf => getProperty(_intf, property))
    }

    setProperty (intf, property, value) {
        return getInterface(intf).then(_intf => setProperty(_intf, property, value))
    }

    callMethod (intf, method, args) {
        return getInterface(intf).then(_intf => callMethod(_intf, method, args))
    }

    registerService (service, bus = 'system') {
        const
            _service = dbus.registerService(bus, service) // TODO
    }

    // e.g. {service: 'org.example', path: '/org/example/Agent, name: 'org.bluez.Agent1'}
    registerObject ({service, path, name}, busName, busIntf) {
        const
            _service = _dbus.registerService('system', service), // TODO
            _obj = _service.createObject(path),
            _intf = _obj.createInterface(name)
        obj = proxy(busName)
        Object.keys(busIntf).forEach(method => {
            const
                opts = busIntf[method],
                argc = opts['in'] ? opts['in'].length : 0
            _intf.addMethod(method, opts, (...args) => {
                obj[method](...(args.slice(0, argc)))
                    .then(res =>
                        args[argc](res))
                    .catch(err => {
                        console.error('dbus proxy method rejected', err)
                        throw err
                    })
            })
        })
        _intf.update()
    }
}
