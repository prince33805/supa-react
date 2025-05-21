'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const dotenv_1 = require('dotenv');
const path_1 = __importDefault(require('path'));
// ชี้ path ไปยัง scripts/.env โดยไม่ว่า compile แล้วไฟล์อยู่ไหน
(0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, '../.env') });
const supabase_js_1 = require('@supabase/supabase-js');
const csv_writer_1 = require('csv-writer');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
console.log('URL:', supabaseUrl);
console.log('KEY:', supabaseKey?.slice(0, 5));
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
async function exportOrders() {
  const { data, error } = await supabase.from('orders').select('*');
  if (error) {
    console.error('❌ Error fetching orders:', error);
    return;
  }
  const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
    path: `orders_export_${new Date().toISOString().slice(0, 10)}.csv`,
    header: Object.keys(data?.[0] || {}).map((key) => ({
      id: key,
      title: key,
    })),
  });
  await csvWriter.writeRecords(data || []);
  console.log(`✅ Exported ${data?.length || 0} records.`);
}
exportOrders();
