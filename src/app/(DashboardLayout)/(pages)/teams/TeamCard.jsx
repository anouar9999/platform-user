import { UserCircle } from "lucide-react";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const TeamCard = ({ team, onClick }) => (
    
    <div
      className="bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer 
                 transition-all duration-300 hover:-translate-y-1 h-full"
      onClick={() => onClick(team)}
    >
      <div className="relative aspect-video">
        {team.image ? (
          <img
            className="w-full h-full object-cover"
            src={`${BACKEND_URL}/${team.image}`}
            alt={`${team.name} logo`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <UserCircle className="w-16 h-16 sm:w-20 sm:h-20 text-gray-500" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 sm:p-4">
          <h5 className="text-lg sm:text-xl font-semibold text-white truncate">{team.name}</h5>
        </div>
      </div>
    </div>
  );
export default TeamCard;