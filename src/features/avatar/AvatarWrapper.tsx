import React from 'react';
import { createAvatar } from '@bible-strong/avatar-react';
import definition from '../../../studycompanion.avatar.json';
import { useAvatarStore } from './avatarStore';

// Create the exported avatar once (definition is read‑only)
const ExportedAvatar = createAvatar(definition);

type Props = {};

const AvatarWrapper: React.FC<Props> = () => {
  const { target } = useAvatarStore();
  const isAnimation = target.kind === 'animation';
  const avatarProps = isAnimation
    ? { animation: target.key }
    : { expression: target.key };

  return (
    <ExportedAvatar
      {...(avatarProps as any)}
      size="100%"
      ariaLabel="Study Companion avatar"
    />
  );
};

export default AvatarWrapper;
