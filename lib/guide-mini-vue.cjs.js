'use strict';

var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATE_COMPONENT"] = 2] = "STATE_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN";
    ShapeFlags[ShapeFlags["SLOT_CHILDREN"] = 16] = "SLOT_CHILDREN";
})(ShapeFlags || (ShapeFlags = {}));

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null,
        shapeFlag: getShapeFlags(type)
    };
    // children
    if (typeof children === 'string') {
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
    }
    // 组件 + children object
    if (vnode.shapeFlag & ShapeFlags.STATE_COMPONENT) {
        if (typeof children === 'object') {
            vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN;
        }
    }
    return vnode;
}
function getShapeFlags(type) {
    return typeof type === 'string'
        ? ShapeFlags.ELEMENT
        : ShapeFlags.STATE_COMPONENT;
}

const extned = Object.assign;
const isObject = (val) => {
    return val !== null && typeof val === 'object';
};
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const toHandlerKey = (str) => {
    return 'on' + capitalize(str);
};
const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : '';
    });
};

const PublicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots
};
const PublicInstanceproxyHandlers = {
    get({ _: instance }, key) {
        // setupState
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = PublicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
    // attrs
}

const targetMap = new WeakMap();
function findDep(target, key) {
    let depMap = targetMap.get(target);
    if (!depMap) {
        depMap = new Map();
        targetMap.set(target, depMap);
    }
    let Dep = depMap.get(key);
    if (!Dep) {
        Dep = new Set();
        depMap.set(key, Dep);
    }
    return Dep;
}
function track(target, key) {
    const Dep = findDep(target, key);
    return Dep;
}
function trigger(target, key) {
    const Dep = findDep(target, key);
    triggerEffects(Dep);
}
function triggerEffects(Dep) {
    Dep.forEach(effect => {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else
            effect.run();
    });
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const readonlySet = (target, key, ...rest) => {
    console.warn(`key:${key}修改失败，因为target是readonly`, target);
    return true;
};
const shallowReadonyGet = createGetter(true, true);
function createGetter(isReadOnly = false, shallow = false) {
    return function (target, key) {
        if (key === ReactiveFlags.IS_REACTIVE)
            return !isReadOnly;
        else if (key === ReactiveFlags.IS_READONLY)
            return isReadOnly;
        const res = Reflect.get(target, key);
        if (!shallow && isObject(res))
            return isReadOnly ? readonly(res) : reactive(res);
        if (!isReadOnly) {
            track(target, key);
        }
        return res;
    };
}
function createSetter() {
    return function (target, key, value) {
        const res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}
const mutableHandlers = {
    get,
    set
};
const readOnlyHandlers = {
    get: readonlyGet,
    set: readonlySet
};
const shallowReadonlyHandlers = extned({}, readOnlyHandlers, {
    get: shallowReadonyGet
});

var ReactiveFlags;
(function (ReactiveFlags) {
    ReactiveFlags["IS_REACTIVE"] = "__v_isReactive";
    ReactiveFlags["IS_READONLY"] = "__v_isReadOnly";
})(ReactiveFlags || (ReactiveFlags = {}));
function reactive(raw) {
    return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createActiveObject(raw, readOnlyHandlers);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
}
function createActiveObject(raw, baseHandlers) {
    if (!isObject(raw)) {
        console.warn(`target ${raw} 必须是一个对象`);
        return;
    }
    return new Proxy(raw, baseHandlers);
}

function emit(instance, event, ...args) {
    console.log('trigger emit', event);
    // instance.props -> event
    const { props } = instance;
    // TPP
    // 先去写一个特定的行为 -> 重构成通用行为
    // add -> Add
    // add-foo -> AddFoo
    const key = toHandlerKey(camelize(event));
    const handler = props[key];
    handler && handler(...args); // if(handler) handler()
}

function initSlots(instance, children) {
    const { vnode } = instance;
    if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const value = children[key];
        // slot
        slots[key] = (props) => normalizeSlotValue(value(props));
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: () => { },
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    initSlots(instance, instance.vnode.children);
    initProps(instance, instance.vnode.props);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceproxyHandlers);
    const { setup } = component;
    if (setup) {
        // function or object
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function or object
    // TODO function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const component = instance.type;
    instance.render = component.render;
}

function render(vnode, container) {
    // patch 
    // 
    patch(vnode, container);
}
function patch(vnode, container) {
    const { shapeFlag } = vnode;
    if (shapeFlag & ShapeFlags.ELEMENT) {
        // 处理组件
        processElement(vnode, container);
    }
    else if (shapeFlag & ShapeFlags.STATE_COMPONENT) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = (vnode.el = document.createElement(vnode.type));
    // string array
    const { children, props, shapeFlag } = vnode;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // string
        el.textContent = children;
    }
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // vnode
        children.forEach(v => patch(v, el));
    }
    // props
    for (const key in props) {
        const val = props[key];
        const isOn = (key) => /^on[A-Z]/.test(key);
        if (isOn(key)) {
            el.addEventListener(key.slice(2).toLowerCase(), val);
        }
        else
            el.setAttribute(key, val);
    }
    container.append(el);
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container);
}
function setupRenderEffect(instance, vnode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container);
    // element -> mount
    vnode.el = subTree.el;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先转换成vnode虚拟节点
            // component -> vnode
            // 所有的逻辑操作 都会基于vnode进行处理
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, name, props) {
    const slot = slots[name];
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode('div', {}, slot(props));
        }
    }
}

exports.createApp = createApp;
exports.h = h;
exports.renderSlots = renderSlots;
