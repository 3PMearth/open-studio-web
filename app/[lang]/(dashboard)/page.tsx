"use client";

import withAuth from "../components/auth/withAuth";

function Home() {
  return (
    <div>
      <p>welcome</p>
    </div>
  );
}

export default withAuth(Home);
