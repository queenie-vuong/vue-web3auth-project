import 'vanilla-cookieconsent/dist/cookieconsent.css'
import { run, showPreferences, acceptedCategory } from 'vanilla-cookieconsent'
import type { CookieConsentConfig } from 'vanilla-cookieconsent'

export const cookieConsentConfig: CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: 'box',
      position: 'bottom right',
      equalWeightButtons: false,
      flipButtons: false
    },
    preferencesModal: {
      layout: 'box',
      position: 'right',
      equalWeightButtons: false,
      flipButtons: false
    }
  },
  categories: {
    necessary: {
      readOnly: true,
      enabled: true
    },
    analytics: {
      autoClear: {
        cookies: [
          {
            name: /^_ga/,   // Google Analytics
          },
          {
            name: '_gid',   // Google Analytics
          }
        ]
      }
    },
    functionality: {},
    marketing: {}
  },
  language: {
    default: 'en',
    translations: {
      en: {
        consentModal: {
          title: 'We use cookies!',
          description: 'Hi, this website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it. The latter will be set only after consent.',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage preferences',
          footer: '<a href="/privacy-policy">Privacy Policy</a>'
        },
        preferencesModal: {
          title: 'Cookie Preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Save preferences',
          closeIconLabel: 'Close modal',
          serviceCounterLabel: 'Service|Services',
          sections: [
            {
              title: 'Cookie Usage',
              description: 'We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.'
            },
            {
              title: 'Strictly Necessary cookies <span class="pm__badge">Always Enabled</span>',
              description: 'These cookies are essential for the proper functioning of the website. Without these cookies, the website would not work properly.',
              linkedCategory: 'necessary'
            },
            {
              title: 'Analytics cookies',
              description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.',
              linkedCategory: 'analytics'
            },
            {
              title: 'Functionality cookies',
              description: 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.',
              linkedCategory: 'functionality'
            },
            {
              title: 'Marketing cookies',
              description: 'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.',
              linkedCategory: 'marketing'
            }
          ]
        }
      }
    }
  }
}

export const initCookieConsent = () => {
  run(cookieConsentConfig)
}

export const showCookieConsentModal = () => {
  showPreferences()
}

export const getCookieConsentValue = (category: string) => {
  return acceptedCategory(category)
}