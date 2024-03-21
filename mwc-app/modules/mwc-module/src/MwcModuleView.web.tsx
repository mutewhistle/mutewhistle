import * as React from 'react';

import { MwcModuleViewProps } from './MwcModule.types';

export default function MwcModuleView(props: MwcModuleViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
