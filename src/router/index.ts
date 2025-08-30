import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Practice from '../views/Practice.vue'
import Challenges from '../views/Challenges.vue'
import TeeTimeBooking from '../views/TeeTimeBooking.vue'
import ComponentCommunication from '../views/ComponentCommunication.vue'
import ReactiveData from '../views/ReactiveData.vue'
import JavaScriptPractice from '../views/JavaScriptPractice.vue'
import TestingPractice from '../views/TestingPractice.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/practice',
      name: 'practice',
      component: Practice
    },
    {
      path: '/challenges',
      name: 'challenges',
      component: Challenges
    },
    {
      path: '/tee-time-booking',
      name: 'tee-time-booking',
      component: TeeTimeBooking
    },
    {
      path: '/component-communication',
      name: 'component-communication',
      component: ComponentCommunication
    },
    {
      path: '/reactive-data',
      name: 'reactive-data',
      component: ReactiveData
    },
    {
      path: '/javascript-practice',
      name: 'javascript-practice',
      component: JavaScriptPractice
    },
    {
      path: '/testing-practice',
      name: 'testing-practice',
      component: TestingPractice
    }
  ]
})

export default router