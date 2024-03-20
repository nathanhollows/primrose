import { h } from 'vue'
import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
import { auth } from '../auth/auth'
import HomeView from '../views/HomeView.vue'
import ContactAddInteractionView from '../views/ContactAddInteractionView.vue'
import ContactEditView from '../views/ContactEditView.vue'
import ContactView from '../views/ContactView.vue'
import ContactsListView from '../views/ContactsListView.vue'
import ContactsNewView from '../views/ContactsNewView.vue'
import GroupsListView from '../views/GroupsListView.vue'
import SessionLoginView from '../views/SessionLoginView.vue'
import JournalView from '../views/JournalView.vue'
import SessionLogoutView from '../views/SessionLogoutView.vue'
import RegisterView from '../views/RegisterView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import SettingsView from '../views/SettingsView.vue'
import SearchView from '../views/SearchView.vue'
import RemindersView from '../views/RemindersView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/settings', component: SettingsView },
    // Contacts
    {
      path: '/contacts',
      component: { render: () => h(RouterView) },
      children: [
        { path: '', name: 'contacts', component: ContactsListView },
        { path: 'new', component: ContactsNewView },
        { path: ':id', component: ContactView },
        { path: ':id/edit', component: ContactEditView },
        {
          path: ':id/interaction',
          name: 'add-interaction',
          component: ContactAddInteractionView
        }
      ]
    },
    // Groups
    { path: '/groups', component: GroupsListView },
    // Reminders
    { path: '/reminders', name: 'reminders', component: RemindersView },
    // Journal
    {
      path: '/journal',
      component: { render: () => h(RouterView) },
      children: [
        { path: '', name: 'journal', component: JournalView },
        { path: ':date(\\d{4}-\\d{2}-\\d{2})', name: 'journalDated', component: JournalView }
      ]
    },
    // Search
    { path: '/search', component: SearchView },
    // Session
    { path: '/login', name: 'login', component: SessionLoginView, meta: { layout: 'session' } },
    { path: '/register', component: RegisterView, meta: { layout: 'session' } },
    { path: '/logout', component: SessionLogoutView, meta: { layout: 'session' } },
    // 404
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
  ]
})

router.beforeEach((to, from, next) => {
  if (!!auth.user || to.meta.layout === 'session') {
    next()
  } else {
    if (to.meta.layout === 'session') {
      next()
    } else {
      next({ name: 'login' })
    }
  }
})

export default router
