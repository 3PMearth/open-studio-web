import { useTranslations } from 'next-intl';
import * as React from 'react';

import { createVerifier, getVerifier } from 'api';
import Button from 'components/button';
import Input from 'components/Input';
import Toast from 'components/toast';
import type { Verifier } from 'types/verifier';

interface Props {
  isOpen?: boolean;
  onClose: () => void;
}

const SLUG_PATTERN = '^[a-zA-Z0-9]+$';

enum Step {
  Create,
  Complete,
}

const VerifierModal = ({ isOpen = true, onClose }: Props) => {
  const [step, setStep] = React.useState(Step.Create);
  const [currentTime, setCurrentTime] = React.useState('');
  const [createUser, setCreateUser] = React.useState<Partial<Verifier>>({});
  const t = useTranslations('verifier');
  const [toastMessage, setToastMessage] = React.useState('');

  React.useEffect(() => {
    const currentDate = new Date();
    const Time = currentDate.toISOString();
    setCurrentTime(Time);
  }, []);

  const handleChange = (e: React.FormEvent) => {};
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const contractId = data.get('contract');
    if (contractId == 'Music') {
      data.set('contract', '1');
    } else if (contractId == 'Ticket') {
      data.set('contract', '2');
    }

    const endTime = data.get('end_time');
    const endTimeISO = new Date(endTime + 'T23:59:59.000Z').toISOString();
    data.set('end_time', endTimeISO);

    const user = await createVerifier(data);
    setCreateUser(user as Verifier);
    setStep(Step.Complete);
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
                  pattern={SLUG_PATTERN}
                  descriptions={[t('verifiercodemessage')]}
                  onChange={handleChange}
                />
                <Input.DateTime
                  id="end_time"
                  label={t('verifierdate')}
                  onChange={handleChange}
                  required
                />
                <Input.Select
                  id="contract"
                  label={t('verifiercontract')}
                  defaultValue={'Ticket'}
                  required
                  options={['Ticket', 'Music']}
                  isBorder={true}
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
            {createUser && (
              <>
                <h2 className="mb-5 text-center text-xl font-semibold">{t('createverifier')}</h2>
                <div className="mb-5">
                  <p>
                    {t('createid')} : {createUser.id}
                  </p>
                  <p>
                    {t('createcode')} : {createUser.verifier_code}
                  </p>
                  <p>
                    {t('createdate')} : {createUser.end_time}
                  </p>
                  <p>
                    {t('createcontract')} : {createUser.contract === '1' ? 'Music' : 'Ticket'}
                  </p>
                  <p className="mt-4 whitespace-pre-wrap text-zinc-500">
                    {'ⓘ '} {t('warningverifier')}
                  </p>
                </div>
                <div className="text-center">
                  <Button onClick={onClose} color={'cancel'}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </>
        );
        break;
      default:
        return null;
    }
  };

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
