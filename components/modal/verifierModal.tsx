import { useTranslations } from 'next-intl';
import * as React from 'react';

import { createVerifier, getContracts } from 'api';
import Button from 'components/button';
import Input from 'components/input';
import Toast from 'components/toast';
import { Contract } from 'types/contract';
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
  const [createdVerifier, SetCreatedVerifier] = React.useState<Partial<Verifier>>();
  const t = useTranslations('verifier');
  const [toastMessage, setToastMessage] = React.useState('');
  const [contracts, setContracts] = React.useState<Contract[]>([]);

  const [selectDefault, SetselectDefault] = React.useState('');

  React.useEffect(() => {
    const GetContract = async () => {
      const contracts = await getContracts();
      setContracts(contracts);
      SetselectDefault(contracts[0].name);
    };
    if (Object.keys(contracts).length == 0) {
      GetContract();
    }

    if (createdVerifier) {
      setStep(Step.Complete);
    }

    const currentDate = new Date();
    const Time = currentDate.toISOString();
    setCurrentTime(Time);
  }, [createdVerifier, contracts]);

  const handleChange = (e: React.FormEvent) => {};
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const contractId = data.get('contract');
    const selectedContract = contracts.find((contract) => contract.name === contractId);
    if (selectedContract) {
      data.set('contract', selectedContract.id.toString());
    }

    const endTime = data.get('end_time');
    const endTimeISO = new Date(endTime + 'T23:59:59.000Z').toISOString();
    data.set('end_time', endTimeISO);

    const user = await createVerifier(data);
    SetCreatedVerifier(user as Verifier);
  };

  const handleVerifierContract = (createcontract: number | undefined) => {
    const contract = contracts.find((contract) => contract.id === createcontract);

    if (contract) {
      return (
        <p>
          {t('createcontract')} : {contract.name}
        </p>
      );
    }

    return '';
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
                  defaultValue={contracts[0].name}
                  required
                  options={contracts.map((contract) => contract.name)}
                  className="rounded-[0.25rem] border border-gray-semilight"
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
            {createdVerifier && (
              <>
                <h2 className="mb-5 text-center text-xl font-semibold">{t('createverifier')}</h2>
                <div className="mb-5">
                  <p>
                    {t('createid')} : {createdVerifier.id}
                  </p>
                  <p>
                    {t('createcode')} : {createdVerifier.verifier_code}
                  </p>
                  <p>
                    {t('createdate')} : {createdVerifier.end_time}
                  </p>
                  {handleVerifierContract(createdVerifier.contract)}
                  <p>
                    {'ⓘ '}
                    {t('verifierpage', {
                      id: createdVerifier.id,
                      code: createdVerifier.verifier_code,
                    })}
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

  if (contracts.length === 0) {
    return;
  }
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
