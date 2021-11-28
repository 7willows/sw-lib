import { Component, h } from 'preact';
import * as _ from 'lodash';

export function component({ init, update, view, PropChange }) {
    let preactSetState;
    let state;

    function setState(s) {
        state = s;
        preactSetState({ states: [s] });
    }

    function getState() {
        return state;
    }

    function runUpdate(cmp, msg) {
        const updateResult = update(getState(), msg);
        if (updateResult === undefined) {
            throw new Error('update should cover all cases');
        }
        const [newState, next] = updateResult;
        setState(newState);

        runNext(cmp, next);
    }

    function runNext(cmp, next) {
        if (next instanceof Event) {
            const host = cmp.ref.getRootNode().host;

            if (!host) {
                cmp.ref.dispatchEvent(next);
            } else {
                host.dispatchEvent(next);
            }

            return;
        }
        Promise.resolve(next)
            .then(maybeMsg => {
                if (maybeMsg !== null) {
                    runUpdate(maybeMsg);
                }
            })
            .catch(err => {
                console.error(err);
                throw new Error('update promise should never throw');
            });
    }

    const dispatcher = (cmp, msgFactory) => {
        return async function(event) {
            const msg = getOrCall(msgFactory, event);
            runUpdate(cmp, msg);
        };
    };

    class App extends Component {
        constructor() {
            super();
            preactSetState = this.setState.bind(this);
            const [state, next] = init(dispatcher);
            setState(state);
            runNext(next);
            this.initialRenderComplete = false;
        }

        shouldComponentUpdate(nextProps) {
            if (!PropChange) {
                return;
            }
            const allPropNames = _.uniq(Object.keys(this.props).concat(Object.keys(nextProps)));

            allPropNames.forEach((propName) => {
                if (!_.isEqual(this.props[propName], nextProps[propName])) {
                    runUpdate(this, new PropChange(propName, nextProps[propName]));
                }
            });
        }

        render(props) {
            if (!this.initialRenderComplete && PropChange) {
                this.initialRenderComplete = true;
                Object.keys(props).forEach(propName => {
                    runUpdate(this, new PropChange(propName, props[propName]));
                });
            }
            const state = getState();
            const arr = view(state);
            const rendered = toVNode(arr, dispatcher.bind(null, this));
            rendered.ref = ref => this.ref = ref;
            return rendered;
        }
    }

    return App;
}

function getOrCall(item, ...args) {
    if (typeof item === 'function') {
        return item(...args);
    } else {
        return item;
    }
}

function toVNode(item, dispatcher) {
    let mapFunc;

    if (item.mapFunc && item.view) {
        mapFunc = item.mapFunc;
        item = item.view;
    }

    const el = item[0];
    let opts = item[1];
    let content = item[2];

    if (!content) {
        if (Array.isArray(opts)) {
            content = opts;
            opts = {};
        } else if (opts instanceof Object) {
            content = [];
        } else {
            content = opts;
            opts = {};
        }
    }
    const { nodeName, id, classes } = parseElement(el);

    if (id) {
        opts.id = opts.id ?? id;
    }

    if (classes && classes.length > 0) {
        const allClasses = classes.concat((opts.className ?? '').split(' ').filter((x) => x));
        opts.className = allClasses.join(' ');
    }

    Object.keys(opts ?? {}).forEach(prop => {
        if (prop.slice(0, 2) === 'on') {
            if (mapFunc) {
                const originalPropValue = opts[prop];
                opts[prop] = dispatcher((event) => {
                    const msg = getOrCall(originalPropValue, event);
                    return mapFunc(msg);
                });
            } else {
                opts[prop] = dispatcher(opts[prop]);
            }
        }
    });

    if (Array.isArray(content)) {
        content = content
            .filter(item => item)
            .map(child => {
                if (mapFunc) {
                    child = { mapFunc, view: child };
                }
                if (Array.isArray(child) || (child.mapFunc && child.view)) {
                    return toVNode(child, dispatcher);
                }
                // it's already a VNode
                return child;
            });
    }

    return h(nodeName, opts, content);
}

export function mapMsg(mapFunc, view) {
    return {
        mapFunc,
        view
    };
}

export function unmapMsg(msgPromise, Wrapper) {
    if (!msgPromise) {
        return null;
    }
    return Promise.resolve(msgPromise).then((subMsg) => new Wrapper(subMsg));
}


function parseElement(el) {
    const nodeName = el.split('.')[0] || 'div';
    const { classes, id } = el
        .split(/(#[a-zA-Z0-9\-_]+)|(\.[a-zA-Z0-9\-_]*)/g) // split into "#abc" and ".abc" parts
        .filter(x => x)
        .reduce((acc, item) => {
            if (item[0] === '#') {
                acc.id = item.slice(1);
            } else if (item[0] === '.') {
                acc.classes.push(item.slice(1));
            }
            return acc;
        }, { classes: [], id: '' });

    return {
        nodeName,
        id,
        classes
    };
}