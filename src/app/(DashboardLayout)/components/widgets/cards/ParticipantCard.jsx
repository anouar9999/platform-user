import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HelpCircle, Trophy, Shield, UserCircle, Users, PlusCircle } from 'lucide-react';
import Image from 'next/image';

const DefaultAvatar = ({ isTeam }) => (
  <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-100 via-gray-900 to-gray-900" />
    {isTeam ? (
      <Shield
        className="w-6 h-6 xs:w-8 xs:h-8 md:w-10 md:h-10 text-gray-400 relative z-10"
        strokeWidth={1.5}
      />
    ) : (
      <UserCircle
        className="w-6 h-6 xs:w-8 xs:h-8 md:w-10 md:h-10 text-gray-400 relative z-10"
        strokeWidth={1.5}
      />
    )}
    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-800 via-gray-800/50 to-transparent" />
  </div>
);

const ParticipantOrTeamCard = ({ item }) => {
  console.log(item)
  const isTeam = item.type === 'team';
  const isCurrentUser = !isTeam && localStorage.getItem('username') === item.username;
  const avatarSrc = isTeam
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.team_avatar}`
    : item.avatar;

  return (
    <div
      className="group relative bg-dark/80 angular-cut shadow-lg overflow-hidden
      backdrop-blur-sm duration-300 h-full"
    >
      <div className="relative h-14 xs:h-16 sm:h-20">
        {avatarSrc ? (
          <img
            className="w-full h-full object-cover"
            src={`${avatarSrc}`}
            alt={`${process.env.NEXT_PUBLIC_BACKEND_URL}${isTeam ? item.team_name : item.username}'s avatar`}
            width={192}
            height={128}
          />
        ) : (
          <DefaultAvatar isTeam={isTeam} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
      </div>

      <div className="p-2 xs:p-2.5 sm:p-3">
        <div className="flex items-center justify-between">
          <h5 className="text-xs xs:text-sm sm:text-base font-semibold text-white truncate">
            {isTeam ? item.team_name : item.username}
            {isCurrentUser && <span className="ml-1 text-xs text-primary">(You)</span>}
          </h5>
        </div>

        <div className="mt-0.5 xs:mt-1 flex items-center text-xs text-gray-400">
          {isTeam ? (
            <div className="mt-1">
            <div className="flex items-center justify-center mx-1 gap-3">
              <div className="flex items-center justify-between   rounded-md  text-xs font-mono text-gray-300">
                {/* <Clock size={12} className="mr-1.5 text-gray-400" /> */}
                <img
                  className="w-10 h-10"
                  src="https://curry.gg/uploads/703/64q9D5Bw2mASHeqoTlvoglqW7P7p1G-metaR29sZCAzLnBuZw==-.png"
                />
                {/* 
                <span className="pr-2">Registration Date</span> */}
                <span>{item.division}</span>
              </div>
              <div className="flex items-center justify-between px-1  rounded-md  text-xs font-mono text-gray-300">
                {/* <Clock size={12} className="mr-1.5 text-gray-400" /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="30"
                  viewBox="0 0 26 30"
                  fill="none"
                  class="svg replaced-svg"
                >
                  <path
                    d="M11.9316 3.16432C12.6156 2.76945 13.4582 2.76945 14.1422 3.16432L22.7342 8.12491C23.4181 8.51979 23.8394 9.24954 23.8394 10.0393V19.9605C23.8394 20.7502 23.4181 21.48 22.7342 21.8748L14.1422 26.8354C13.4582 27.2303 12.6156 27.2303 11.9316 26.8354L3.33964 21.8748C2.6557 21.48 2.23438 20.7502 2.23438 19.9605V10.0393C2.23438 9.24954 2.6557 8.51979 3.33964 8.12491L11.9316 3.16432Z"
                    fill="#0C1E2D"
                    class="color"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M21.2657 9.59158L13.6526 5.19612C13.2908 4.98726 12.8451 4.98726 12.4833 5.19612L4.87018 9.59158C4.50842 9.80044 4.28557 10.1864 4.28557 10.6042V19.3951C4.28557 19.8128 4.50842 20.1988 4.87018 20.4077L12.4833 24.8031C12.8451 25.012 13.2908 25.012 13.6526 24.8031L21.2657 20.4077C21.6275 20.1988 21.8503 19.8128 21.8503 19.3951V10.6042C21.8503 10.1864 21.6275 9.80044 21.2657 9.59158ZM14.0473 4.51242C13.4413 4.16253 12.6946 4.16253 12.0886 4.51242L4.47544 8.90788C3.86942 9.25777 3.49609 9.90438 3.49609 10.6042V19.3951C3.49609 20.0949 3.86942 20.7415 4.47544 21.0914L12.0886 25.4868C12.6946 25.8367 13.4413 25.8367 14.0473 25.4868L21.6605 21.0914C22.2665 20.7415 22.6398 20.0949 22.6398 19.3951V10.6042C22.6398 9.90438 22.2665 9.25777 21.6605 8.90788L14.0473 4.51242Z"
                    fill="url(#paint0_linear_3418_418224)"
                  ></path>
                  <path
                    opacity="0.14"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.7915 11.2258L13.4785 8.15832C13.2261 8.01256 12.915 8.01256 12.6626 8.15832L7.34956 11.2258C7.0971 11.3715 6.94158 11.6409 6.94158 11.9324V18.0673C6.94158 18.3589 7.0971 18.6282 7.34956 18.774L12.6626 21.8415C12.915 21.9872 13.2261 21.9872 13.4785 21.8415L18.7915 18.774C19.044 18.6282 19.1995 18.3589 19.1995 18.0673V11.9324C19.1995 11.6409 19.044 11.3715 18.7915 11.2258ZM13.754 7.68118C13.3311 7.437 12.81 7.437 12.3871 7.68118L7.07408 10.7486C6.65116 10.9928 6.39062 11.4441 6.39062 11.9324V18.0673C6.39062 18.5557 6.65116 19.007 7.07408 19.2511L12.3871 22.3186C12.81 22.5628 13.3311 22.5628 13.754 22.3186L19.067 19.2511C19.4899 19.007 19.7505 18.5557 19.7505 18.0673V11.9324C19.7505 11.4441 19.4899 10.9928 19.067 10.7486L13.754 7.68118Z"
                    fill="url(#paint1_linear_3418_418224)"
                  ></path>
                  <path
                    d="M20.5299 8.95605H22.9155V17.6858L20.5299 16.4549V15.5372L5.35825 16.4548V9.22589L20.5299 8.95605Z"
                    fill="#0C1E2D"
                    class="color"
                  ></path>
                  <path
                    d="M5.35825 9.22589H2.97266V17.6858L5.35825 16.4548V9.22589Z"
                    fill="#0C1E2D"
                    class="color"
                  ></path>
                  <path
                    d="M5.53516 14.1448C5.53454 13.8117 5.70888 13.5027 5.99434 13.3311L12.4459 9.45187C12.7463 9.27125 13.1218 9.27125 13.4222 9.45187L19.8738 13.3311C20.1592 13.5027 20.3336 13.8117 20.3329 14.1448L20.3329 14.1452L20.3323 14.5337L20.3309 15.462C20.3301 16.1817 20.3294 17.0207 20.3304 17.5031C20.331 17.8403 20.1524 18.1524 19.8614 18.3227C19.5704 18.493 19.2107 18.4957 18.9171 18.3299L18.9169 18.3297L18.6418 18.1744L17.9152 17.7644C17.3137 17.425 16.5113 16.9726 15.7079 16.5202C14.9043 16.0677 14.1002 15.6156 13.4949 15.2768C13.2792 15.156 13.0893 15.05 12.934 14.9636C12.7788 15.05 12.5889 15.156 12.3732 15.2768C11.7679 15.6156 10.9638 16.0677 10.1602 16.5202C9.35677 16.9726 8.55444 17.425 7.95293 17.7644L7.22634 18.1744L6.95093 18.3299C6.65733 18.4957 6.29773 18.493 6.00669 18.3227C5.71566 18.1524 5.53705 17.8403 5.53771 17.5031C5.53866 17.0207 5.53802 16.1817 5.53715 15.462L5.53582 14.5337L5.53516 14.1448Z"
                    fill="#0C1E2D"
                    class="color"
                  ></path>
                  <path
                    d="M12.9782 13.9438C13.0159 13.9438 19.4271 17.5644 19.4271 17.5644C19.4252 16.5962 19.4297 14.2025 19.4297 14.2025L12.9782 10.3232L6.52665 14.2025C6.52665 14.2025 6.5311 16.5962 6.5292 17.5644C6.5292 17.5644 12.9404 13.9438 12.9782 13.9438Z"
                    fill="url(#paint2_linear_3418_418224)"
                  ></path>
                  <path
                    d="M3.80078 7.53473C3.80017 7.20309 3.97303 6.89527 4.25652 6.72317L12.5032 1.71665C12.8053 1.53325 13.1844 1.53325 13.4865 1.71665L21.7332 6.72317C22.0167 6.89527 22.1896 7.20309 22.189 7.53473L22.1881 8.03674L22.1864 9.23499C22.1853 10.1638 22.1845 11.247 22.1857 11.8701C22.1864 12.208 22.007 12.5207 21.715 12.6907C21.423 12.8607 21.0625 12.8623 20.769 12.6949L20.417 12.4943L19.4882 11.965C18.7193 11.527 17.6936 10.9431 16.6665 10.3592C15.6392 9.77517 14.6112 9.19155 13.8371 8.75409C13.5007 8.56392 13.2131 8.40189 12.9949 8.27963C12.7766 8.40189 12.4891 8.56392 12.1526 8.75409C11.3786 9.19155 10.3505 9.77517 9.32325 10.3592C8.29615 10.9431 7.27049 11.527 6.50157 11.965L5.57275 12.4943L5.22067 12.695C4.92715 12.8623 4.56671 12.8607 4.27473 12.6907C3.98274 12.5207 3.80339 12.208 3.80405 11.8701C3.80526 11.247 3.80444 10.1638 3.80332 9.23499L3.80163 8.03674L3.80078 7.53473Z"
                    fill="#0C1E2D"
                    class="color"
                  ></path>
                  <path
                    d="M12.9928 7.24013C13.0411 7.24013 21.2363 11.9129 21.2363 11.9129C21.2339 10.6632 21.2395 7.5739 21.2395 7.5739L12.9928 2.56738L4.74609 7.5739C4.74609 7.5739 4.75178 10.6632 4.74936 11.9129C4.74936 11.9129 12.9445 7.24013 12.9928 7.24013Z"
                    fill="url(#paint3_linear_3418_418224)"
                  ></path>
                  <defs>
                    <linearGradient
                      id="paint0_linear_3418_418224"
                      x1="13.068"
                      y1="2.92067"
                      x2="13.068"
                      y2="20.9207"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="white"></stop>
                      <stop offset="1" stop-color="#9BA2BC"></stop>
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_3418_418224"
                      x1="13.0705"
                      y1="6.57035"
                      x2="13.0705"
                      y2="19.132"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="white"></stop>
                      <stop offset="1" stop-color="#9BA2BC"></stop>
                    </linearGradient>
                    <linearGradient
                      id="paint2_linear_3418_418224"
                      x1="5.77287"
                      y1="10.3618"
                      x2="20.6614"
                      y2="11.7605"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#FEE894"></stop>
                      <stop offset="1" stop-color="#FFC549"></stop>
                    </linearGradient>
                    <linearGradient
                      id="paint3_linear_3418_418224"
                      x1="2.47944"
                      y1="3.55237"
                      x2="19.3959"
                      y2="15.3022"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#FEE894"></stop>
                      <stop offset="1" stop-color="#FFC549"></stop>
                    </linearGradient>
                  </defs>
                </svg>{' '}
                {/* 
                <span className="pr-2">Registration Date</span> */}
                <span>{item.total_members} Players</span>
              </div>
              
            </div>
        
          </div>
          ) : (
            <>
              
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ParticipantCardGrid = ({ tournamentId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tournamentType, setTournamentType] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_accepted_participants.php?tournament_id=${tournamentId}`,
        );
        if (response.data.success) {
          setParticipants(response.data.participants);
          setTournamentType(response.data.tournament_type);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch participants. Please try again later.');
        console.error('Error fetching participants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [tournamentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32 xs:h-40 sm:h-48">
        <div className="animate-spin rounded-full h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center text-xs xs:text-sm sm:text-base p-4">{error}</div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="text-center my-8 p-6   max-w-md mx-auto">
        <div className="relative">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Users className="text-primary w-8 h-8" />
          </div>
        </div>

        <h3 className="text-lg font-valorant text-white mb-2">No Participants Registered</h3>

        <p className="text-gray-400 mb-6 font-mono">
          Join the competition and showcase your skills!
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 xs:px-3 sm:px-4">
      <div
        className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
        gap-2 xs:gap-3 sm:gap-4"
      >
        {participants.map((item) => (
          <ParticipantOrTeamCard key={`participant-${item.registration_id}`} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ParticipantCardGrid;
