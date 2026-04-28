import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'

// Initialize Vercel Web Analytics
inject()

// Initialize Vercel Speed Insights
injectSpeedInsights()

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
