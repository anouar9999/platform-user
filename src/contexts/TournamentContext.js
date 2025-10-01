import React, { createContext, useContext, useState, useCallback } from 'react';

const TournamentContext = createContext();

export const useTournament = () => useContext(TournamentContext);

export const TournamentProvider = ({ children }) => {
  const [tournament, setTournament] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [teamName, setTeamName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resetStates = useCallback(() => {
    setHasJoined(false);
    setRegistrationStatus(null);
    setTeamName(null);
    setUserRole(null);
    setRegistrationDetails(null);
  }, []);

  const checkJoinStatus = useCallback(async (tournamentId) => {
    try {
   const userDataString = localStorage.getItem("authData");
const userData = JSON.parse(userDataString);

    const userId = userData?.userId ;
      if (!userId) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_check_tournament_join.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournament_id: tournamentId, user_id: userId }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('checkJoinStatus')
        console.log(data)
        setHasJoined(data.has_joined);
        setTournament(prev => ({
          ...prev,
          tournament_status: data.tournament_status,
          current_registrations: data.current_registrations
        }));
        
        if (data.has_joined && data.registrations?.length > 0) {
          const registration = data.registrations[0];
          
          setRegistrationStatus(registration.status);
          setRegistrationDetails({
            id: registration.id,
            registrationDate: registration.registration_date,
            username: registration.username || null
          });

          if (data.tournament_type === 'team') {
            setTeamName(registration.team_name);
            setUserRole(registration.role);
          }
        } else {
          resetStates();
        }
      } else {
        console.error('Error checking join status:', data.message);
        resetStates();
        setError(data.message || 'Failed to check registration status');
      }
    } catch (error) {
      console.error('Error checking join status:', error);
      resetStates();
      setError('An error occurred while checking registration status');
    } finally {
      setLoading(false);
    }
  }, [resetStates]);

  const fetchTournament = useCallback(async (slug) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/single_tournament.php?slug=${slug}`
      );
      const data = await response.json();

      if (data.success) {
        console.log(data.tournament)
        setTournament(data.tournament);
        await checkJoinStatus(data.tournament.id);
      } else {
        setError(data.message || 'Failed to fetch tournament data');
        resetStates();
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while fetching tournament data');
      resetStates();
    } finally {
      setLoading(false);
    }
  }, [checkJoinStatus, resetStates]);

  const value = {
    tournament,
    hasJoined,
    registrationStatus,
    teamName,
    userRole,
    registrationDetails,
    loading,
    error,
    checkJoinStatus,
    fetchTournament,
    setHasJoined,
    resetStates
  };

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
};
