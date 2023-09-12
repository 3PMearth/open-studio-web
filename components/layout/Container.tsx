interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

export default function Container({
  children,
  className = '',
  tag: Wrapper = 'div',
}: ContainerProps) {
  return <Wrapper className={`mx-auto max-w-2xl lg:px-6 ${className}`}>{children}</Wrapper>;
}
