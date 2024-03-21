import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { MwcModuleViewProps } from './MwcModule.types';

const NativeView: React.ComponentType<MwcModuleViewProps> =
  requireNativeViewManager('MwcModule');

export default function MwcModuleView(props: MwcModuleViewProps) {
  return <NativeView {...props} />;
}
