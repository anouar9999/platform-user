import React, { useState, useEffect } from 'react';
import { Users, X, Shield, Trophy } from 'lucide-react';

const TeamSelectionDialog = ({ isOpen, onClose, onTeamSelect }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (isOpen && userId) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_user_teams.php?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setTeams(data.teams || []);
            console.log(data.teams);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-gray-900/70 to-secondary backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-secondary angular-cut backdrop-blur-md  w-full max-w-4xl h-[90vh] transform transition-all shadow-xl">
        <div className="border-b border-gray-700/50 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl flex flex-col wider font-custom text-white"><span>Select Team</span>
              <p className='text-xs font-pilot  text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem reiciendis fugiat atque aperiam voluptate quibusdam eos reprehenderit, e</p>
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-700/50 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No teams found</p>
              <p className="text-gray-500 mt-2">Create a team first to join team tournaments</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {teams.map((team, index) => (
              <div 
  key={team.id} 
  onClick={() => {
    onTeamSelect(team.id);
    onClose();
  }}
  className="relative     overflow-hidden cursor-pointer
            transform transition-all duration-300 hover:scale-[1.03]
             hover:border-primary/50 group
            shadow-xl hover:shadow-primary/20"
  style={{
    backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${team.banner || '/images/default-team-bg.jpg'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  {/* Primary overlay gradient */}
  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-90 group-hover:opacity-75 transition-opacity"></div>
  
  {/* Accent overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

 

  {/* Content wrapper */}
  <div className="relative h-full z-10 p-6 flex flex-col justify-end">
    {/* Team stats */}
    <div className="flex space-x-3 mb-4">
      <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full 
                     flex items-center space-x-2 ">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="31" viewBox="0 0 26 31" fill="none" class="svg replaced-svg">
<path d="M12.1152 4.03248C12.7992 3.63761 13.6418 3.63761 14.3258 4.03248L22.9178 8.99308C23.6017 9.38795 24.023 10.1177 24.023 10.9074V20.8286C24.023 21.6184 23.6017 22.3481 22.9178 22.743L14.3258 27.7036C13.6418 28.0985 12.7992 28.0985 12.1152 27.7036L3.52323 22.743C2.83929 22.3481 2.41797 21.6184 2.41797 20.8286V10.9074C2.41797 10.1177 2.83929 9.38795 3.52323 8.99308L12.1152 4.03248Z" fill="#0C1E2D" class="color"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.4181 10.4597L13.8049 6.06428C13.4431 5.85542 12.9974 5.85542 12.6357 6.06428L5.02252 10.4597C4.66076 10.6686 4.43791 11.0546 4.43791 11.4723V20.2632C4.43791 20.681 4.66076 21.067 5.02252 21.2758L12.6357 25.6713C12.9974 25.8801 13.4431 25.8801 13.8049 25.6713L21.4181 21.2758C21.7798 21.067 22.0027 20.681 22.0027 20.2632V11.4723C22.0027 11.0546 21.7798 10.6686 21.4181 10.4597ZM14.1996 5.38058C13.5936 5.03069 12.847 5.03069 12.2409 5.38058L4.62778 9.77604C4.02176 10.1259 3.64844 10.7725 3.64844 11.4723V20.2632C3.64844 20.963 4.02176 21.6096 4.62778 21.9595L12.2409 26.355C12.847 26.7049 13.5936 26.7049 14.1996 26.355L21.8128 21.9595C22.4188 21.6096 22.7922 20.963 22.7922 20.2632V11.4723C22.7922 10.7725 22.4188 10.1259 21.8128 9.77604L14.1996 5.38058Z" fill="url(#paint0_linear_3418_418199)"></path>
<rect x="11.0078" y="5.13184" width="5.05263" height="4.89474" fill="#0C1E2D" class="color"></rect>
<path d="M6.90844 6.34324C7.92559 5.72165 9.40421 5.76471 9.40421 5.76471L9.40419 8.49929L5.25363 8.22013C5.25363 8.22013 5.89128 6.96483 6.90844 6.34324Z" fill="#0C1E2D" class="color"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.5858 10.3964C14.6181 9.86796 14.7214 9.63112 14.7214 9.63112C14.7214 9.63112 13.1336 8.59758 12.5109 7.81533C11.961 7.12461 11.5635 5.7627 11.5635 5.7627L11.0109 6.55217C11.0109 6.55217 8.00539 5.88194 6.56021 7.25565C5.67876 8.09351 5.27682 9.28234 4.87654 10.4663C4.73698 10.8791 4.59762 11.2912 4.43821 11.6877C4.43821 14.7667 4.4375 20.2117 4.4375 20.2117L9.58985 21.2364L10.2729 16.98C10.2729 16.98 11.5761 14.9965 12.0475 14.3477C13.1655 15.6254 14.5817 16.8498 14.5817 16.8498L18.4858 14.9507V15.4024L19.5856 14.4799L19.8577 12.4621L15.3674 13.7482C15.3674 13.7482 14.9538 12.9756 14.3795 12.1169C14.5916 11.6879 14.6926 11.2 14.6181 10.6393L14.5858 10.3964Z" fill="url(#paint1_linear_3418_418199)"></path>
<path d="M5.14062 19.1899L4.76989 10.8301L4.43957 11.3609V19.8857L5.14062 21.1887L5.14062 19.1899Z" fill="#0C1E2D" class="color"></path>
<path d="M7.63119 8.06121C8.40296 7.53501 10.1774 7.19996 10.1774 7.19996C10.1774 7.19996 8.43804 7.1298 7.4441 7.7221C6.45015 8.31441 5.68501 10.4492 5.68501 10.4492C5.68501 10.4492 6.85942 8.58742 7.63119 8.06121Z" fill="#0C1E2D" class="color"></path>
<path d="M12.3649 14.6683L10.7457 12.8265L11.6155 14.9893L12.3649 14.6683Z" fill="#0C1E2D" class="color"></path>
<path d="M14.685 11.7496L12.8291 10.5503L14.3808 12.1362L14.685 11.7496Z" fill="#0C1E2D" class="color"></path>
<path d="M18.3806 4.26131C18.3806 4.26131 18.6022 4.71213 18.6293 5.02448C18.6562 5.33502 18.5175 5.81472 18.5175 5.81472L18.6273 6.71661L18.7797 7.19371L18.1482 7.365C18.1482 7.365 18.0953 9.014 17.3508 9.34401C17.0063 9.49668 16.3884 9.38402 16.3884 9.38402C16.3884 9.38402 12.6797 7.99984 12.5991 6.06078C12.5185 4.12172 13.7726 2.49495 15.4003 2.42727C17.6378 2.33425 18.3806 4.26131 18.3806 4.26131Z" fill="url(#paint2_linear_3418_418199)"></path>
<path d="M18.3806 4.26131C18.3806 4.26131 18.6022 4.71213 18.6293 5.02448C18.6562 5.33502 18.5175 5.81472 18.5175 5.81472L18.6273 6.71661L18.7797 7.19371L18.1482 7.365C18.1482 7.365 18.0953 9.014 17.3508 9.34401C17.0063 9.49668 16.3884 9.38402 16.3884 9.38402C16.3884 9.38402 12.6797 7.99984 12.5991 6.06078C12.5185 4.12172 13.7726 2.49495 15.4003 2.42727C17.6378 2.33425 18.3806 4.26131 18.3806 4.26131Z" fill="#DFE2EA"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.3892 9.38352C16.3892 9.38352 12.6805 7.99934 12.5999 6.06028C12.5192 4.12122 13.7734 2.49444 15.4011 2.42677C17.6385 2.33375 18.3814 4.2608 18.3814 4.2608C18.3814 4.2608 18.6029 4.71163 18.63 5.02397C18.657 5.33451 18.5183 5.81421 18.5183 5.81421L18.6281 6.7161L18.7805 7.19321L18.1489 7.3645C18.1489 7.3645 18.0961 9.0135 17.3516 9.34351C17.0071 9.49618 16.3892 9.38352 16.3892 9.38352ZM18.5938 7.73463C18.5749 7.90064 18.5433 8.11367 18.4906 8.33833C18.4323 8.58722 18.3438 8.86942 18.2061 9.12192C18.0703 9.37086 17.862 9.63537 17.5435 9.77656C17.2634 9.9007 16.9268 9.90348 16.7195 9.89395C16.6046 9.88867 16.5032 9.87791 16.4305 9.86852C16.3939 9.86379 16.3639 9.85933 16.3423 9.85592C16.3316 9.85421 16.3228 9.85276 16.3164 9.85166L16.3085 9.85029L16.3059 9.84983L16.305 9.84965L16.3044 9.84955C16.3043 9.84953 16.3042 9.84952 16.3892 9.38352C16.2236 9.8273 16.2235 9.82726 16.2233 9.82721L16.223 9.82709L16.2221 9.82675L16.2193 9.8257L16.2097 9.82206C16.2016 9.81896 16.19 9.81452 16.1753 9.80876C16.1458 9.79724 16.1034 9.78043 16.05 9.75854C15.9433 9.71479 15.7921 9.65058 15.611 9.56749C15.2499 9.40186 14.7642 9.15868 14.2729 8.85022C13.7845 8.5436 13.2726 8.16141 12.8725 7.71291C12.4745 7.26677 12.153 6.71609 12.1266 6.07995C12.0385 3.96051 13.4181 2.03512 15.3814 1.95349C16.6576 1.90044 17.5263 2.42958 18.0669 2.97566C18.3337 3.24515 18.5196 3.51706 18.6395 3.72236C18.6996 3.82542 18.7438 3.91292 18.7738 3.97668C18.7888 4.0086 18.8003 4.03469 18.8085 4.05395C18.8109 4.05954 18.813 4.06457 18.8148 4.06899C18.8161 4.07183 18.8176 4.075 18.8193 4.07849C18.8265 4.09383 18.8365 4.11537 18.8485 4.14192C18.8722 4.19476 18.9042 4.26877 18.9373 4.35419C18.9987 4.51289 19.0823 4.75617 19.1019 4.98303C19.1215 5.20855 19.0817 5.46118 19.049 5.62719C19.0317 5.71504 19.0135 5.79189 18.9995 5.84753L19.0929 6.61453L19.2317 7.04909C19.271 7.17223 19.2583 7.30609 19.1965 7.41964C19.1347 7.53318 19.0292 7.61654 18.9045 7.65038L18.5938 7.73463ZM16.2236 9.8273L16.3892 9.38352L16.3042 9.84952C16.2768 9.84451 16.2498 9.83707 16.2236 9.8273Z" fill="#0C1E2D" class="color"></path>
<path d="M18.38 4.12352C18.38 4.12352 17.0192 2.93756 16.4696 3.15531C15.92 3.37307 17.1854 3.72246 16.8434 5.13758C16.5015 6.55269 16.0939 6.38691 16.0939 6.38691C16.0939 6.38691 16.2532 5.36276 15.6554 5.18697C14.8718 4.95658 14.8073 6.1115 15.6635 6.55099C15.066 8.24473 15.2403 7.7624 15.2403 7.7624L13.7643 7.89685C13.7643 7.89685 12.6252 7.66403 12.5534 5.93721C12.4721 3.9828 13.736 2.34315 15.3764 2.27495C17.6313 2.1812 18.38 4.12352 18.38 4.12352Z" fill="#0C1E2D" class="color"></path>
<path d="M17.1478 6.175L17.3934 5.9725L18.2894 5.73112L18.1429 6.36398L17.7851 6.26635L17.1478 6.175Z" fill="#0C1E2D" class="color"></path>
<path d="M4.53906 20.7334L9.71924 21.8936L10.8403 24.6801C10.8403 24.6801 6.052 21.8918 4.83553 21.1838C4.57493 20.8768 4.53906 20.7334 4.53906 20.7334Z" fill="url(#paint3_linear_3418_418199)"></path>
<path d="M4.5389 20.7338L4.44074 20.2704L4.44076 19.7456L4.90379 19.8046L5.03922 20.4893L5.16826 20.9545L7.82654 22.4851L11.1142 24.2364L10.8401 24.6805C10.8401 24.6805 6.05184 21.8922 4.83536 21.1842C4.57477 20.8772 4.5389 20.7338 4.5389 20.7338Z" fill="#0C1E2D" class="color"></path>
<path d="M21.3419 11.9424L23.5524 12.321V17.1163L22.632 21.8272L20.2812 23.3728L20.5023 21.464L21.085 20.8813L21.3419 11.9424Z" fill="#0C1E2D" class="color"></path>
<path d="M23.2984 14.9726L21.2438 30.1267L20.0705 30.1267L22.134 15.8019C22.134 15.8019 21.4226 15.5542 21.094 15.5634C20.4727 15.5807 20.0624 16.0238 19.7511 16.2114C19.4397 16.399 19.2508 16.5313 18.9681 16.3887C18.3713 16.0877 18.9602 15.5895 18.9602 15.5895C18.9602 15.5895 19.6585 14.9444 20.2151 14.7495C20.6156 14.6092 20.8645 14.596 21.2886 14.5809C22.0877 14.5525 23.2984 14.9726 23.2984 14.9726Z" fill="url(#paint4_linear_3418_418199)"></path>
<path d="M20.3074 12.6202L20.9375 13.103C21.5087 13.0368 22.4893 12.7186 22.8304 13.103C23.2566 13.5835 24.0712 14.5142 23.6887 14.6588C23.3827 14.7745 22.4861 14.6151 22.0111 14.3736L20.6905 14.3736L20.1425 14.4508L20.3074 12.6202Z" fill="url(#paint5_linear_3418_418199)"></path>
<defs>
<linearGradient id="paint0_linear_3418_418199" x1="13.2203" y1="3.78884" x2="13.2203" y2="21.7888" gradientUnits="userSpaceOnUse">
<stop stop-color="white"></stop>
<stop offset="1" stop-color="#9BA2BC"></stop>
</linearGradient>
<linearGradient id="paint1_linear_3418_418199" x1="20.7585" y1="5.84505" x2="2.85793" y2="6.78557" gradientUnits="userSpaceOnUse">
<stop stop-color="#FEE894"></stop>
<stop offset="1" stop-color="#FFC549"></stop>
</linearGradient>
<linearGradient id="paint2_linear_3418_418199" x1="18.9353" y1="2.31787" x2="11.8363" y2="2.9394" gradientUnits="userSpaceOnUse">
<stop stop-color="#FEE894"></stop>
<stop offset="1" stop-color="#FFC549"></stop>
</linearGradient>
<linearGradient id="paint3_linear_3418_418199" x1="11.7291" y1="22.0633" x2="3.76664" y2="21.6716" gradientUnits="userSpaceOnUse">
<stop stop-color="#FEE894"></stop>
<stop offset="1" stop-color="#FFC549"></stop>
</linearGradient>
<linearGradient id="paint4_linear_3418_418199" x1="18.7658" y1="14.0918" x2="24.6804" y2="15.3529" gradientUnits="userSpaceOnUse">
<stop stop-color="#FEE894"></stop>
<stop offset="1" stop-color="#FFC549"></stop>
</linearGradient>
<linearGradient id="paint5_linear_3418_418199" x1="21.8179" y1="12.3722" x2="21.9521" y2="14.2865" gradientUnits="userSpaceOnUse">
<stop stop-color="white"></stop>
<stop offset="1" stop-color="#9BA2BC"></stop>
</linearGradient>
</defs>
</svg> 
        <span className="text-sm font-medium text-gray-200">
          {team.member_count} {team.member_count === 1 ? 'member' : 'members'}
        </span>
      </div>
      <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full 
                     flex items-center space-x-2 ">
                      <img className="w-7 h-7" src="https://curry.gg/uploads/703/64q9D5Bw2mASHeqoTlvoglqW7P7p1G-metaR29sZCAzLnBuZw==-.png" />

        <span className="text-sm font-medium text-gray-200">
          {team.rank || 'Unranked'}
        </span>
      </div>
    </div>

    {/* Team icon and name */}
    <div className="flex items-center space-x-4">
      <div className="bg-gray-900/80 p-4 rounded-xl group-hover:bg-primary/20 
                     transition-all duration-300 backdrop-blur-sm border border-gray-700/50"
                     style={{
                      backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${team.logo || '/images/default-team-bg.jpg'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                     >

      </div>
      <div>
        <h3 className="font-ea-football tracking-widest text-xl text-white mb-1 group-hover:text-primary transition-colors">
          {team.name}
        </h3>
        <p className="text-gray-400 text-sm font-mono">
          Click to select for tournament
        </p>
      </div>
    </div>

    {/* Hover effect line */}
    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
  </div>
</div>
))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamSelectionDialog;