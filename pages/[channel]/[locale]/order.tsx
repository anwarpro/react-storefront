import { CheckIcon } from "@heroicons/react/outline";
import Link from "next/link";
import React, { ReactElement } from "react";

import { Layout } from "@/components";
import { usePaths } from "@/lib/paths";

function OrderCompletedPage() {
  const paths = usePaths();

  return (
    <main className="container pt-8 px-8 min-h-[480px] flex flex-col justify-center items-center">
      <CheckIcon className="text-green-700 w-64 h-64" />
      <div className="font-semibold text-xl">Your order is completed!</div>
      <p className="mt-2 text-3xl">
        <Link href={paths.$url()}>Go back to homepage</Link>
      </p>
    </main>
  );
}

export default OrderCompletedPage;

OrderCompletedPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
