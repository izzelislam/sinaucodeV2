import CustomLogin from '@/Components/Auth/CustomLogin';

export default function Login({ status, canResetPassword }) {
    return <CustomLogin status={status} canResetPassword={canResetPassword} />;
}
