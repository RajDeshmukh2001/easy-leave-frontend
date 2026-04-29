type UserProfileProps = {
  name: string | undefined;
  email: string | undefined;
  mainClass?: string;
  avatarClass?: string;
  nameClass?: string;
  emailClass?: string;
};

const UserProfile = ({
  name,
  email,
  mainClass = 'items-center',
  avatarClass = 'h-8 w-8 bg-(--technogise-blue) text-white font-medium',
  nameClass = 'text-sm font-medium text-sidebar-accent-foreground',
  emailClass = 'text-xs text-sidebar-foreground/50 ',
}: UserProfileProps): React.JSX.Element => {
  return (
    <div className={`flex gap-3 ${mainClass}`}>
      <div className={`shrink-0 flex items-center justify-center rounded-full ${avatarClass}`}>
        <div className="bg-transparent">{name?.charAt(0).toLocaleUpperCase()}</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`truncate ${nameClass}`}>{name}</p>
        <p className={`truncate ${emailClass}`}>{email}</p>
      </div>
    </div>
  );
};

export default UserProfile;
