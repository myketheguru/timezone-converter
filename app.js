// fetch('https://www.timeapi.io/api/Time/current/zone?timeZone=Europe/Amsterdam').then(res => res.json())
// .then(data => {
//     console.log(data);
// })

async function fetchTimeZones () {
    let response = await fetch('https://worldtimeapi.org/api/timezone')
    return response.json()
}

async function convertTime (from, to) {
    let dateObj = new Date().toISOString().split('T')
    let date = dateObj[0]
    let time = dateObj[1].split('.')[0]
    let response = await fetch('https://cors-overlords.herokuapp.com/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: 'https://timeapi.io/api/Conversion/ConvertTimeZone/',
            data: {
                fromTimeZone: from,
                dateTime: `${date} ${time}`,
                toTimeZone: to,
                dstAmbiguity: ""
            }
        })
    })

    return response.json()
}

Vue.component('select-box', {
    props: ['options', 'default'],
    emits: ['time-zone'],
    data () {
        return {
            allOptions: this.options,
            selected: '',
            searchTerm: this.default,
            optionOpen: false
        }
    },
    methods: {
        setSelected (value) {
            this.selected = value;
            this.searchTerm = value;
            this.toggleOptions()
            this.$emit('time-zone', value)
        },
        filterOptions () {
            let options = this.options.filter(option => option.toLowerCase().includes(this.searchTerm.toLowerCase))
            this.allOptions = options
        },
        toggleOptions () {
            this.optionOpen = !this.optionOpen
        },
        timezones () {
            fetchTimeZones().then(d => {
                this.allOptions = d
            })
        },
    },
    mounted () {
        this.timezones()
    },
    template: `
    <div class="flex-auto flex flex-col items-center max-h-50 h-auto">
        <div class="flex flex-col items-center relative">
            <div class="w-full  svelte-1l8159u">
                <div class="my-2 bg-white p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <div class="flex flex-auto flex-wrap"></div>
                    <input class="p-1 px-2 h-10 text-lg appearance-none outline-none w-full text-gray-800  svelte-1l8159u" v-model="searchTerm" @input="filterOptions" @click="toggleOptions">
                    <div @click="searchTerm = ''">
                        <button class="cursor-pointer w-6 h-full flex items-center text-gray-400 outline-none focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x w-4 h-4">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200 svelte-1l8159u">
                        <button class="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none" @click="toggleOptions">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-up w-4 h-4" :class="optionOpen ? 'rotate-0' : 'rotate-180'">
                                <polyline points="18 15 12 9 6 15"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="optionOpen" class="absolute shadow top-100 z-40 w-full lef-0 rounded max-h-select overflow-y-auto svelte-5uyqqj">
                <div class="flex flex-col w-full">

                    <!-- Options Start -->
                    <div 
                        v-for="(option, index) in allOptions" 
                        :key="index" 
                        class="cursor-pointer w-full border-gray-100 border-b hover:bg-teal-100 " 
                        style=""
                        @click="setSelected(option)"
                    >
                        <div 
                            class="flex w-full items-center p-2 pl-2 border-transparent bg-white relative hover:bg-teal-600 hover:text-teal-100 border-teal-600"
                            :class="option === selected ? 'border-l-2' : ''"
                        >
                            <div class="w-full items-center flex">
                                <div class="mx-2 leading-6  ">{{ option }} </div>
                            </div>
                        </div>
                    </div>
                    <!-- Options End -->
                    
                </div>
            </div>
        </div>
    </div>
    `
  })


const app =  new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      options: ['obi', 'ada', 'kunle'],
      firstBox: Intl.DateTimeFormat().resolvedOptions().timeZone,
      secondBox: 'America/New_York',
      timeValue: ''      
    },
    methods: {
        handleFirst (data) {
            this.firstBox = data
            this.getTime(this.firstBox, this.secondBox)
        },
        handleSecond (data) {
            this.secondBox = data
            this.getTime(this.firstBox, this.secondBox)
        },
        getTime (first, second) {
            convertTime(first, second).then(data => {
                this.timeValue = data?.conversionResult?.time
            })
        }
    },
    created () {
        fetchTimeZones().then(d => {
            this.options = d
        }),
        this.getTime(this.firstBox, this.secondBox)
    },
  })
