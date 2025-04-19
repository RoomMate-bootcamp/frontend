import Layout from '@/components/Layout';
import Chat from '@/components/Chat';

export default function Ai() {
  return (
    <Layout>
      <Chat currentChat="ai" setCurrentChat={() => {}} />
    </Layout>
  )
}