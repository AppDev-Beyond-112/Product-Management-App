import CardGrid from '../Components/CardGrid';

function Dashboard({ searchTerm }) {
  return (
    <div>
      <CardGrid searchTerm={searchTerm} />
    </div>
  );
}

export default Dashboard;