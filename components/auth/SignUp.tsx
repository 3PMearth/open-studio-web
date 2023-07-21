"use client";

import { postUser } from "api";
import Button from "components/button";
import Input from "components/input";
import { Container } from "components/layout";
import PageTitle from "components/page-title";
import { SESSION_KEY_USER } from "lib/constants";

interface SignUpProps {
  walletAddress: string;
  loginMethod: string;
  onCreateUser: (userId: string) => void;
}

export default function SignUp({
  walletAddress,
  loginMethod,
  onCreateUser
}: SignUpProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await postUser(data);

    if (res?.id) {
      sessionStorage.setItem(SESSION_KEY_USER, JSON.stringify(res));
      onCreateUser(res.id);
    } else if (res?.error) {
      window.alert(res.error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <header className="flex items-center justify-between">
          <PageTitle>Basic Info</PageTitle>
          <div className="flex items-center gap-2">
            <Button type="submit" color="ok">
              Sign Up
            </Button>
          </div>
        </header>
        <Container className="mt-[3.12rem] space-y-6">
          <Input.Text id="first_name" label="First Name" required />
          <Input.Text id="last_name" label="Last Name" required />
          <Input.Text
            id="email"
            label="Email"
            type="email"
            placeholder="example@abc.com"
            required
          />
          <Input.Text
            id="phone_number"
            label="Phone Number"
            type="phone"
            placeholder="010-1234-5678"
            required
          />
          <Input.Text
            id="wallet_address"
            label="Wallet Address"
            value={walletAddress}
            disabled
            required
          />
          <input type="hidden" name="sso_type" value={loginMethod} />
          <input type="hidden" name="wallet_address" value={walletAddress} />
        </Container>
      </form>
    </div>
  );
}
