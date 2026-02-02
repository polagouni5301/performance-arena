import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Upload, 
  Gift, 
  Shield,
  AlertTriangle,
  Plus,
  ArrowRight,
  Coins
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

const categories = [
  "Electronics & Gadgets",
  "Gift Cards & Vouchers",
  "Experiences",
  "Physical Gifts",
  "Perks & Benefits"
];

const tiers = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];

const AddRewardModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "Sony WH-1000XM5 Headphone",
    category: "Electronics & Gadgets",
    description: "",
    pointCost: 4500,
    initialStock: 50,
    alertThreshold: 5,
    minRank: 2, // 0-3 for Bronze-Platinum
    departments: ["Sales Team", "Customer Success"]
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [newDepartment, setNewDepartment] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addDepartment = () => {
    if (newDepartment.trim() && !formData.departments.includes(newDepartment.trim())) {
      setFormData(prev => ({
        ...prev,
        departments: [...prev.departments, newDepartment.trim()]
      }));
      setNewDepartment("");
    }
  };

  const removeDepartment = (dept) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.filter(d => d !== dept)
    }));
  };

  const handlePublish = () => {
    console.log("Publishing reward:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Add New Reward</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Configure details, pricing, and eligibility for the reward vault.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Reward Details */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-2">
                    REWARD VISUAL
                  </label>
                  <label className="block cursor-pointer">
                    <div className={cn(
                      "w-full h-48 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center transition-colors",
                      "hover:border-primary/50 hover:bg-primary/5",
                      imagePreview && "border-solid p-2"
                    )}>
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                            <Upload className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Name & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2">Reward Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border text-foreground focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the reward features and redemption details..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>

              {/* Right Column - Settings */}
              <div className="space-y-6">
                {/* Economy Settings */}
                <div className="p-4 rounded-xl bg-muted/20 border border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Gift className="w-5 h-5 text-warning" />
                    <h3 className="font-semibold text-foreground">Economy Settings</h3>
                  </div>

                  {/* Point Cost */}
                  <div className="mb-4">
                    <label className="block text-xs text-muted-foreground mb-2">Point Cost</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Coins className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <input
                        type="number"
                        value={formData.pointCost}
                        onChange={(e) => setFormData(prev => ({ ...prev, pointCost: parseInt(e.target.value) || 0 }))}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-muted/30 border border-border text-foreground text-lg font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Stock & Alert */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Initial Stock</label>
                      <input
                        type="number"
                        value={formData.initialStock}
                        onChange={(e) => setFormData(prev => ({ ...prev, initialStock: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Alert Threshold</label>
                      <div className="relative">
                        <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warning" />
                        <input
                          type="number"
                          value={formData.alertThreshold}
                          onChange={(e) => setFormData(prev => ({ ...prev, alertThreshold: parseInt(e.target.value) || 0 }))}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/30 border border-border text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Eligibility Rules */}
                <div className="p-4 rounded-xl bg-muted/20 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Eligibility Rules</h3>
                    </div>
                    <span className="text-xs text-primary px-2 py-0.5 rounded border border-primary/30">
                      Advanced
                    </span>
                  </div>

                  {/* Min Rank Slider */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Min. Rank Required</span>
                      <span className="text-sm font-medium text-foreground">{tiers[formData.minRank]} Tier</span>
                    </div>
                    <Slider
                      value={[formData.minRank]}
                      onValueChange={(val) => setFormData(prev => ({ ...prev, minRank: val[0] }))}
                      max={3}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2">
                      {tiers.map((tier, idx) => (
                        <span 
                          key={tier}
                          className={cn(
                            "text-xs",
                            idx === formData.minRank ? "text-foreground font-medium" : "text-muted-foreground"
                          )}
                        >
                          {tier}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Department Restrictions */}
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2">
                      Restricted To Departments
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.departments.map((dept) => (
                        <span
                          key={dept}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm"
                        >
                          {dept}
                          <button 
                            onClick={() => removeDepartment(dept)}
                            className="hover:text-primary-foreground"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <button
                        onClick={() => {
                          const input = document.getElementById("dept-input");
                          if (input) input.focus();
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-border text-muted-foreground text-sm hover:border-primary hover:text-primary transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </button>
                    </div>
                    <input
                      id="dept-input"
                      type="text"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addDepartment()}
                      placeholder="Type department name and press Enter"
                      className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Preview */}
          <div className="flex items-center justify-between p-6 border-t border-border bg-muted/10">
            {/* Preview Card */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border">
              <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Gift className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">PREVIEW AGENT VIEW</p>
                <p className="font-semibold text-foreground">{formData.name || "Reward Name"}</p>
                <p className="text-sm text-primary flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  {formData.pointCost.toLocaleString()} pts
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handlePublish}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Publish to Vault
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddRewardModal;
