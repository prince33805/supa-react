'use client';

import { Button } from './ui/button';
import { Database } from '@/types/supabase';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

type Orders = Database['public']['Tables']['orders']['Row'];

type OrderItems = {
  product: { name: string };
  quantity: number;
  price: number;
  total_price_product: number;
};

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

interface Props {
  order: Orders;
  onClose: () => void;
}

export default function OrderDetails({ order, onClose }: Props) {
  const handleDownloadPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' }) as jsPDFWithAutoTable;

    const marginX = 40;
    let currentY = 40;

    // 🧾 Header
    doc.setFontSize(20);
    doc.text('INVOICE', marginX, currentY);
    currentY += 30;

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, marginX, currentY);
    currentY += 20;
    doc.text(
      `Date: ${new Date(order.created_at ?? '').toLocaleDateString()}`,
      marginX,
      currentY,
    );
    currentY += 20;
    doc.text(`Payment Method: ${order.payment_method}`, marginX, currentY);
    currentY += 30;

    // 📋 Order Table
    const tableBody = (order.items as OrderItems[]).map(
      (item: OrderItems, i: number) => [
        i + 1,
        item.product.name,
        item.quantity,
        `$${item.price.toFixed(2)}`,
        `$${item.total_price_product.toFixed(2)}`,
      ],
    );

    autoTable(doc, {
      startY: currentY,
      head: [['#', 'Product', 'Qty', 'Price', 'Total']],
      body: tableBody,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [52, 73, 94] },
      margin: { left: marginX, right: marginX },
    });

    // 💰 Total
    const afterTableY = doc.lastAutoTable?.finalY ?? +20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Total Amount: $${order.total_price.toFixed(2)}`,
      marginX,
      afterTableY,
    );

    // 📥 Save
    doc.save(`invoice-${order.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 dark:bg-black/60 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">Order Detail</h2>
        <p className="mb-2 text-sm">Order ID: {order.id}</p>
        <p className="mb-4 text-sm">Created: {order.created_at}</p>
        <p className="mb-4 text-sm">Payment Method: {order.payment_method}</p>

        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">สินค้า</th>
              <th className="py-2">จำนวน</th>
              <th className="py-2">ราคา</th>
              <th className="py-2">ทั้งหมด</th>
            </tr>
          </thead>
          <tbody>
            {(order.items as OrderItems[]).map(
              (item: OrderItems, i: number) => (
                <tr key={i} className="border-t">
                  <td className="py-2">{item.product?.name || 'Unknown'}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">${item.price}</td>
                  <td className="py-2">${item.total_price_product}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center">
          <div className="font-semibold">Total: ${order.total_price}</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleDownloadPDF}>Download PDF</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
