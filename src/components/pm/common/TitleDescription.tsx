import PixelArtCircle from "./PixelArtCircle";

interface TitleDescriptionProps {
  data: {
    id: string;
    title: string;
    description: string;
  };
  buttons?: React.ReactNode[]; // Array of React nodes for flexibility
}

const TitleDescription: React.FC<TitleDescriptionProps> = ({
  data,
  buttons,
}) => {
  return (
    <header className="flex justify-between">
      <div className="space-y-4">
        <div className="flex items-center">
          <PixelArtCircle input={data.id} className="w-10 h-10" />
          <h1 className="text-xl font-bold text-gray-900">{data.title}</h1>
        </div>
        <p className="text-gray-600">{data.description}</p>
      </div>
      <div className="flex space-x-2">
        {/* Render passed buttons if provided */}
        {buttons?.map((button, index) => (
          <div key={index}>{button}</div>
        ))}
      </div>
    </header>
  );
};

export default TitleDescription;
