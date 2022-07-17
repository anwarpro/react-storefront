import { useAuthState } from "@saleor/sdk";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect } from "react";

import { CheckoutForm, CheckoutSidebar, Layout, Spinner } from "@/components";
import { useRegions } from "@/components/RegionsProvider";
import { BaseSeo } from "@/components/seo/BaseSeo";
import { usePaths } from "@/lib/paths";
import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { useCheckoutEmailUpdateMutation } from "@/saleor/api";

function CheckoutPage() {
  const router = useRouter();
  const paths = usePaths();
  const { checkout, loading } = useCheckout();
  const { authenticated, user } = useAuthState();

  const [checkoutEmailUpdate] = useCheckoutEmailUpdateMutation({});

  const { query } = useRegions();

  useEffect(() => {
    // Redirect to cart if theres no checkout data
    if (!loading && (!checkout || !checkout.lines?.length)) {
      router.push(paths.cart.$url());
      return;
    }

    // Redirect to login page if not logged in
    if (!loading && !authenticated) {
      router.push(paths.account.login.$url({ query: { next: paths.checkout.$url().pathname } }));
      return;
    }

    if (!loading && checkout && !checkout?.email && authenticated && user) {
      // add checkout to email
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = checkoutEmailUpdate({
        variables: {
          email: user.email,
          token: checkout?.token,
          locale: query.locale,
        },
      });
    }
  });

  const isCheckoutLoading = loading || typeof window === "undefined";
  if (isCheckoutLoading) {
    return (
      <>
        <Spinner />
        <BaseSeo title="Checkout" />
      </>
    );
  }

  if (!checkout || checkout.lines?.length === 0) {
    return <BaseSeo title="Checkout" />;
  }

  return (
    <>
      <BaseSeo title="Checkout" />

      <main className="w-screen max-w-7xl md:px-8 md:mx-auto overflow-hidden flex md:flex-row flex-col justify-between">
        <div className="md:w-2/3 w-full">
          <CheckoutForm />
        </div>
        <div className="md:w-1/3 w-full">
          <CheckoutSidebar checkout={checkout} />
        </div>
      </main>
    </>
  );
}

export default CheckoutPage;

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
