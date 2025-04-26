interface FeatureCardProps {
  title: string;
  subtitle: string;
  description: string;
}

const FeatureCard = ({ title, subtitle, description }: FeatureCardProps) => {
  return (
    <div className="border border-[#D9D9D9] rounded-lg p-6 bg-[#fff]">
      <h3 className="text-xl text-[#293E40] font-semibold mb-2 text-left">{title}</h3>
      <p className="text-[#13B5CF] mb-3 text-left">{subtitle}</p>
      <p className="text-[#293E40] text-sm text-left">{description}</p>
    </div>
  );
};

export default FeatureCard;