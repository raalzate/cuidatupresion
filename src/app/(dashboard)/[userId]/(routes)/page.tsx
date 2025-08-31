interface DashboardPageProps {
  params: {
    userId: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  return <div>Home</div>;
};

export default DashboardPage;
