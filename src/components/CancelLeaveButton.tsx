import React from 'react';
import { Button } from './ui/button';

const CancelLeaveButton = (): React.JSX.Element => {
  return (
    <Button className="w-full cursor-pointer" type="button" variant="destructive">
      Cancel Leave
    </Button>
  );
};

export default CancelLeaveButton;
