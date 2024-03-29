'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { getContracts, postToken } from 'api';
import { withAuth } from 'components/auth';
import Button from 'components/button';
import Disclosure from 'components/disclosure';
import Input from 'components/input';
import { Container } from 'components/layout';
import PageTitle from 'components/page-title';

interface TokenCreateProps {
  userId: string;
  params: { contractType: string };
}

function TokenCreate({ userId, params: { contractType } }: TokenCreateProps) {
  const [contractId, setContractId] = React.useState<number>();
  const [assets, setAssets] = React.useState([{}]);
  const { replace } = useRouter();

  React.useEffect(() => {
    const fetchContract = async () => {
      const contracts = await getContracts();
      const contract = contracts.find((contract) => contract.type.toLowerCase() === contractType);
      if (contract) {
        setContractId(contract.id);
      } else {
        replace('/token/create');
      }
    };
    if (userId && contractType) {
      fetchContract();
    }
  }, [userId, contractType, replace]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!form['animation'].files?.length) {
      data.delete('animation');
    }

    assets.forEach((_, i) => {
      if (!data.get(`assets[${i}]download`)) {
        data.append(`assets[${i}]download`, 'False');
      }
    });

    const res = await postToken(data);
    if (res?.id) {
      replace('/');
    } else if (res?.error) {
      window.alert(res.error);
    }
  };

  const handleAddAsset = () => {
    setAssets([...assets, {}]);
  };

  const handleRemoveAsset = (index: number) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  return (
    <div className="pb-16">
      <form onSubmit={handleSubmit}>
        <header className="flex items-center justify-between">
          <PageTitle>Create New Token</PageTitle>
          <div className="fixed inset-x-6 bottom-6 z-10 flex items-center justify-evenly gap-2 lg:static">
            <Link href="/token/create" className="flex-1">
              <Button color="cancel" className="w-full shadow-sm">
                Cancel
              </Button>
            </Link>
            <Button type="submit" color="ok" className="flex-1 shadow-sm">
              Submit
            </Button>
          </div>
        </header>
        <Container className="mt-6 space-y-6 lg:mt-[3.12rem]">
          <input type="hidden" name="user" value={userId} />
          <input type="hidden" name="contract" value={contractId} />
          <Disclosure
            title={`${contractType.charAt(0).toUpperCase() + contractType.slice(1)} Information`}
          >
            <Input.Text id="name" label="Name" required />
            <Input.File id="token_img" label="Image" required />
            <Input.File id="animation" label="Animated Image (*.mp4)" />
            <Input.Text id="stock" label="Stock" min={0} required type="number" />
            <Input.Text id="price_krw" label="Price (KRW)" min={1000} required type="number" />
            <Input.Text id="price_usd" label="Price (USD)" min={10} required type="number" />
            <Input.TextArea id="description_ko" label="Description (ko)" required />
            <Input.TextArea id="description_en" label="Description (en)" required />
          </Disclosure>
          {assets.map((asset, i) => (
            <Disclosure key={i} title={`Asset ${i + 1} Information`}>
              <AssetInputs index={i} asset={asset} />
              <div className="!mt-0 text-right">
                <Button type="button" color="cancel" onClick={() => handleRemoveAsset(i)}>
                  Remove Asset
                </Button>
              </div>
            </Disclosure>
          ))}
          <div className="text-center">
            <Button
              className="w-56 border border-[#E0E3E8]"
              type="button"
              color="cancel"
              onClick={handleAddAsset}
            >
              Add Asset
            </Button>
          </div>
        </Container>
      </form>
    </div>
  );
}

const AssetInputs = ({ index, asset }: { index: number; asset: any }) => {
  return (
    <div className="space-y-6">
      <Input.Text
        id={`assets[${index}]name`}
        label="Asset Name"
        required
        defaultValue={asset.name}
      />
      <Input.Select
        id={`assets[${index}]type`}
        label="Asset Type"
        required
        defaultValue={asset.type || 'image'}
        options={['image', 'music/mp3', 'file', 'video', 'etc']}
      />
      <Input.File id={`assets[${index}]media`} label="Media" required defaultValue={asset.media} />
      <Input.Toggle
        id={`assets[${index}]download`}
        label="Downloadable"
        defaultChecked={asset.download}
      />
    </div>
  );
};

export default withAuth(TokenCreate);

export async function generateStaticParams() {
  const contracts = await getContracts();
  return contracts.map((contract) => ({
    contractType: contract.type,
  }));
}
