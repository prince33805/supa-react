import { config } from 'dotenv'
import path from 'path'

// ชี้ path ไปยัง scripts/.env โดยไม่ว่า compile แล้วไฟล์อยู่ไหน
config({ path: path.resolve(__dirname, '../.env') })

import { createClient } from '@supabase/supabase-js'
import { createObjectCsvWriter } from 'csv-writer'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

console.log("URL:", supabaseUrl)
console.log("KEY:", supabaseKey?.slice(0, 5))

const supabase = createClient(supabaseUrl, supabaseKey)

async function exportOrders() {
  const { data, error } = await supabase.from('orders').select('*')
  if (error) {
    console.error('❌ Error fetching orders:', error)
    return
  }

  const csvWriter = createObjectCsvWriter({
    path: `orders_export_${new Date().toISOString().slice(0, 10)}.csv`,
    header: Object.keys(data?.[0] || {}).map((key) => ({ id: key, title: key })),
  })

  await csvWriter.writeRecords(data || [])
  console.log(`✅ Exported ${data?.length || 0} records.`)
}

exportOrders()
