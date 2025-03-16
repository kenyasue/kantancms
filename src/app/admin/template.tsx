import AdminLayout from './layout';
import { metadata } from './metadata';

export { metadata };

export default function AdminTemplate({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <AdminLayout>{children}</AdminLayout>;
}
