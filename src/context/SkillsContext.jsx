import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { api, isLoggedIn } from "../utils/api";
import { loadSkills, saveSkills } from "../utils/storage";

const SkillsContext = createContext(null);

export function SkillsProvider({ children }) {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        if (isLoggedIn()) {
          const apiSkills = await api.skills.getAll();
          setSkills(apiSkills);
          // Also update local storage as a cache
          saveSkills(apiSkills);
        } else {
          const localSkills = loadSkills();
          setSkills(localSkills);
        }
      } catch (error) {
        console.error("Failed to load skills:", error);
        // Fallback to local
        setSkills(loadSkills());
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [user]);

  const addSkill = useCallback(async (skill) => {
    try {
      if (isLoggedIn()) {
        const newSkill = await api.skills.add(skill);
        setSkills(prev => {
          const updated = [...prev, newSkill];
          saveSkills(updated);
          return updated;
        });
      } else {
        setSkills(prev => {
          const updated = [...prev, skill];
          saveSkills(updated);
          return updated;
        });
      }
    } catch (error) {
      console.error("Failed to add skill:", error);
      throw error;
    }
  }, []);

  const removeSkill = useCallback(async (name) => {
    try {
      if (isLoggedIn()) {
        // We need the ID to delete from API. 
        // Let's find it in our current state.
        const skillToDelete = skills.find(s => s.name === name);
        if (skillToDelete?.id) {
          await api.skills.delete(skillToDelete.id);
        }
      }
      setSkills(prev => {
        const updated = prev.filter(s => s.name !== name);
        saveSkills(updated);
        return updated;
      });
    } catch (error) {
      console.error("Failed to remove skill:", error);
      throw error;
    }
  }, [skills]);

  const bulkReplace = useCallback(async (newSkills) => {
    try {
      if (isLoggedIn()) {
        await api.skills.bulkReplace(newSkills);
      }
      setSkills(newSkills);
      saveSkills(newSkills);
    } catch (error) {
      console.error("Failed to sync skills:", error);
      throw error;
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      if (isLoggedIn()) {
        await api.skills.bulkReplace([]);
      }
      setSkills([]);
      saveSkills([]);
    } catch (error) {
      console.error("Failed to clear skills:", error);
      throw error;
    }
  }, []);

  return (
    <SkillsContext.Provider value={{ skills, loading, addSkill, removeSkill, bulkReplace, clearAll }}>
      {children}
    </SkillsContext.Provider>
  );
}

export function useSkills() {
  const context = useContext(SkillsContext);
  if (!context) {
    throw new Error("useSkills must be used within a SkillsProvider");
  }
  return context;
}
