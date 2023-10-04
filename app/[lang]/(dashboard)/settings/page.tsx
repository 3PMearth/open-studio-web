'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState, useRef } from 'react';

import { patchUser, getUserBySlug } from 'api';
import { withAuth } from 'components/auth';
import Button from 'components/button';
import Input from 'components/input';
import { Container } from 'components/layout';
import PageTitle from 'components/page-title';
import { getStoredUser } from 'lib/user';

interface SettingProps {
  walletAddress: string;
}

enum SlugCheckState {
  None,
  Ok,
  AlreadyExist,
}

const MAX_PHOTO_SIZE_MB = 5;

function Settings({ walletAddress }: SettingProps) {
  const t = useTranslations('edit');
  const user = getStoredUser(walletAddress);
  const slugInputRef = useRef<HTMLInputElement>();
  const [slugCheckState, setSlugCheckState] = useState(SlugCheckState.None);
  const [profileImg, setProfileImg] = useState('');
  const { push } = useRouter();

  useEffect(() => {
    if (user && user.profile_img && profileImg == '') {
      setProfileImg(user.profile_img);
    }
  }, [user, profileImg]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (slugCheckState === SlugCheckState.Ok || slugInputRef.current?.value == user?.slug) {
      if (user?.id) {
        const result = await patchUser(user.id, data);
        if (result == true) {
          window.location.reload();
          setSlugCheckState(SlugCheckState.None);
        }
      }
    }
  };

  const handleChangeProfile = (e: React.FormEvent<HTMLInputElement>) => {
    const { files, name } = e.currentTarget;
    if (!files || !files.length) {
      if (profileImg) setProfileImg(profileImg);
      else setProfileImg('');
      return;
    }

    const fileSizeKb = Math.round(files[0].size / 1024);
    if (fileSizeKb > MAX_PHOTO_SIZE_MB * 1024) {
      const dataTransfer = new DataTransfer();
      e.currentTarget.files = dataTransfer.files;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImg(e.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSlugChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSlugCheckState(SlugCheckState.None);
  };

  const handleCheckDuplicateSlug = async () => {
    const slug = slugInputRef.current?.value;
    if (!slug?.length) {
      return;
    }
    if (slug == user?.slug) return;

    const result = await getUserBySlug(slug as string);
    setSlugCheckState(
      result.message == 'not found user' ? SlugCheckState.Ok : SlugCheckState.AlreadyExist,
    );
  };

  return (
    <div>
      <PageTitle>Settings</PageTitle>
      <div className="mt-6 rounded-lg border border-gray-semilight bg-white p-6 text-gray-extradark lg:mt-10 lg:px-12 lg:py-10">
        <div className="pb-16">
          <form onSubmit={handleSubmit}>
            <Container className="mt-6 space-y-6 lg:mt-[3.12rem]">
              <div className="text-center text-2xl font-bold">{t('editinfo')}</div>
              <Input.Slug
                inputRef={slugInputRef}
                id="slug"
                label="URL"
                required
                defaultValue={user?.slug}
                onChange={handleSlugChange}
                slugurl={`${window.location.origin}/s/`}
                warnings={[slugCheckState === SlugCheckState.AlreadyExist ? t('invalidurl') : '']}
                checkButton={
                  <Button
                    onClick={handleCheckDuplicateSlug}
                    disabled={slugCheckState === SlugCheckState.Ok}
                    type="button"
                  >
                    {slugCheckState === SlugCheckState.Ok
                      ? t('availableCheck')
                      : t('duplicateCheck')}
                  </Button>
                }
              />
              <Input.Text
                defaultValue={user?.username}
                id="username"
                label="Display Name"
                required
              />
              <Input.TextArea defaultValue={user?.info} id="info" label="Info" />
              {profileImg && (
                <div className="flex items-center justify-center">
                  <Image
                    src={profileImg}
                    alt="user profile"
                    className="h-24 w-24 rounded-full object-cover"
                    width={96}
                    height={96}
                  />
                </div>
              )}
              <Input.File
                id="profile_img"
                label="Profile Image"
                defaultValue={profileImg}
                onChange={(e) => handleChangeProfile(e)}
              />

              <div className="inset-x-6 bottom-6 z-10">
                <Button type="submit" color="ok" className="w-full">
                  {t('modify')}
                </Button>
              </div>
            </Container>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Settings);
