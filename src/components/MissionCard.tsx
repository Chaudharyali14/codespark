interface MissionCardProps {
  title: string;
  description: string;
}

const MissionCard: React.FC<MissionCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border-subtle transition-shadow hover:shadow-xl">
      <h3 className="text-2xl font-bold text-primary mb-2">{title}</h3>
      <p className="text-neutral-dark">{description}</p>
    </div>
  );
};

export default MissionCard;
