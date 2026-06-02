import "server-only";

import type { PostgrestError } from "@supabase/supabase-js";
import { createAdminSupabase } from "@/lib/supabase/admin";

type NotesColumn = "order_notes" | "notes";

type BillColumnSupport = {
  orderType: boolean;
  orderSource: boolean;
};

let billColumnSupportPromise: Promise<BillColumnSupport> | null = null;

async function getBillColumnSupport(): Promise<BillColumnSupport> {
  if (!billColumnSupportPromise) {
    billColumnSupportPromise = (async () => {
      const adminSupabase = createAdminSupabase();
      const { data, error } = await adminSupabase
        .from("information_schema.columns")
        .select("column_name")
        .eq("table_schema", "public")
        .eq("table_name", "bills")
        .in("column_name", ["order_type", "order_source"]);

      if (error || !data) {
        return { orderType: false, orderSource: false };
      }

      const columnNames = new Set((data as { column_name?: string }[]).map((row) => row.column_name ?? ""));
      return {
        orderType: columnNames.has("order_type"),
        orderSource: columnNames.has("order_source"),
      };
    })();
  }

  return billColumnSupportPromise;
}

export interface CreateBillInput {
  clientId: string;
  customerId: string;
  tableNumber: string;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  status: string;
  notesColumn?: NotesColumn | null;
  notes?: string;
  orderType?: string;
  orderSource?: string;
}

export interface BillInsertRecord {
  id: string;
  client_id: string;
}

export interface OrderDetailsRecord {
  id: string;
  table_number: string;
  final_amount: number;
  order_type?: string;
  order_source?: string;
}

export async function createBill(
  input: CreateBillInput,
): Promise<{ data: BillInsertRecord | null; error: PostgrestError | null }> {
  const adminSupabase = createAdminSupabase();
  const columnSupport = await getBillColumnSupport();
  const payload: {
    client_id: string;
    customer_id: string;
    table_number: string;
    total_amount: number;
    discount: number;
    final_amount: number;
    status: string;
    order_notes?: string;
    notes?: string;
    order_type?: string;
    order_source?: string;
  } = {
    client_id: input.clientId,
    customer_id: input.customerId,
    table_number: input.tableNumber,
    total_amount: input.totalAmount,
    discount: input.discount,
    final_amount: input.finalAmount,
    status: input.status,
  };

  if (input.notesColumn && input.notes) {
    payload[input.notesColumn] = input.notes;
  }

  if (columnSupport.orderType && input.orderType) {
    payload.order_type = input.orderType;
  }

  if (columnSupport.orderSource && input.orderSource) {
    payload.order_source = input.orderSource;
  }

  return adminSupabase.from("bills").insert(payload).select("id,client_id").single();
}

export async function deleteBillById(billId: string): Promise<{ error: PostgrestError | null }> {
  const adminSupabase = createAdminSupabase();
  const { error } = await adminSupabase.from("bills").delete().eq("id", billId);
  return { error };
}

export async function getBillOrderDetails(
  orderId: string,
): Promise<{ data: OrderDetailsRecord | null; error: PostgrestError | null }> {
  const adminSupabase = createAdminSupabase();
  const columnSupport = await getBillColumnSupport();
  const selectFields = ["id", "table_number", "final_amount"];

  if (columnSupport.orderType) selectFields.push("order_type");
  if (columnSupport.orderSource) selectFields.push("order_source");

  return adminSupabase.from("bills").select(selectFields.join(",")).eq("id", orderId).maybeSingle();
}
