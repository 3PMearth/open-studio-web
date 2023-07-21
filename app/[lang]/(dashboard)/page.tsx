"use client";

import { useTranslations } from "next-intl";

import withAuth from "components/auth/withAuth";

function Home() {
  const t = useTranslations("home");

  return (
    <div>
      <p>{t("welcome")}</p>
    </div>
  );
}

export default withAuth(Home);
