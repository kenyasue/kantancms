import EditUser from '../../components/EditUser';

export default async function EditUserPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return <EditUser id={id} />;
}
