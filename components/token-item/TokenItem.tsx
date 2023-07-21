import { Token } from "types/token";

interface TokenItemProps {
  token: Token;
}

export default function TokenItem({ token }: TokenItemProps) {
  return <div>{token.name}</div>;
}
