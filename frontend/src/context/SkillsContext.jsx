import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { api, isLoggedIn } from "../utils/api";
import { loadSkills, saveSkills } from "../utils/storage";

const SkillsContext = createContext(null);

export function SkillsProvider({ children }) {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  // Bug fix: keep a ref to skills so removeSkill always sees the latest list
  // without needing skills in its dependency array (which caused stale closures)
  const skillsRef = useRef(skills);
  useEffect(() => { skillsRef.current = skills; }, [skills]);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        if (isLoggedIn()) {
          const apiSkills = await api.skills.getAll();
          setSkills(apiSkills);
          saveSkills(apiSkills);
        } else {
          setSkills(loadSkills());
        }
      } catch (error) {
        console.error("Failed to load skills:", error);
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

  const addMultipleSkills = useCallback(async (newSkillsList) => {
    try {
      if (!Array.isArray(newSkillsList) || newSkillsList.length === 0) return [];
      if (isLoggedIn()) {
        const addedItems = await api.skills.addBatch(newSkillsList);
        setSkills(prev => {
          const existingMap = new Map(prev.map(s => [s.name.toLowerCase().trim(), s]));
          addedItems.forEach(item => {
            existingMap.set(item.name.toLowerCase().trim(), item);
          });
          const updated = Array.from(existingMap.values());
          saveSkills(updated);
          return updated;
        });
        return addedItems;
      } else {
        setSkills(prev => {
          const existingMap = new Map(prev.map(s => [s.name.toLowerCase().trim(), s]));
          newSkillsList.forEach(item => {
            existingMap.set(item.name.toLowerCase().trim(), item);
          });
          const updated = Array.from(existingMap.values());
          saveSkills(updated);
          return updated;
        });
        return newSkillsList;
      }
    } catch (error) {
      console.error("Failed to add multiple skills:", error);
      throw error;
    }
  }, []);

  // Bug fix: use skillsRef to avoid stale closure — no longer needs `skills` in deps
  const removeSkill = useCallback(async (name) => {
    try {
      if (isLoggedIn()) {
        const skillToDelete = skillsRef.current.find(s => s.name === name);
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
  }, []);

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
    <SkillsContext.Provider
      value={{ skills, loading, addSkill, addMultipleSkills, removeSkill, bulkReplace, clearAll }}
    >
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
