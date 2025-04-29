import { useState } from "react";

const useTeamsData = (userId) => {
  const [teamsData, setTeamsData] = useState({
    allTeams: [],
    myTeams: [],
    isLoading: true,
    error: null,
  });

  const fetchTeams = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/get_teams.php`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Better error handling
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || `HTTP error! status: ${response.status}`;
        } catch {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.success) {
        const allTeamsData = result.data || [];
        const userOwnedTeams = allTeamsData.filter(
          (team) =>
            parseInt(team.owner_id) === userId ||
            team.members?.some((member) => parseInt(member.user_id) === userId),
        );

        setTeamsData({
          allTeams: allTeamsData,
          myTeams: userOwnedTeams,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(result.message || 'Failed to fetch teams');
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeamsData((prev) => ({
        ...prev,
        isLoading: false,
        error,
      }));
      // Don't use toast directly, let the component handle errors
      return error;
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchTeams();
    } else {
      setTeamsData({
        allTeams: [],
        myTeams: [],
        isLoading: false,
        error: null,
      });
    }
  }, [userId, fetchTeams]);

  return { ...teamsData, refreshTeams: fetchTeams };
};