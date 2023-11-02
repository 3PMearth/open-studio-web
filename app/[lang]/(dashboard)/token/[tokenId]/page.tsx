'use client';

import { useTranslations } from 'next-intl';
import * as React from 'react';
import { HiPencil } from 'react-icons/hi';

import { deleteAsset, getContracts, getToken, patchAsset, patchToken } from 'api';
import { withAuth } from 'components/auth';
import Button from 'components/button';
import Disclosure from 'components/disclosure';
import Input from 'components/input';
import { Container } from 'components/layout';
import VerifierModal from 'components/modal/verifierModal';
import PageTitle from 'components/page-title';
import type { Contract } from 'types/contract';
import type { Token } from 'types/token';

interface TokenEditProps {
  params: { tokenId: string };
}

function TokenEdit({ params: { tokenId } }: TokenEditProps) {
  const t = useTranslations('token');

  const [token, setToken] = React.useState<Partial<Token>>({});

  const [isTokenEditing, setIsTokenEditing] = React.useState(false);
  const [editingAssetIndex, setEditingAssetIndex] = React.useState<number>();

  const [showVerifierModal, setShowVerifierModal] = React.useState(false);

  const [contract, setContract] = React.useState<Contract>();

  React.useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken(tokenId);
      if (token?.id) {
        setToken(token);
      } else {
        // todo handle error
      }
    };

    if (tokenId) {
      fetchToken();
    }
  }, [tokenId]);

  React.useEffect(() => {
    if (token) {
      getContracts().then((contracts) => {
        setContract(
          contracts.find((contract) => contract.active && contract.id === token?.contract),
        );
      });
    }
  }, [token]);

  const handleTokenEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTokenEditing((prev) => !prev);
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const fileInputs = ['token_img', 'animation'];
    fileInputs.forEach((key) => {
      if (!form[key].files?.length) {
        data.delete(key);
      }
    });

    const updatedToken = await patchToken(tokenId, data);
    if (updatedToken?.id) {
      setToken(updatedToken);
      setIsTokenEditing(false);
    }
  };

  const handleAssetEditClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setEditingAssetIndex((prev) => (prev === index ? undefined : index));
  };

  const handleAssetSubmit = async (e: React.FormEvent, index: number) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    if (!form['media'].files?.length) {
      data.delete('media');
    }

    if (!data.get('download')) {
      data.append('download', 'False');
    }

    const updatedAsset = await patchAsset(token.assets![index].id, data);
    if (updatedAsset?.id) {
      const assets = [...token.assets!];
      assets[index] = updatedAsset;
      setToken((prev) => ({ ...prev, assets }));
      setEditingAssetIndex(undefined);
    }
  };

  const handleRemoveAsset = async (index: number) => {
    if (!window.confirm(t('removeAssetConfirm'))) return;

    const isDeleted = await deleteAsset(token.assets![index].id);
    if (isDeleted) {
      const assets = [...token.assets!];
      assets.splice(index, 1);
      setToken((prev) => ({ ...prev, assets }));
      setEditingAssetIndex(undefined);
    }
  };

  const handleCreateVerifier = () => {
    setShowVerifierModal(true);
  };

  const closeVerifierModal = () => {
    setShowVerifierModal(false);
  };

  return (
    <div>
      <header className="flex items-center justify-between">
        <PageTitle>Token Detail</PageTitle>
        {contract?.type === 'TICKET' && (
          <Button size="small" onClick={handleCreateVerifier}>
            {t('createverifier')}
          </Button>
        )}
      </header>
      <Container className="mt-6 space-y-6 lg:mt-[3.12rem]">
        <form onSubmit={handleTokenSubmit}>
          <Disclosure
            title={`Token Information`}
            button={
              isTokenEditing ? (
                <Button size="small" type="submit" onClick={(e) => e.stopPropagation()}>
                  {t('save')}
                </Button>
              ) : (
                <div onClick={handleTokenEditClick} className="cursor-pointer hover:text-primary">
                  <HiPencil className="p-1" size={24} />
                </div>
              )
            }
          >
            <input type="hidden" name="user" value={token.user} />
            <input type="hidden" name="contract" value={token.contract} />
            <Input.Text
              id="name"
              label="Name"
              required
              readOnly={!isTokenEditing}
              defaultValue={token.name}
            />
            <Input.File
              id="token_img"
              label="Image"
              required={!token.token_img}
              readOnly={!isTokenEditing}
              defaultValue={token.token_img}
            />
            <Input.File
              id="animation"
              label="Animated Image (*.mp4)"
              readOnly={!isTokenEditing}
              defaultValue={token.animation}
            />
            <Input.Text
              id="stock"
              label="Stock"
              min={0}
              required
              type="number"
              readOnly={!isTokenEditing}
              defaultValue={token.stock}
            />
            <Input.Text
              id="price_krw"
              label="Price (KRW)"
              min={1000}
              required
              type="number"
              readOnly={!isTokenEditing}
              defaultValue={token.price_krw}
            />
            <Input.Text
              id="price_usd"
              label="Price (USD)"
              min={10}
              required
              type="number"
              readOnly={!isTokenEditing}
              defaultValue={token.price_usd}
            />
            <Input.TextArea
              id="description_ko"
              label="Description (ko)"
              required
              readOnly={!isTokenEditing}
              defaultValue={token.description_ko}
            />
            <Input.TextArea
              id="description_en"
              label="Description (en)"
              required
              readOnly={!isTokenEditing}
              defaultValue={token.description_en}
            />
          </Disclosure>
        </form>
        {token.assets?.map((asset, i) => (
          <form key={`asset-form${i}`} onSubmit={(e) => handleAssetSubmit(e, i)}>
            <Disclosure
              title={`Asset ${i + 1} Information`}
              button={
                i === editingAssetIndex ? (
                  <Button size="small" type="submit" onClick={(e) => e.stopPropagation()}>
                    {t('save')}
                  </Button>
                ) : (
                  <div
                    onClick={(e) => handleAssetEditClick(e, i)}
                    className="cursor-pointer hover:text-primary"
                  >
                    <HiPencil className="p-1" size={24} />
                  </div>
                )
              }
            >
              <AssetInputs index={i} asset={asset} readOnly={i !== editingAssetIndex} />
              {i === editingAssetIndex && (
                <div className="!mt-0 text-right">
                  <Button type="button" color="cancel" onClick={() => handleRemoveAsset(i)}>
                    Remove Asset
                  </Button>
                </div>
              )}
            </Disclosure>
          </form>
        ))}
      </Container>
      <VerifierModal
        isOpen={showVerifierModal}
        onClose={closeVerifierModal}
        contractId={token?.contract?.toString() ?? ''}
      />
    </div>
  );
}

const AssetInputs = ({ asset, readOnly }: { index: number; asset: any; readOnly: boolean }) => {
  return (
    <div className="space-y-6">
      <Input.Text
        id={`name`}
        label="Asset Name"
        required
        defaultValue={asset.name}
        readOnly={readOnly}
      />
      <Input.Select
        id={`type`}
        label="Asset Type"
        required
        defaultValue={asset.type || 'image'}
        options={['image', 'music/mp3', 'file', 'video', 'etc']}
        readOnly={readOnly}
      />
      <Input.File
        id={`media`}
        label="Media"
        required={!asset.media}
        defaultValue={asset.media}
        readOnly={readOnly}
      />
      <Input.Toggle
        id={`download`}
        label="Downloadable"
        defaultChecked={asset.download}
        readOnly={readOnly}
      />
    </div>
  );
};

export default withAuth(TokenEdit);
