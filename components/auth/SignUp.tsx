'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';

import { postUser } from 'api';
import Button from 'components/button';
import Input from 'components/input';
import { Container } from 'components/layout';
import PageTitle from 'components/page-title';
import PhoneInput from 'components/phone-input';
import { getRandomSlug } from 'lib';
import { SESSION_KEY_USER } from 'lib/constants';

interface SignUpProps {
  walletAddress: string;
  loginMethod: string;
  onCreateUser: (userId: string) => void;
}

export default function SignUp({ walletAddress, loginMethod, onCreateUser }: SignUpProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');

  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    data.append('slug', getRandomSlug());

    const res = await postUser(data);

    if (res?.id) {
      sessionStorage.setItem(SESSION_KEY_USER, JSON.stringify(res));
      onCreateUser(res.id);
    } else if (res?.error) {
      window.alert(res.error);
    }
  };

  const handlePhoneNumberChange = ({
    countryCode,
    phoneNumber,
  }: {
    countryCode: string;
    phoneNumber: string;
  }) => {
    setCountryCode(countryCode);
    setPhoneNumber(() => {
      if (locale === 'ko' && phoneNumber.charAt(0) === '0') {
        return phoneNumber.substring(1);
      }
      return phoneNumber;
    });
  };

  return (
    <div className="pb-16">
      <form onSubmit={handleSubmit}>
        <header className="flex items-center justify-between">
          <PageTitle>Basic Info</PageTitle>
          <div className="fixed inset-x-6 bottom-6 z-10 lg:static">
            <Button type="submit" color="ok" className="w-full">
              Sign Up
            </Button>
          </div>
        </header>
        <Container className="mt-6 space-y-6 lg:mt-[3.12rem]">
          <Input.Text id="first_name" label="First Name" required />
          <Input.Text id="last_name" label="Last Name" required />
          <Input.Text
            id="email"
            label="Email"
            type="email"
            placeholder="example@abc.com"
            required
          />
          <div>
            <p className="mb-2 text-sm font-semibold leading-6 text-[#09101D]">
              Phone
              <span className="text-[0.8rem] font-semibold text-[#DA1414]">*</span>
            </p>
            <PhoneInput
              className="grow"
              onValueChange={handlePhoneNumberChange}
              inputProps={{ required: true }}
              value={`${countryCode}${phoneNumber}`}
            />
          </div>
          <Input.Text
            id="wallet_address"
            label="Wallet Address"
            value={walletAddress}
            disabled
            required
          />
          <input type="hidden" name="country_code" value={`+${countryCode}`} />
          <input type="hidden" name="phone_number" value={phoneNumber} />
          <input type="hidden" name="sso_type" value={loginMethod} />
          <input type="hidden" name="wallet_address" value={walletAddress} />
        </Container>
      </form>
    </div>
  );
}