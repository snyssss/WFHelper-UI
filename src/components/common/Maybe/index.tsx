import React, { PropsWithChildren, ReactElement } from 'react';

export interface MaybeProps {
  validate: boolean;
}

const Maybe = ({
  validate,
  children,
}: PropsWithChildren<MaybeProps>): ReactElement | null =>
  validate ? <>{children}</> : null;

export default Maybe;
