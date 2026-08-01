import Button from '@components/common/Button';

/**
 * Sign-in submit button — wraps the generic Button primitive.
 */
const SignInButton = ({ loading = false, disabled = false }) => {
  return (
    <Button type="submit" loading={loading} disabled={disabled}>
      Sign In
    </Button>
  );
};

export default SignInButton;
