// lib/referral-tracking.ts
import { useEffect } from 'react'

type TrackingOptions = {
  productId: string
  referralCode: string | null
  whatsappButtonSelector: string // e.g. '#whatsapp-inquiry' or '.whatsapp-inquiry-btn'
  supabaseApiUrl: string // Your API endpoint to log analytics (see below)
}

function getPlatform() {
  const ua = navigator.userAgent
  if (/instagram/i.test(ua)) return 'Instagram'
  if (/facebook/i.test(ua)) return 'Facebook'
  if (/whatsapp/i.test(ua)) return 'WhatsApp'
  if (/chrome/i.test(ua)) return 'Chrome'
  if (/firefox/i.test(ua)) return 'Firefox'
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari'
  if (/edg/i.test(ua)) return 'Edge'
  return 'Other'
}

function getDeviceType() {
  const ua = navigator.userAgent
  if (/mobile/i.test(ua)) return 'Mobile'
  if (/tablet/i.test(ua)) return 'Tablet'
  return 'Desktop'
}

export function useReferralTracking({
  productId,
  referralCode,
  whatsappButtonSelector,
  supabaseApiUrl,
}: TrackingOptions) {
  useEffect(() => {
    if (!referralCode) return // Only track if referral code is present

    // 1. Track page view/click
    fetch('https://ipinfo.io/json')
      .then(res => res.json())
      .then(locationData => {
        fetch(supabaseApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'referral_click',
            referral_code: referralCode,
            product_id: productId,
            platform: getPlatform(),
            device_type: getDeviceType(),
            location: locationData,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          }),
        })
      })

    // 2. Track WhatsApp inquiry button click
    const btn = document.querySelector(whatsappButtonSelector)
    if (btn) {
      const handler = () => {
        fetch('https://ipinfo.io/json')
          .then(res => res.json())
          .then(locationData => {
            fetch(supabaseApiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'whatsapp_inquiry',
                referral_code: referralCode,
                product_id: productId,
                platform: getPlatform(),
                device_type: getDeviceType(),
                location: locationData,
                referrer: document.referrer,
                user_agent: navigator.userAgent,
                timestamp: new Date().toISOString(),
              }),
            })
          })
      }
      btn.addEventListener('click', handler)
      return () => btn.removeEventListener('click', handler)
    }
  }, [productId, referralCode, whatsappButtonSelector, supabaseApiUrl])
}
