// AddTeamCard Component
const AddTeamCard = ({ onClick }) => (
  <div
    className=" bg-dark rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-all hover:translate-y-[-4px]"
    onClick={onClick}
  >
    <div className="flex flex-col items-center text-primary">
      <svg
        className="h-10 w-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      <span className="mt-2 text-sm font-valorant">Create Team</span>
    </div>
  </div>
);
export default AddTeamCard;