interface DashboardPageProps {
  params: Promise<{ userId: string }>;
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  return <div>Homeee</div>;
};

export default DashboardPage;
