import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Practice from '../views/Practice.vue'
import Challenges from '../views/Challenges.vue'
import TeeTimeBooking from '../views/TeeTimeBooking.vue'
import ComponentCommunication from '../views/ComponentCommunication.vue'
import ReactiveData from '../views/ReactiveData.vue'
import JavaScriptPractice from '../views/JavaScriptPractice.vue'
import TestingPractice from '../views/TestingPractice.vue'
import DataFetching from '../views/DataFetching.vue'
import VueDebugging from '../views/VueDebugging.vue'
import CssBestPractices from '../views/CssBestPractices.vue'
import DebuggingExercises from '../views/DebuggingExercises.vue'
import AdvancedPatterns from '../views/AdvancedPatterns.vue'
import DebuggingSolutions from '../views/DebuggingSolutions.vue'
import VueCheatSheet from '../views/VueCheatSheet.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
    },
    {
      path: '/data-fetching',
      name: 'data-fetching',
      component: DataFetching
    },
    {
      path: '/vue-debugging',
      name: 'vue-debugging',
      component: VueDebugging
    },
    {
      path: '/css-best-practices',
      name: 'css-best-practices',
      component: CssBestPractices
    },
    {
      path: '/debugging-exercises',
      name: 'debugging-exercises',
      component: DebuggingExercises
    },
    {
      path: '/advanced-patterns',
      name: 'advanced-patterns',
      component: AdvancedPatterns
    },
    {
      path: '/debugging-solutions',
      name: 'debugging-solutions',
      component: DebuggingSolutions
    },
    {
      path: '/vue-cheat-sheet',
      name: 'vue-cheat-sheet',
      component: VueCheatSheet
    },
    {
      path: '/react-bugs',
      name: 'react-bugs',
      component: () => import('../views/ReactBugs.vue')
    },
    {
      path: '/javascript-bugs',
      name: 'javascript-bugs',
      component: () => import('../views/JavaScriptBugs.vue')
    },
    {
      path: '/dom-bugs',
      name: 'dom-bugs',
      component: () => import('../views/DomBugs.vue')
    }
  ]
})

export default router