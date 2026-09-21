import { useParams } from 'react-router-dom';
import Container from '../../components/common/Container';

export default function PostDetailPage() {
  const { postId } = useParams();
  
  return (
    <Container>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">PostDetailPage</h1>
        <p className="text-gray-600">Displaying post ID: {postId} (Placeholder)</p>
      </div>
    </Container>
  );
}
