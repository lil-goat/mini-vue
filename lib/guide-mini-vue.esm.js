var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATE_COMPONENT"] = 2] = "STATE_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN";
    ShapeFlags[ShapeFlags["SLOT_CHILDREN"] = 16] = "SLOT_CHILDREN";
})(ShapeFlags || (ShapeFlags = {}));

const Fragment = Symbol('Fragment');
const Text = Symbol('Text');
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
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}
function getShapeFlags(type) {
    return typeof type === 'string'
        ? ShapeFlags.ELEMENT
        : ShapeFlags.STATE_COMPONENT;
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, name, props) {
    const slot = slots[name];
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode(Fragment, {}, slot(props));
        }
    }
}

const extned = Object.assign;
const isObject = (val) => {
    return val !== null && typeof val === 'object';
};
const hasChanged = (val, newVal) => !Object.is(val, newVal);
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

class ReactiveEffect {
    scheduler;
    _fn;
    deps = [];
    active = true;
    onStop;
    constructor(fn, scheduler) {
        this.scheduler = scheduler;
        this._fn = fn;
    }
    run() {
        activeEffect = this;
        const result = this._fn();
        activeEffect = null;
        return result;
    }
    stop() {
        if (this.active) {
            cleanUpEffect(this);
        }
        if (this.onStop) {
            this.onStop();
        }
        this.active = false;
    }
}
function cleanUpEffect(effect) {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
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
    trackEffects(Dep);
    return Dep;
}
function trackEffects(Dep) {
    if (activeEffect && activeEffect.active) {
        Dep.add(activeEffect);
        activeEffect.deps.push(Dep);
    }
}
let activeEffect;
function effect(fn, options = {}) {
    // fn
    const _effect = new ReactiveEffect(fn, options.scheduler);
    _effect.run();
    // extned options
    extned(_effect, options);
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
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

var RefFlags;
(function (RefFlags) {
    RefFlags["IS_REF"] = "__v_isRef";
})(RefFlags || (RefFlags = {}));
class refImpl {
    _value;
    Dep;
    _rawValue;
    __v_isRef = true;
    constructor(value) {
        this._rawValue = value;
        this._value = isObject(value) ? reactive(value) : value;
        this.Dep = new Set();
    }
    get value() {
        trackEffects(this.Dep);
        return this._value;
    }
    set value(newValue) {
        if (!hasChanged(this._rawValue, newValue))
            return;
        this._rawValue = newValue;
        this._value = isObject(newValue) ? reactive(newValue) : newValue;
        triggerEffects(this.Dep);
    }
}
function ref(value) {
    return new refImpl(value);
}
function isRef(ref) {
    return !!ref[RefFlags.IS_REF];
}
function unRef(ref) {
    return isRef(ref) ? ref.value : ref;
}
function proxyRef(ref) {
    return new Proxy(ref, {
        get(target, key) {
            // get -> age(ref) 那就返回.value
            // not ref -> value
            return unRef(Reflect.get(target, key));
        },
        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value))
                return target[key].value = value;
            else
                return Reflect.set(target, key, value);
        }
    });
}

function createComponentInstance(vnode, parent) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent,
        isMounted: false,
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
        setCurrentInstance(instance);
        // function or object
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        setCurrentInstance(null);
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function or object
    if (typeof setupResult === 'object') {
        instance.setupState = proxyRef(setupResult);
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const component = instance.type;
    instance.render = component.render;
}
let currentInstance = null;
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}

function provide(key, val) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        let { provides } = currentInstance;
        const parentProvides = currentInstance.parent.provides;
        // init
        if (provides === parentProvides)
            provides = currentInstance.provides = Object.create(parentProvides);
        provides[key] = val;
    }
}
function inject(key, defaultValue) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        const parentProvides = currentInstance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if (defaultValue) {
            if (typeof defaultValue === 'function')
                return defaultValue();
            else
                return defaultValue;
        }
    }
}

function createAppAPI(render) {
    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                // 先转换成vnode虚拟节点
                // component -> vnode
                // 所有的逻辑操作 都会基于vnode进行处理
                const vnode = createVNode(rootComponent);
                render(vnode, rootContainer);
            }
        };
    };
}

function createRenderer(options) {
    const { createElement: hostCreateElement, patchProps: hostPatchProps, insert: hostInsert } = options;
    function render(vnode, container, parentComponent) {
        // patch 
        // 
        patch(null, vnode, container, parentComponent);
    }
    // n1 -> old vnode
    // n2 -> new vnode
    function patch(n1, n2, container, parentComponent) {
        const { type, shapeFlag } = n2;
        // Fragment -> 只渲染children
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent);
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    // 处理组件
                    processElement(n1, n2, container, parentComponent);
                }
                else if (shapeFlag & ShapeFlags.STATE_COMPONENT) {
                    processComponent(n1, n2, container, parentComponent);
                }
                break;
        }
    }
    function processFragment(n1, n2, container, parentComponent) {
        mountChildren(n2, container, parentComponent);
    }
    function processText(n1, n2, container) {
        const { children } = n2;
        const textNode = (n2.el = document.createTextNode(children));
        container.append(textNode);
    }
    function processElement(n1, n2, container, parentComponent) {
        if (!n1) {
            mountElement(n2, container, parentComponent);
        }
        else {
            patchElement(n1, n2);
        }
    }
    function patchElement(n1, n2, container) {
        console.log('patch element');
        console.log('n1', n1);
        console.log('n2', n2);
        // props
        // children
    }
    function mountElement(vnode, container, parentComponent) {
        const el = (vnode.el = hostCreateElement(vnode.type));
        // string array
        const { children, props, shapeFlag } = vnode;
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            // string
            el.textContent = children;
        }
        else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            // vnode
            mountChildren(vnode, el, parentComponent);
        }
        // props
        for (const key in props) {
            const val = props[key];
            hostPatchProps(el, key, val);
        }
        hostInsert(el, container);
    }
    function mountChildren(vnode, container, parentComponent) {
        vnode.children.forEach(v => patch(null, v, container, parentComponent));
    }
    function processComponent(n1, n2, container, parentComponent) {
        mountComponent(n2, container, parentComponent);
    }
    function mountComponent(vnode, container, parentComponent) {
        const instance = createComponentInstance(vnode, parentComponent);
        setupComponent(instance);
        setupRenderEffect(instance, vnode, container);
    }
    function setupRenderEffect(instance, vnode, container) {
        effect(() => {
            if (!instance.isMounted) {
                const { proxy } = instance;
                const subTree = (instance.subTree = instance.render.call(proxy));
                // vnode -> patch
                // vnode -> element -> mountElement
                patch(null, subTree, container, instance);
                // element -> mount
                vnode.el = subTree.el;
                instance.isMounted = true;
            }
            else {
                const { proxy } = instance;
                const subTree = instance.render.call(proxy);
                const prevSubTree = instance.subTree;
                instance.subTree = subTree;
                patch(prevSubTree, subTree, container, instance);
            }
        });
    }
    return {
        createApp: createAppAPI(render)
    };
}

function createElement$1(type) {
    return document.createElement(type);
}
function patchProps$1(el, key, val) {
    const isOn = (key) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        el.addEventListener(key.slice(2).toLowerCase(), val);
    }
    else
        el.setAttribute(key, val);
}
function insert$1(el, container) {
    container.append(el);
}
const renderer = createRenderer({
    createElement: createElement$1,
    patchProps: patchProps$1,
    insert: insert$1
});
function createApp(...args) {
    return renderer.createApp(...args);
}

export { createApp, createRenderer, createTextVNode, getCurrentInstance, h, inject, provide, proxyRef, ref, renderSlots, renderer };
