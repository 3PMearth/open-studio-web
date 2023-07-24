import { Disclosure } from "@headlessui/react";
import { HiChevronRight } from "react-icons/hi";

type DisclosureProps = {
  children: React.ReactNode;
  title: string;
};

export default function FormDisclosure({ children, title }: DisclosureProps) {
  return (
    <Disclosure defaultOpen as="div">
      <Disclosure.Button className="flex h-10 w-full items-center justify-between rounded-t-[0.25rem] border border-[#E0E3E8] bg-[#f0f0f0] px-4 py-2 text-[#575F6E] ui-open:border-b-0 ui-not-open:rounded-b-[0.25rem]">
        <span className="font-semibold">{title}</span>
        <HiChevronRight className="rotate-90 transform ui-open:-rotate-90" />
      </Disclosure.Button>
      <Disclosure.Panel className="space-y-6 rounded-b-[0.25rem] border border-[#E0E3E8] bg-white px-4 pb-6 pt-4">
        {children}
      </Disclosure.Panel>
    </Disclosure>
  );
}
