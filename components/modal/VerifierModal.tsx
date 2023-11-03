import { useTranslations } from 'next-intl';
import * as React from 'react';

import { createVerifier } from 'api';
import Button from 'components/button';
import Input from 'components/input';
import Toast from 'components/toast';
import type { Verifier } from 'types/verifier';

interface Props {
  isOpen?: boolean;
  onClose: () => void;
  contractId: string;
}

const CODE_PATTERN = '^[a-zA-Z0-9]+$';

enum Step {
  Create,
  Complete,
}

const VerifierModal = ({ isOpen = true, onClose, contractId }: Props) => {
  const [step, setStep] = React.useState(Step.Create);
  const [currentTime, setCurrentTime] = React.useState('');
  const [createdVerifier, SetCreatedVerifier] = React.useState<Partial<Verifier>>();
  const t = useTranslations('verifier');
  const [toastMessage, setToastMessage] = React.useState('');

  React.useEffect(() => {
    const currentDate = new Date();
    const Time = currentDate.toISOString();
    setCurrentTime(Time);
  }, []);

  React.useEffect(() => {
    if (createdVerifier) {
      setStep(Step.Complete);
    }
  }, [createdVerifier]);

  const handleChange = (e: React.FormEvent) => {};
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    data.set('contract', contractId);

    const endTime = data.get('end_time');
    const endTimeISO = new Date(endTime + 'T23:59:59.000Z').toISOString();
    data.set('end_time', endTimeISO);

    const user = await createVerifier(data);
    if (user.message) {
      setToastMessage(t('verifierfail'));
      setTimeout(() => setToastMessage(''), 1200);
    } else {
      SetCreatedVerifier(user as Verifier);
    }
  };

  const handleVerifierRender = () => {
    switch (step) {
      case Step.Create:
        return (
          <>
            <h2 className="text-center text-xl font-semibold ">{t('verifiertitle')}</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-5 space-y-4 whitespace-pre-wrap">
                <input type="hidden" name="start_time" value={currentTime} />
                <input type="hidden" name="registered" value={'false'} />
                <input type="hidden" name="active" value={'true'} />
                <Input.Text
                  id="verifier_code"
                  label={t('verifiercode')}
                  required
                  minLength={8}
                  pattern={CODE_PATTERN}
                  descriptions={[t('verifiercodemessage')]}
                  onChange={handleChange}
                />
                <Input.DateTime
                  id="end_time"
                  label={t('verifierdate')}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-x-2 text-center">
                <Button type="submit" className="text-white">
                  Add
                </Button>
                <Button onClick={onClose} color={'cancel'}>
                  Cancel
                </Button>
              </div>
            </form>
          </>
        );
      case Step.Complete:
        return (
          <>
            <h2 className="mb-5 text-center text-xl font-semibold">{t('createverifier')}</h2>
            <div className="mb-5">
              <p>
                {t('createid')} : {createdVerifier?.id}
              </p>
              <p>
                {t('createcode')} : {createdVerifier?.verifier_code}
              </p>
              <p>
                {t('createdate')} : {createdVerifier?.end_time}
              </p>
              <p className="mt-4 whitespace-pre-wrap text-zinc-500">
                {'ⓘ '} {t('warningverifier')}
              </p>
              <p className="mt-4 text-center">
                <a
                  href={`https://ticket-qr-admin.vercel.app/manage?id=${createdVerifier?.id}&code=${createdVerifier?.verifier_code}`}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`https://ticket-qr-admin.vercel.app/manage?id=${createdVerifier?.id}&code=${createdVerifier?.verifier_code}`}
                </a>
                <p>{t('verifierpageinfo')}</p>
              </p>
            </div>
            <div className="text-center">
              <Button onClick={onClose} color={'cancel'}>
                Cancel
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`fixed inset-0 z-50 block overflow-auto bg-black bg-opacity-50`}>
        <div className="relative mx-auto mt-16 w-96">
          <div className="rounded-lg bg-white p-4 shadow-lg">{handleVerifierRender()}</div>
        </div>
      </div>
      <div className="text-white">
        <Toast show={toastMessage.length > 0} message={toastMessage} />
      </div>
    </>
  );
};

export default VerifierModal;
