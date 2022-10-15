/**
 * @template T
 */
class SimpleStore {
    /** @type {Object<string, function(T, Object): T>} */
    mutations;

    /** @type {Subscriber} */
    events;

    /** @type {T} */
    state;

    /**
     * @param {T} state
     * @param {Object<string, function(T, Object): T>} mutations
     */
    constructor(state, mutations) {
        this.mutations = mutations;
        this.events = new Subscriber();

        this.state = state;
        console.log(this.state);
        /*
        let self = this;

        const setClosure = (state, key, value) => {
            console.log("Estado cambiando");
            console.log(self.state);

            state[key] = value;

            console.log(self.state);
            return true;
        };

        // @ts-ignore é un giorno tristissimo. única violación al sistema de tipado porque Proxy no deduce bien
        this.state = new Proxy(state, {
            set: setClosure
        });
        */
    }

    /**
     * 
     * @param {string} mKey 
     * @param {Object} payload 
     * @return {boolean}
     */
    commit(mKey, payload) {
        console.log("Corriendo commit");
        //this.state = Object.assign(this.state, this.mutations[mKey](this.state, payload));
        this.state = this.mutations[mKey](this.state, payload);
        this.events.publish('stateChange', this.state);
        return true;
    }
}

/**
 * @template Data
 * @template Ret
 */
class Subscriber {
    /** @type {Object.<string,(function(Data): Ret)[]>} */
    events = {};

    /**
     * @param {string} e 
     * @param {function(Data): Ret} cb 
     */
    subscribe(e, cb) {
        if (e in this.events)
            this.events[e].push(cb);
        else
            this.events[e] = [cb];
    }

    /**
     * @param {string} e 
     * @param {Data} data
     */
    publish(e, data) {
        if (e in this.events)
            for (const cb of this.events[e])
                cb(data);
    }
}