import { useRouter } from "next/router";

import { usePaths } from "@/lib/paths";
import { OrderDetailsFragment } from "@/saleor/api";

import { useRegions } from "../RegionsProvider";

export interface OrdersTableProps {
  orders: OrderDetailsFragment[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();
  const paths = usePaths();
  const { formatPrice } = useRegions();

  return (
    <table className="w-full divide-y bg-white rounded-md ">
      <thead className="text-center h-16">
        <tr>
          <th className="w-1/4 font-semibold text-md">Number</th>
          <th className="w-1/4 font-semibold text-md">Creation Date</th>
          <th className="w-1/4 font-semibold text-md md:text-center hidden md:table-cell">
            Status
          </th>
          <th className="w-1/4 font-semibold text-md">Total</th>
        </tr>
      </thead>
      <tbody className="text-center divide-y">
        {orders?.map((order) => (
          <tr
            className="h-16 cursor-pointer"
            key={order.id}
            onClick={() => router.push(paths.account.orders._token(order.token).$url())}
          >
            <td className="text-2xl">{order?.number}</td>
            <td className="text-2xl">{order.created.slice(0, 10)}</td>
            <td className="hidden md:table-cell text-sm font-medium">{order.status}</td>
            <td className="text-2xl">{formatPrice(order.total.gross)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
