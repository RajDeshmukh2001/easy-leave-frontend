import React from 'react';
import { Button } from './ui/button';

type CancelLeaveButtonProps = {
  handleCancelLeave: () => Promise<void>;
};

const CancelLeaveButton = ({ handleCancelLeave }: CancelLeaveButtonProps): React.JSX.Element => {
  return (
    <Button
      className="w-full cursor-pointer"
      type="button"
      variant="destructive"
      onClick={handleCancelLeave}
    >
      Cancel Leave
    </Button>
  );
};

export default CancelLeaveButton;
