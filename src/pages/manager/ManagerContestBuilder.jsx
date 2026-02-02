
import { useNavigate } from "react-router-dom";
import ContestTemplateDesigner from "@/pages/admin/ContestTemplateDesigner";
import { useAuth } from "@/contexts/AuthContext";

const ManagerContestBuilder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClose = () => {
    navigate("/manager/contests");
  };

  // onSave callback receives the saved contest - the designer handles the success modal internally
  const handleSave = (savedContest) => {
    console.log("Contest saved by manager:", savedContest);
    // The ContestTemplateDesigner will show its own success modal
    // After user clicks "Done" in that modal, onClose will be called
  };

  return (
    <div className="min-h-screen">
      {/* Full-screen modal (prevents the inline blank state) */}
      <ContestTemplateDesigner
        isOpen={true}
        onClose={handleClose}
        onSave={handleSave}
        creatorRole="manager"
        inline={false}
      />
    </div>
  );
};

export default ManagerContestBuilder;
