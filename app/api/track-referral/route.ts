import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const data = await req.json()
  if (data.type === 'referral_click') {
    await supabase.from('referral_clicks').insert([{
      referral_code: data.referral_code,
      product_id: data.product_id,
      platform: data.platform,
      device_type: data.device_type,
      location: data.location,
      referrer: data.referrer,
      user_agent: data.user_agent,
      timestamp: data.timestamp,
    }])
  } else if (data.type === 'whatsapp_inquiry') {
    await supabase.from('whatsapp_inquiry_clicks').insert([{
      referral_code: data.referral_code,
      product_id: data.product_id,
      platform: data.platform,
      device_type: data.device_type,
      location: data.location,
      referrer: data.referrer,
      user_agent: data.user_agent,
      timestamp: data.timestamp,
    }])
  }
  return NextResponse.json({ success: true })
}
