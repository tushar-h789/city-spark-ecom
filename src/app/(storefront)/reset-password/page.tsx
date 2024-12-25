import ResetPasswordForm from "./_components/reset-password-form";

type SearchParams = Promise<{
  token?: string;
}>;

export default async function ResetPasswordPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  return <ResetPasswordForm token={searchParams.token} />;
}
