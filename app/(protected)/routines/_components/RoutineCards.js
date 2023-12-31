"use client";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import CardGrid from "@/components/Grid/CardGrid";
import RoutineCard from "@/app/(protected)/workout/_components/RoutineCard";

export default function RoutineCards({ routines, isSystem }) {
    const router = useRouter()

    const [expandedRoutines, setExpandedRoutines] = useState({});
    const toggleRoutineExpanded = (routineId) => {
        setExpandedRoutines(prevState => ({
            ...prevState,
            [routineId]: !prevState[routineId]
        }));
    };  

    const handleAction = (key, routine) => {
        if (key === "edit") {
            router.push(`/routines/${routine.id}`);
        } else if (key === "delete") {
            handleDelete(routine.id);
        }
    }

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this routine?');
        
        if (!isConfirmed) {
            return;
        }
    
        try {
            const response = await fetch(`/api/routines/${id}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete the routine');
            }
            toast.success('Routine deleted successfully!');
            router.refresh();
        } catch (error) {
            toast.error(`There was an error deleting the routine: ${error.message}`);

        }
    }

return (
    <CardGrid>
        {routines.map((routine) => (
            <RoutineCard 
                key={routine.id}
                routine={routine}
                isSystem={isSystem}
                isExpanded={expandedRoutines[routine.id]}
                onToggleExpanded={toggleRoutineExpanded}
                onAction={handleAction}
                isRoutine={true}
            />
        ))}
    </CardGrid>
);
}