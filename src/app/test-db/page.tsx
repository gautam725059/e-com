"use client";

import { supabase } from "@/lib/supabase";

export default function TestDB() {
  const testInsert = async () => {
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: "Anuj Test",
          phone: "9999999999",
          total_amount: 299,
        },
      ]);

    console.log(data);
    console.log(error);

    alert(error ? error.message : "Inserted!");
  };

  return (
    <button
      onClick={testInsert}
      className="bg-navy-700 text-white px-4 py-2"
    >
      Test Database
    </button>
  );
}