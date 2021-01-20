import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { outcomesFromString, applyFilters, generate, parseFilters } from './sequence.js';

export const app = Vue.createApp({
    data: function() { 
        return {
            outcomes: "a, b, c",
            length: 3,
            output: null,
            filters: []
        }
    },
    computed: {
        outcomeOptions: function() {
            return outcomesFromString(this.outcomes);
        }
    },
    methods: {
        generate: function() {
            let output = applyFilters(generate({ outcomes: this.outcomeOptions, length: this.length }), parseFilters(this.filters));
            console.log(output);
            this.output = output;
        },
        addFilter: function() {
            this.filters.push({id: uuidv4(), type: 'countLt', outcome: this.outcomeOptions[0], number: 2, componentType: 'relative'});
            this.generate();
        },
        applyFilter: function(filter) {
            for (let i = 0; i < this.filters.length; i++) {
                if (this.filters[i].id === filter.id) {
                    this.filters[i] = filter;
                }
            }
            console.log(filter);
            this.generate();
        },
        removeFilter: function(id) {
            this.filters = this.filters.filter(it => it.id !== id);
            this.generate();
        }
    }
})

const filterDisplay = {
    titles: {
        countlt: "Count Less Than",
        countgt: "Count Greater Than",
        counteq: "Count Equal To"
    },
    components: {
        countlt: "relative",
        countgt: "relative",
        counteq: "relative"
    }
}

app.component('filter-display', {
    props: ["filter", "outcomes", "apply", "remove"],
    data: function() {
        return {
            type: 'countlt',
            id: this.filter.id,
            changed: false,
        }
    },
    created() {
        this.filterDisplay = filterDisplay;
    },
    methods: {
        setDirty: function() {
            this.changed = true;
        },
        update: function() {
            this.changed = false;
            this.filter.type = this.type;
            this.apply({...this.filter});
        }
    },
    template: `
        <div>
            <h3 class="font-semibold text-sm text-gray-600 pb-3 pt-3 block text-center">{{ filterDisplay.titles[filter.type.toLowerCase()] }}</h3>
            <form @change="setDirty">
                <div class="grid grid-cols-2 gap-1">
                <label class="font-semibold text-sm text-gray-600 pb-1 block">Type</label>
                <select v-model="type" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm">
                    <option value="countlt">Count Less Than</option>
                    <option value="countgt">Count Greater Than</option>
                    <option value="counteq">Count Equal To</option>
                </select>
                </div>
                <component 
                    v-bind:outcomes="outcomes"
                    v-bind:setDirty="setDirty"
                    v-bind:update="update"
                    v-bind:filter="filter"
                    v-bind:is="'filter-' + filterDisplay.components[filter.type.toLowerCase()]">
                </component>
            </form>
            <div v-if="changed">
                <button class="text-sm text-blue-500 text-center inline-block w-full" @click="update">Apply Changes</button>
            </div>
            <button class="text-sm text-blue-500 text-center inline-block w-full" @click="remove(filter.id)">Remove Filter</button>
        </div>
    `
})

app.component('filter-relative', {
    props: ["filter", "outcomes", "update"],
    data: function() {
        return {
            count: this.filter.number,
            outcome: this.filter.outcome,
        }
    },
    methods: {
        cleanData: function() {
            let filter = { number: this.count, outcome: this.outcome }
            this.update(filter);
        },
        updateFilter: function() {
            this.filter.number = this.count;
            this.filter.outcome = this.outcome;
        }
    },
    template: `<div>
        <div class="grid grid-cols-2 gap-1">
        <label class="font-semibold text-sm text-gray-600 pb-1 block">Outcome</label>
        <select v-model="outcome" @change="updateFilter" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm">
            <option v-for="outcome of outcomes">{{outcome}}</option>
        </select>
        </div>
        <div class="grid grid-cols-2 gap-1">
        <label class="font-semibold text-sm text-gray-600 pb-1 block">Count</label>
        <input @change="updateFilter" v-model.number="count" type="number" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm"></form>
        </div>
</div>`
})

app.mount('#app')
