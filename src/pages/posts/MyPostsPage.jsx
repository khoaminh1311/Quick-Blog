import Container from '../../components/common/Container';

export default function MyPostsPage() {
  return (
    <Container>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">MyPostsPage</h1>
        <p className="text-gray-600">List of logged in user's posts (Placeholder)</p>
      </div>
    </Container>
  );
}
