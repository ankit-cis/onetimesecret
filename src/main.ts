import GlobalBroadcast from '@/components/GlobalBroadcast.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import router from '@/router'
import Dashboard from '@/views/Dashboard.vue'
import Homepage from '@/views/Homepage.vue'
import { Component, createApp, defineAsyncComponent, ref } from 'vue'

import './style.css'


/**
 * Main page component
 *
 * Each page generally has a main component that is mounted to
 * the root element (`<div id="app"></div>`) in the HTML template
 * generated by the ruby Rack app. The server injects the name of
 * the component to mount as a global variable "vue_component_name".
 * If that variable is not present, that means there is no main
 * Vue component on the page. In that case we skip ahead to creating
 * and mounting the common components which are part of the layout
 * (i.e. in the header or footer templates).
 *
 *    class NiceView < Onetime::App::View
 *      self.vue_component_name = 'Homepage'
 *    end
 *
 *    componentMap['Homepage']  #=> Homepage
 *
 */


/**
 * About Auto vs Lazy loading
 *
 * When components are auto-loaded instead of lazy-loaded, there are a few
 * potential reasons why they might not display correctly:
 *
 * 1. **Dependencies and Timing:**
 *    Auto-loaded components are imported and initialized immediately when the
 *    application starts. If these components have dependencies that are not
 *    yet available or initialized, they might not function correctly.
 *
 * 2. **Component Lifecycle:**
 *    Lazy-loaded components are only imported when they are needed, which can
 *    help ensure that all necessary dependencies and context are available.
 *    Auto-loading might bypass some of these checks.
 *
 * 3. **Route Parameters and Initialization:**
 *    Components that rely on route parameters (e.g., to determine the active
 *    domain) might encounter issues if they are auto-loaded. This is because
 *    the route parameters might not be available or fully resolved at the time
 *    the component is initialized. Lazy loading ensures that the component is
 *    only initialized after the route has been fully resolved, preventing such
 *    issues.
**/
type ComponentMap = {
  [key: string]: Component | (() => Promise<Component>)
}

const componentMap: ComponentMap = {
  // Auto-load default and the most common pages
  'Homepage': Homepage,
  'Dashboard': Dashboard,

  // Lazy-load the rest of the pages
  'AccountDomains': defineAsyncComponent(() => import('@/views/account/AccountDomains.vue')),
  'AccountDomainAdd': defineAsyncComponent(() => import('@/views/account/AccountDomainAdd.vue')),
  'AccountDomainVerify': defineAsyncComponent(() => import('@/views/account/AccountDomainVerify.vue')),

  'Account': defineAsyncComponent(() => import('@/views/account/AccountIndex.vue')),
  'Shared': defineAsyncComponent(() => import('@/views/Shared.vue')),
  'Private': defineAsyncComponent(() => import('@/views/Private.vue')),
  //'Pricing': defineAsyncComponent(() => import('@/views/Pricing.vue')),
  'Pricing': defineAsyncComponent(() => import('@/views/PricingDual.vue')),
  //'Signup': defineAsyncComponent(() => import('@/views/Signup.vue')),
  'Feedback': defineAsyncComponent(() => import('@/views/Feedback.vue')),
  'Forgot': defineAsyncComponent(() => import('@/components/PasswordStrengthChecker.vue')),
}

/**
 * Hybrid SPA / Server-Rendered Page Initialization
 *
 * This code handles the initialization of our application, which uses a hybrid
 * approach combining Single Page Application (SPA) features with traditional
 * server-rendered pages. This approach allows for a gradual transition from a
 * fully server-rendered site to a more modern SPA architecture.
 *
 * The process works as follows:
 *
 * 1. If the current page has a corresponding Vue route:
 *    - We initialize the full Vue app with routing capabilities.
 *    - This allows for client-side navigation between Vue-powered pages.
 *
 * 2. If the current page doesn't have a Vue route, but has a Vue component:
 *    - We fall back to the older method of mounting a single Vue component.
 *    - This preserves functionality for pages that have been partially
 *      upgraded.
 *
 * 3. If neither a route nor a component exists:
 *    - The page remains a traditional server-rendered page.
 *
 * Short-term benefits:
 * - Allows use of Vue Router for navigation on new, Vue-powered pages.
 * - Maintains compatibility with existing server-rendered and partially-
 *   upgraded pages.
 * - Enables incremental migration to a full SPA architecture.
 *
 * Long-term considerations:
 * - This hybrid approach may lead to inconsistent user experiences between
 *   different parts of the site.
 * - As more pages are converted to Vue components, the codebase should be
 *   refactored towards a full SPA model.
 *
 * @param {string} vueComponentName - The name of the Vue component for the
 *                                    current page, set by the server.
 */

const DefaultApp = {
  template: '<div id="app"><router-view></router-view></div>'
}

const vueComponentName = window.vue_component_name as string | "";

if (router.hasRoute(vueComponentName)) {
  const app = createApp(DefaultApp)
  app.use(router)
  app.mount('#app')
  router.push({ name: vueComponentName })
} else {
  console.warn(`No route found for component: ${vueComponentName}`)

  if (vueComponentName in componentMap) {


    const Component = componentMap[vueComponentName]
    const pageContentApp = createApp(Component)
    pageContentApp.use(router)
    pageContentApp.mount('#app')

  } else {
    console.info(`No component for: ${vueComponentName}`)
  }

}


/**
 * Common components in the Header and Footer
 *
 * These are components mounted within the layout of the page, such as
 * in the header or footer. They are not tied to a specific page and
 * are always present on the site.
 *
 **/
const showBanner = ref(false);
const broadcastApp = createApp(GlobalBroadcast, {
  content: 'This is a global broadcast',
  show: showBanner.value,
})
broadcastApp.mount('#broadcast')

const themeToggleElement = document.querySelector('#theme-toggle');
if (themeToggleElement) {
  const toggleApp = createApp(ThemeToggle);
  toggleApp.mount('#theme-toggle');
}

function deobfuscateEmails(): void {
  document.querySelectorAll<HTMLElement>('.email').forEach(el => {
    const email = el.textContent?.replace(/ &#65;&#84; /g, "@").replace(/ AT /g, "@").replace(/ D0T /g, ".") || '';
    const subject = el.getAttribute('data-subject');
    const subjectParam = subject ? `?subject=${encodeURIComponent(subject)}` : '';
    el.innerHTML = `<a class="dark:text-gray-300" href="mailto:${encodeURIComponent(email)}${subjectParam}">${email}</a>`;
  });
}

// Call this function when the DOM is ready or after dynamic content is loaded
document.addEventListener('DOMContentLoaded', deobfuscateEmails);
window.deobfuscateEmails = deobfuscateEmails;
