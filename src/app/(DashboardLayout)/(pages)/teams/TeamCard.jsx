import { Users } from "lucide-react";

const TeamCard = ({ team, onClick, isInMyTeams }) => {
  const memberCount = team.members?.length || 0;
  const matches = team.stats?.matches || 0;
  const avgSkillLevel = team.stats?.avgSkillLevel || 0;
  const organizerName = team.organizer || 'Team Owner';

  return (
    <div
      className="bg-black angular-cut overflow-hidden cursor-pointer 
                 transition-all duration-300  
                 border border-gray-800/50 h-full flex flex-col relative"
      onClick={() => onClick(team)}
    >
      {/* Header with background pattern/image */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black">
        {team.logo ? (

          <div className="relative w-full h-full">
            <img
              className="w-full h-full object-cover opacity-30 hover:scale-105 transition-transform duration-500"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.logo}`}
              alt={`${team.name} banner`}
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
          </div>
        ) : (
          <div className="w-full h-full relative">
            {/* Abstract pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        )}
        
        {/* Member count badge - top right */}
        <div className="absolute top-12 -left-6 flex items-center gap-1.5   px-3  rounded-md">
 {/* Team logo and info section */}
      <div className="px-6 -pt-24 pb-4 z-50">
        <div className="flex items-center gap-4">
          {/* Team logo */}
          <div className="w-14 h-14 border-4 border-gray-900 bg-gray-800 shadow-xl flex-shrink-0  flex items-center justify-center rounded-full">
            {team.logo ? (
              <img
                className="w-full h-full object-cover rounded-full"
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.logo}`}
                alt={`${team.name} logo`}
              />
            ) : (
              <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                <UserCircle className="w-12 h-12 text-gray-500" />
              </div>
            )}
          </div>
          {/* Team info next to logo */}
          <div className="flex flex-col min-w-0 font-circular-web">
            <h3 className="text-white font-zentry text-xl mb-1 truncate">{team.name}</h3>
            <div className="flex items-center gap-1.5 text-md text-gray-400 mb-1">
              <span>Organisé(e) par</span>
              <span className="text-primary font-bold    uppercase
              ">{organizerName}</span>
              {team.verified && (
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-gray-400 text-md">
              {memberCount.toLocaleString()} membres
            </p>
          </div>
        </div>
      </div>        </div>
      </div>

     

      {/* Content section */}
      <div className="px-6 pb-6 flex-1 flex flex-col">
        {/* Description preview */}
        {team.description && (
          <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed font-circular-web">
            {team.description}
          </p>
        )}

        {/* Stats section - prominent display */}
        <div className="flex items-center justify-between py-4 px-4 bg-black/30 rounded-lg border border-gray-800/50 mt-auto">
          <div className="flex flex-col items-center flex-1">
            <span className="text-white font-bold text-2xl">{matches.toLocaleString()}</span>
            <span className="text-gray-500 text-xs mt-1">Matches (7 days)</span>
          </div>
          
          <div className="w-px h-12 bg-gray-800"></div>
          
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"></div>
              </div>
            </div>
            <span className="text-gray-500 text-xs">Avg. Skill Level</span>
          </div>
        </div>

      </div>
    </div>
  );
};
export default TeamCard;