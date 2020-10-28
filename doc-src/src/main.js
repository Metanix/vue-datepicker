import Vue from 'vue';
import App from './App.vue';

import VueDatePicker from '../../'; // Prod
// import VueDatePicker from '../../src'; // Local

Vue.use(VueDatePicker);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
