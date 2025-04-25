'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function ProductList() {
  const supabase = createClient()
  const [products, setProducts] = useState<any>([])

  const productSupabaseQuery = () => {
    let query = supabase
      .from('product')
      .select('*', { count: 'exact' })
    console.log(query)
    return query
  }

  const fetchProduct = async () => {
    const { data: usersData, error, count } = await productSupabaseQuery()
    if (!usersData || error) {
      return false
    }
    setProducts(usersData)
  }

  useEffect(() => {
    fetchProduct()
  }, [])

  return (
    // opacity-0
    <div className="flex-1 flex flex-col gap-20 px-3 animate-fade-in">
      {/* <div className="flex gap-2 items-center">
        <input
          className="rounded-md px-4 py-2 bg-inherit border w-full"
          type="text"
          onChange={handleSearchChange}
        /> 
        <button onClick={searchUser}>Search</button>
      </div> */}
      <main className="flex-1 flex flex-col gap-6">
        <table className="table-auto border-collapse border border-gray-200 w-full">
          <thead>
            <tr>
              <th className="border border-gray-200 px-4 py-2">ID</th>
              <th className="border border-gray-200 px-4 py-2">Name</th>
              <th className="border border-gray-200 px-4 py-2">Cost</th>
              <th className="border border-gray-200 px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product: any) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.cost}</td>
                <td>{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}